import { createClient } from "@/utils/supabase/server"

/**
 * Server-side check: is the current user allowed to access premium content?
 * Returns true if the user is logged in AND (is_admin OR subscription_tier = 'premium').
 *
 * Free-tier identity policy: not logged in → false.
 */
export async function isUserPremium(): Promise<boolean> {
  return (await getUserAccess()).isPremium
}

/**
 * One round-trip for everything a layout needs to know about the caller.
 * `isAdmin` only drives UI (the admin nav link) — every admin route and RPC
 * re-checks server-side, so a wrong value here can't grant access.
 */
export async function getUserAccess(): Promise<{ isPremium: boolean; isAdmin: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { isPremium: false, isAdmin: false }

  const { data } = await supabase
    .from("user_profiles")
    .select("subscription_tier, is_admin")
    .eq("id", user.id)
    .single()

  if (!data) return { isPremium: false, isAdmin: false }
  const isAdmin = data.is_admin === true
  return { isPremium: isAdmin || data.subscription_tier === "premium", isAdmin }
}

export const FREE_GRAMMAR_LEVELS = new Set(["a1", "a2"])

export function isFreeGrammarLevel(level: string): boolean {
  return FREE_GRAMMAR_LEVELS.has(level.toLowerCase())
}
