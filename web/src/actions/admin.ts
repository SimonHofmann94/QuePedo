"use server"

import { createClient } from "@/utils/supabase/server"

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
