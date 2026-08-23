"use server"

import { createClient } from "@/utils/supabase/server"
import { createServiceRoleClient } from "@/utils/supabase/admin"
import {
  cultureCountrySchema,
  getCultureCountry,
  type CultureCountry,
} from "@chingon/shared"

// Admin surface — every RPC re-checks is_admin server-side (022), so these
// wrappers stay thin: session → rpc → typed result.

export type AdminUser = {
  id: string
  email: string
  subscription_tier: string
  taco_balance: number
  is_admin: boolean
  created_at: string
  /** From auth.users — non-null and in the future means banned. */
  banned_until: string | null
  last_sign_in_at: string | null
}

export type AdminAuditEntry = {
  id: string
  admin_email: string
  action: string
  target_user_id: string
  target_email: string
  detail: Record<string, unknown> | null
  created_at: string
}

export type AdminStats = {
  total_users: number
  premium_users: number
  admins: number
  new_users_7d: number
  games_7d: number
  game_players_7d: number
}

/** Is the current session an admin? (Page gate — RPCs re-check anyway.) */
export async function isCallerAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("is_caller_admin")
  if (error) return false
  return data === true
}

export async function adminListUsers(search?: string, offset = 0): Promise<AdminUser[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("admin_list_users", {
    p_search: search?.trim() || null,
    p_limit: 50,
    p_offset: Math.max(0, offset),
  })
  if (error) {
    console.error("[admin] list users error:", error)
    return []
  }
  return (data ?? []) as AdminUser[]
}

export async function adminUpdateUser(update: {
  userId: string
  /** For the audit row only — never used for authorization. */
  targetEmail?: string
  tier?: "free" | "premium"
  tacoBalance?: number
  isAdmin?: boolean
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("admin_update_user", {
    p_user_id: update.userId,
    p_tier: update.tier ?? null,
    p_taco_balance: update.tacoBalance ?? null,
    p_is_admin: update.isAdmin ?? null,
  })
  if (error) {
    // Raw DB errors stay server-side; only whitelisted, actionable messages
    // reach the browser (security review finding #2).
    console.error("[admin] update user error:", error)
    const msg = error.message.includes("cannot remove your own admin flag")
      ? "No puedes quitarte tu propio admin"
      : "No se pudo actualizar el usuario"
    return { success: false, error: msg }
  }
  if (data === true) {
    // Best-effort audit — an audit failure must never roll back the edit.
    const targetEmail = update.targetEmail ?? "?"
    if (update.tier !== undefined) void audit("update_tier", update.userId, targetEmail, { tier: update.tier })
    if (update.tacoBalance !== undefined) void audit("update_tacos", update.userId, targetEmail, { tacos: update.tacoBalance })
    if (update.isAdmin !== undefined) void audit(update.isAdmin ? "grant_admin" : "revoke_admin", update.userId, targetEmail)
  }
  return { success: data === true }
}

async function audit(
  action: string,
  targetUserId: string,
  targetEmail: string,
  detail?: Record<string, unknown>,
) {
  const supabase = await createClient()
  const { error } = await supabase.rpc("admin_log_action", {
    p_action: action,
    p_target_user_id: targetUserId,
    p_target_email: targetEmail,
    p_detail: detail ?? null,
  })
  if (error) console.error("[admin] audit log error:", error)
}

// ── Ban / delete ─────────────────────────────────────────────────────────
// These touch auth.users, which no RPC running as the API role can reach, so
// they go through the service-role client. Authorization happens HERE, before
// the privileged client is ever created: admin check, then a refusal to act
// on the caller's own account — the DB can't protect you from yourself on
// these operations, so the action does.

type AdminActionResult = { success: boolean; error?: string }

async function requireAdminActingOnOther(targetUserId: string): Promise<
  { ok: true; callerId: string } | { ok: false; error: string }
> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "No has iniciado sesión" }
  if (!(await isCallerAdmin())) return { ok: false, error: "Solo admins" }
  if (user.id === targetUserId) return { ok: false, error: "No puedes hacer esto con tu propia cuenta" }
  return { ok: true, callerId: user.id }
}

/**
 * Ban (or unban) an auth user. A ban makes Supabase refuse new sign-ins and
 * token refresh. An already-issued access token stays valid until its JWT
 * expires, so an open tab can survive up to the token TTL — the UI says so.
 */
