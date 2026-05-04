-- 016_add_revenuecat_id.sql
-- Adds a stable column to track the RevenueCat App User ID on user_profiles.
-- We default this to the Supabase auth user ID, but keeping it as its own
-- column lets us handle SUBSCRIBER_ALIAS events from RevenueCat (e.g. when an
-- anonymous web visitor purchases a sub and is later aliased to a Supabase
-- user) without losing the link.

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS revenuecat_user_id TEXT;

CREATE INDEX IF NOT EXISTS idx_user_profiles_revenuecat_user_id
  ON user_profiles (revenuecat_user_id);
