"use server"

import { createClient } from "@/utils/supabase/server"
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

export async function adminListUsers(search?: string): Promise<AdminUser[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("admin_list_users", {
    p_search: search?.trim() || null,
    p_limit: 50,
    p_offset: 0,
  })
  if (error) {
    console.error("[admin] list users error:", error)
    return []
  }
  return (data ?? []) as AdminUser[]
}

export async function adminUpdateUser(update: {
  userId: string
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
  return { success: data === true }
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
