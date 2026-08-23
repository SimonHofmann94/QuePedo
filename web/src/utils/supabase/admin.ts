import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Service-role client — bypasses RLS and can call `auth.admin.*`.
//
// Server-only by construction: the key is read from a non-NEXT_PUBLIC env var,
// so it can never be bundled for the browser. Use it only where there is no
// user session to act under (webhooks) or where the operation lives outside
// RLS entirely (banning / deleting an auth user). Every caller must do its
// own authorization BEFORE reaching for this; the client itself trusts nothing.
//
// Returns null when the key is absent so callers can fail with a clear
// message. `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel (the RevenueCat
// webhook depends on it) but is NOT in web/.env.local by default — add it
// there to exercise admin ban/delete locally.
export function createServiceRoleClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRole) return null
  return createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
