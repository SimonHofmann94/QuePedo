import { NextResponse } from "next/server"
import type { SupabaseClient } from "@supabase/supabase-js"
import { createServiceRoleClient } from "@/utils/supabase/admin"
import { timingSafeEqual } from "node:crypto"
import { RC_ENTITLEMENT_ID } from "@chingon/shared"

type AdminSupabase = SupabaseClient

// RevenueCat → our backend. Configure the webhook URL + Authorization header
// (as `Bearer <secret>`) in the RevenueCat dashboard.
//
// We trust the Bearer secret — RevenueCat does not currently sign payloads,
// and the secret + HTTPS is the documented integrity model.
//
// Updates `user_profiles.subscription_tier` between 'free' and 'premium'
// via the service-role client (no user session in webhook context, so RLS
// can't authenticate the request).

export const runtime = "nodejs"

interface RcEvent {
  type?: string
  app_user_id?: string
  original_app_user_id?: string
  aliases?: string[]
  entitlement_ids?: string[] | null
  entitlement_id?: string | null
  expiration_at_ms?: number | null
}

interface RcWebhookBody {
  api_version?: string
  event?: RcEvent
}

// Events that should grant or extend premium access.
const GRANT_EVENTS = new Set([
  "INITIAL_PURCHASE",
  "RENEWAL",
  "PRODUCT_CHANGE",
  "UNCANCELLATION",
  "NON_RENEWING_PURCHASE",
])

// Events that revoke premium access.
const REVOKE_EVENTS = new Set([
  "EXPIRATION",
  "SUBSCRIPTION_PAUSED",
])

// CANCELLATION fires on user-initiated cancel, but the sub usually remains
// active until expiration — so don't downgrade on CANCELLATION alone unless
// it's a refund (RC sets cancel_reason to BILLING_ERROR / CUSTOMER_SUPPORT
// for refunds; we treat plain CANCELLATION as a no-op and wait for EXPIRATION).

export async function POST(req: Request) {
  // 1. Auth check — timing-safe.
  const expected = process.env.RC_WEBHOOK_AUTH
  if (!expected) {
    console.error("[rc-webhook] RC_WEBHOOK_AUTH not configured")
    return NextResponse.json(
      { error: "webhook not configured" },
      { status: 500 }
    )
  }

  const authHeader = req.headers.get("authorization") ?? ""
  const presented = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : ""

  if (!safeEqual(presented, expected)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  // 2. Parse + validate.
  let body: RcWebhookBody
  try {
    body = (await req.json()) as RcWebhookBody
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }

  const event = body.event
  if (!event?.type) {
    return NextResponse.json({ error: "missing event.type" }, { status: 400 })
  }

  const supabase = getServiceRoleClient()
  if (!supabase) {
    return NextResponse.json(
      { error: "supabase not configured" },
      { status: 500 }
    )
  }

  try {
    if (event.type === "SUBSCRIBER_ALIAS") {
      await handleAlias(supabase, event)
      return NextResponse.json({ ok: true })
    }

    const userId = await resolveUserId(supabase, event)
    if (!userId) {
      // Unknown user — RC may have an alias we don't know about, or the
      // app_user_id is a RevenueCat anonymous ID from a flow we don't
      // support yet. Acknowledge so RC doesn't keep retrying forever.
      console.warn(
        "[rc-webhook] could not resolve user for event",
        event.type,
        event.app_user_id
      )
      return NextResponse.json({ ok: true, note: "user not found" })
    }

    // Mirror mobile rule: never downgrade an admin.
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("is_admin, subscription_tier")
      .eq("id", userId)
      .single()

    if (profile?.is_admin) {
      return NextResponse.json({ ok: true, note: "admin — skipped" })
    }

    if (entitlementMatches(event)) {
      if (GRANT_EVENTS.has(event.type)) {
        await setTier(supabase, userId, "premium", event.app_user_id)
      } else if (REVOKE_EVENTS.has(event.type)) {
        await setTier(supabase, userId, "free", event.app_user_id)
      }
    } else if (event.type === "EXPIRATION") {
      // Even without an entitlement_ids match (some EXPIRATION payloads
      // omit it), an expiration of any subscription should drop premium.
      await setTier(supabase, userId, "free", event.app_user_id)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[rc-webhook] handler failed", err)
    return NextResponse.json({ error: "internal error" }, { status: 500 })
  }
}

function entitlementMatches(event: RcEvent): boolean {
  if (event.entitlement_id === RC_ENTITLEMENT_ID) return true
  if (Array.isArray(event.entitlement_ids)) {
    return event.entitlement_ids.includes(RC_ENTITLEMENT_ID)
  }
  // Some lifecycle events (RENEWAL, INITIAL_PURCHASE) don't include
  // entitlement_ids on every plan shape — assume they match if our
  // RC project only has one entitlement.
  return event.entitlement_ids === null || event.entitlement_ids === undefined
}

async function resolveUserId(
  supabase: AdminSupabase,
  event: RcEvent
): Promise<string | null> {
  // Mobile + web both use Supabase user.id as appUserId, so the direct
  // path is to look it up on `user_profiles.id`.
  const candidates = [
    event.app_user_id,
    event.original_app_user_id,
    ...(event.aliases ?? []),
  ].filter((v): v is string => Boolean(v))

  for (const id of candidates) {
    if (!isUuid(id)) continue
    const { data } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("id", id)
      .maybeSingle()
    if (data?.id) return data.id
  }

  // Fallback: maybe the user purchased anonymously and we already stored
  // the RC anonymous ID via SUBSCRIBER_ALIAS.
  for (const id of candidates) {
    const { data } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("revenuecat_user_id", id)
      .maybeSingle()
    if (data?.id) return data.id
  }

  return null
}

async function handleAlias(
  supabase: AdminSupabase,
  event: RcEvent
): Promise<void> {
  // SUBSCRIBER_ALIAS happens when an anonymous RC user is identified to
  // a real Supabase user. We store the previous (anonymous) RC ID on the
  // user_profile so future webhook lookups can find them.
  const supabaseId = [event.app_user_id, event.original_app_user_id].find(
    (id) => id && isUuid(id)
  )
  const aliasId = (event.aliases ?? []).find(
    (id) => id && id !== supabaseId
  )

  if (!supabaseId || !aliasId) return

  await supabase
    .from("user_profiles")
    .update({
      revenuecat_user_id: aliasId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", supabaseId)
}

async function setTier(
  supabase: AdminSupabase,
  userId: string,
  tier: "premium" | "free",
  rcUserId: string | undefined
): Promise<void> {
  const update: Record<string, unknown> = {
    subscription_tier: tier,
    updated_at: new Date().toISOString(),
  }
  if (rcUserId) update.revenuecat_user_id = rcUserId

  const { error } = await supabase
    .from("user_profiles")
    .update(update)
    .eq("id", userId)

  if (error) {
    console.error("[rc-webhook] failed to update tier", { userId, tier, error })
    throw error
  }
}

function getServiceRoleClient() {
  const client = createServiceRoleClient()
  if (!client) console.error("[rc-webhook] missing supabase env")
  return client
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  )
}
