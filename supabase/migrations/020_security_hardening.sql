-- 020_security_hardening.sql
--
-- Security audit remediation. APPLIED TO PRODUCTION on 2026-07-10 via the
-- Supabase MCP as two migrations:
--   * security_hardening_is_admin_and_rpc_guards
--   * security_revoke_execute_from_public
-- This file is the source-controlled record of those changes. It is written
-- against the PRODUCTION schema (which includes is_admin / taco_balance /
-- daily_quiz_count and the consume_taco / check_and_increment_quiz functions
-- that were added out-of-band and are NOT present in this repo's 001–019).
--
-- Findings addressed:
--   F1 (safe subset) — is_admin privilege escalation via direct PostgREST UPDATE
--   F4 + advisor 0028 — cross-user griefing via p_user_id SECURITY DEFINER RPCs
--   advisor 0011 — mutable search_path on update_updated_at_column
--   advisor 0028/0029 — trigger functions & RPCs over-exposed to anon
--
-- NOT included (see audit report):
--   F1 remainder (lock subscription_tier / taco_balance) — BLOCKED until the
--     RevenueCat webhook is the authoritative server-side writer (currently the
--     mobile client writes subscription_tier, so locking it would break premium).
--   F3 (record_user_activity) / F5 (user_achievements) — those tables/functions
--     do not exist in production, so there is nothing to harden there yet.

-- ---------------------------------------------------------------------------
-- F1 (safe subset): block anon/authenticated from escalating is_admin.
--
-- A trigger, NOT `REVOKE UPDATE (is_admin)`: Supabase grants the API roles
-- table-level UPDATE, and a column-level REVOKE cannot override a table-level
-- grant. The trigger rejects the change for the API roles while service_role
-- (the RevenueCat webhook) and dashboard/postgres (auth.role() IS NULL) pass.
-- Extend the guarded-column list here once the tier/economy columns are safe
-- to lock (F1 remainder).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_privileged_profile_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  IF auth.role() IN ('anon', 'authenticated') THEN
    IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
      RAISE EXCEPTION 'modifying is_admin is not permitted';
    END IF;
    -- TODO(F1 remainder): after the RC webhook is authoritative, also guard
    -- subscription_tier / taco_balance / trial_ends_at here.
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_user_profiles_privileges ON public.user_profiles;
CREATE TRIGGER protect_user_profiles_privileges
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_privileged_profile_columns();

-- ---------------------------------------------------------------------------
-- F4 + griefing guards: SECURITY DEFINER RPCs that take p_user_id must only
-- act on the caller (auth.uid()). Signatures unchanged → callers unaffected.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.consume_taco(p_user_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_tier TEXT; v_balance INTEGER; v_admin BOOLEAN;
BEGIN
  IF auth.uid() IS NULL OR p_user_id <> auth.uid() THEN
    RAISE EXCEPTION 'cannot act on behalf of another user';
  END IF;
  SELECT subscription_tier, taco_balance, is_admin INTO v_tier, v_balance, v_admin
    FROM user_profiles WHERE id = p_user_id;
  IF v_admin OR v_tier = 'premium' THEN RETURN TRUE; END IF;
  IF v_balance <= 0 THEN RETURN FALSE; END IF;
  UPDATE user_profiles SET taco_balance = taco_balance - 1, updated_at = NOW()
    WHERE id = p_user_id;
  RETURN TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_and_increment_quiz(p_user_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_tier TEXT; v_count INTEGER; v_last_date DATE; v_admin BOOLEAN;
BEGIN
  IF auth.uid() IS NULL OR p_user_id <> auth.uid() THEN
    RAISE EXCEPTION 'cannot act on behalf of another user';
  END IF;
  SELECT subscription_tier, daily_quiz_count, last_quiz_date, is_admin
    INTO v_tier, v_count, v_last_date, v_admin
    FROM user_profiles WHERE id = p_user_id;
  IF v_admin OR v_tier = 'premium' THEN RETURN TRUE; END IF;
  IF v_last_date IS NULL OR v_last_date < CURRENT_DATE THEN v_count := 0; END IF;
  IF v_count >= 3 THEN RETURN FALSE; END IF;
  UPDATE user_profiles SET daily_quiz_count = v_count + 1, last_quiz_date = CURRENT_DATE, updated_at = NOW()
    WHERE id = p_user_id;
  RETURN TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_and_increment_grammar_ai(p_user_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_tier text; v_is_admin boolean; v_count integer; v_last_date date;
BEGIN
  IF auth.uid() IS NULL OR p_user_id <> auth.uid() THEN
    RAISE EXCEPTION 'cannot act on behalf of another user';
  END IF;
  SELECT subscription_tier, is_admin, daily_grammar_ai_count, last_grammar_ai_date
    INTO v_tier, v_is_admin, v_count, v_last_date
    FROM user_profiles WHERE id = p_user_id;
  IF NOT FOUND THEN RETURN false; END IF;
  IF v_tier != 'premium' AND v_is_admin IS NOT TRUE THEN RETURN false; END IF;
  IF v_last_date IS NULL OR v_last_date < CURRENT_DATE THEN v_count := 0; END IF;
  IF v_count >= 3 THEN RETURN false; END IF;
  UPDATE user_profiles SET daily_grammar_ai_count = v_count + 1, last_grammar_ai_date = CURRENT_DATE, updated_at = NOW()
    WHERE id = p_user_id;
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_grammar_ai_remaining(p_user_id uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_count integer; v_last_date date;
BEGIN
  IF auth.uid() IS NULL OR p_user_id <> auth.uid() THEN
    RAISE EXCEPTION 'cannot act on behalf of another user';
  END IF;
  SELECT daily_grammar_ai_count, last_grammar_ai_date INTO v_count, v_last_date
    FROM user_profiles WHERE id = p_user_id;
  IF NOT FOUND THEN RETURN 0; END IF;
  IF v_last_date IS NULL OR v_last_date < CURRENT_DATE THEN RETURN 3; END IF;
  RETURN GREATEST(0, 3 - v_count);
END;
$$;

-- ---------------------------------------------------------------------------
-- advisor 0011 / F2: pin search_path on trigger functions.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, trial_started_at, trial_ends_at)
  VALUES (NEW.id, NOW(), NOW() + INTERVAL '14 days')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- advisor 0028/0029: stop over-exposing functions on the REST API.
-- EXECUTE is granted to PUBLIC by default, so revoking from anon/authenticated
-- alone is a no-op — revoke from PUBLIC. Trigger firing does NOT require the
-- EXECUTE privilege, so the triggers keep working.
-- ---------------------------------------------------------------------------
REVOKE EXECUTE ON FUNCTION public.create_user_profile() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_vocabulary_set_word_count() FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.consume_taco(uuid) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.consume_taco(uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.check_and_increment_quiz(uuid) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.check_and_increment_quiz(uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.check_and_increment_grammar_ai(uuid) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.check_and_increment_grammar_ai(uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.get_grammar_ai_remaining(uuid) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_grammar_ai_remaining(uuid) TO authenticated;

-- ---------------------------------------------------------------------------
-- Verified after apply (all rolled back, no data mutated):
--   authenticated + is_admin change      → BLOCKED
--   authenticated + normal column change → OK
--   service_role / dashboard + is_admin  → OK (admin-granting still works)
--   RPC with p_user_id != caller         → BLOCKED; p_user_id == caller → OK
-- ---------------------------------------------------------------------------