export async function adminBanUser(input: {
  userId: string
  ban: boolean
}): Promise<AdminActionResult> {
  const gate = await requireAdminActingOnOther(input.userId)
  if (!gate.ok) return { success: false, error: gate.error }

  const admin = createServiceRoleClient()
  if (!admin) {
    console.error("[admin] SUPABASE_SERVICE_ROLE_KEY not set — cannot ban")
    return { success: false, error: "Falta SUPABASE_SERVICE_ROLE_KEY en el servidor" }
  }

  const { data: target, error: lookupError } = await admin.auth.admin.getUserById(input.userId)
  if (lookupError || !target.user) return { success: false, error: "Usuario no encontrado" }

  // Never let an admin ban another admin from the panel — demote first.
  const { data: profile } = await admin
    .from("user_profiles")
    .select("is_admin")
    .eq("id", input.userId)
    .maybeSingle()
  if (input.ban && profile?.is_admin) {
    return { success: false, error: "Quita el admin antes de bloquear esta cuenta" }
  }

  // 100 years is Supabase's own documented "permanent" ban; "none" lifts it.
  const { error } = await admin.auth.admin.updateUserById(input.userId, {
    ban_duration: input.ban ? "876000h" : "none",
  })
  if (error) {
    console.error("[admin] ban error:", error)
    return { success: false, error: input.ban ? "No se pudo bloquear" : "No se pudo desbloquear" }
  }

  await audit(input.ban ? "ban" : "unban", input.userId, target.user.email ?? "?")
  return { success: true }
}

/**
 * Permanently delete an auth user. Cascades through user_profiles and every
 * user-owned table via ON DELETE CASCADE. Irreversible — the caller must
 * re-type the account's email, which is checked server-side against the
 * real address, not the one the form happened to display.
 */
export async function adminDeleteUser(input: {
  userId: string
  confirmEmail: string
}): Promise<AdminActionResult> {
  const gate = await requireAdminActingOnOther(input.userId)
  if (!gate.ok) return { success: false, error: gate.error }

  const admin = createServiceRoleClient()
  if (!admin) {
    console.error("[admin] SUPABASE_SERVICE_ROLE_KEY not set — cannot delete")
    return { success: false, error: "Falta SUPABASE_SERVICE_ROLE_KEY en el servidor" }
  }

  const { data: target, error: lookupError } = await admin.auth.admin.getUserById(input.userId)
  if (lookupError || !target.user) return { success: false, error: "Usuario no encontrado" }

  const realEmail = target.user.email?.trim().toLowerCase() ?? ""
  if (!realEmail || input.confirmEmail.trim().toLowerCase() !== realEmail) {
    return { success: false, error: "El email no coincide" }
  }

  const { data: profile } = await admin
    .from("user_profiles")
    .select("is_admin")
    .eq("id", input.userId)
    .maybeSingle()
  if (profile?.is_admin) {
    return { success: false, error: "Quita el admin antes de eliminar esta cuenta" }
  }

  // Log BEFORE deleting: the audit row has no FK on the target precisely so
  // it survives, but the email lookup above won't be possible afterwards.
  await audit("delete", input.userId, realEmail)

  const { error } = await admin.auth.admin.deleteUser(input.userId)
  if (error) {
    console.error("[admin] delete error:", error)
    return { success: false, error: "No se pudo eliminar la cuenta" }
  }
  return { success: true }
}

export async function adminListAudit(limit = 50): Promise<AdminAuditEntry[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("admin_list_audit", { p_limit: limit })
  if (error) {
    console.error("[admin] audit list error:", error)
    return []
  }
  return (data ?? []) as AdminAuditEntry[]
}

export async function adminStats(): Promise<AdminStats | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("admin_stats")
  if (error) {
    console.error("[admin] stats error:", error)
    return null
  }
  return data as AdminStats
}

// ── Culture CMS ──────────────────────────────────────────────────────────
// Editor initial state: DB override if present, else the bundled base.
// Saves are zod-validated here, then hard-gated again in the RPC (admin
// check, id match, size cap). Rows materialize lazily on first save.

export async function adminGetCultureCountry(
  id: string,
): Promise<{ country: CultureCountry; source: "db" | "bundle" } | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("culture_content")
    .select("content")
    .eq("id", id.toLowerCase())
    .maybeSingle()
  if (data?.content) {
    const parsed = cultureCountrySchema.safeParse(data.content)
    if (parsed.success) return { country: parsed.data as CultureCountry, source: "db" }
  }
  const bundled = getCultureCountry(id)
  return bundled ? { country: bundled, source: "bundle" } : null
}

export async function adminSaveCultureCountry(
  input: unknown,
): Promise<{ success: boolean; error?: string }> {
  const parsed = cultureCountrySchema.safeParse(input)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return { success: false, error: `Inválido: ${issue.path.join(".")} — ${issue.message}` }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc("admin_upsert_culture_content", {
    p_id: parsed.data.id,
    p_content: parsed.data,
  })
  if (error) {
    console.error("[admin] save culture error:", error)
    return { success: false, error: "No se pudo guardar el contenido" }
  }
  return { success: data === true }
}
