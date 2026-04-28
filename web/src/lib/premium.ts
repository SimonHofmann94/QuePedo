import { createClient } from "@/utils/supabase/server"

/**
 * Server-side check: is the current user allowed to access premium content?
 * Returns true if the user is logged in AND (is_admin OR subscription_tier = 'premium').
 *
 * Free-tier identity policy: not logged in → false.
 */
export async function isUserPremium(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from("user_profiles")
    .select("subscription_tier, is_admin")
    .eq("id", user.id)
    .single()

  if (!data) return false
  return data.is_admin === true || data.subscription_tier === "premium"
}

export const FREE_GRAMMAR_LEVELS = new Set(["a1", "a2"])

export function isFreeGrammarLevel(level: string): boolean {
  return FREE_GRAMMAR_LEVELS.has(level.toLowerCase())
}
