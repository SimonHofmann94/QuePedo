-- 023: Let admin_update_user (022) toggle is_admin without weakening F1 (020).
--
-- Problem: the 020 trigger keys ONLY on auth.role(), which reads the caller's
-- JWT and is unchanged inside SECURITY DEFINER functions — so the legitimate
-- admin RPC was blocked too (fails closed; found in the 022 security review).
--
-- Fix: also require current_user to be an API role. Direct PostgREST writes
-- run as SET ROLE anon/authenticated → still blocked. The admin RPC executes
-- as its owner (postgres) via SECURITY DEFINER → exempt; it enforces
-- is_caller_admin() itself as the first line. service_role / dashboard paths
-- behave exactly as before (auth.role() is not an API role there).

CREATE OR REPLACE FUNCTION public.protect_privileged_profile_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  IF auth.role() IN ('anon', 'authenticated')
     AND current_user IN ('anon', 'authenticated') THEN
    IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
      RAISE EXCEPTION 'modifying is_admin is not permitted';
    END IF;
    -- TODO(F1 remainder): after the RC webhook is authoritative, also guard
    -- subscription_tier / taco_balance / trial_ends_at here.
  END IF;
  RETURN NEW;
END;
$$;
