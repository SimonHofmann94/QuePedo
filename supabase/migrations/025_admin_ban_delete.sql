-- 025: Admin user management — ban/delete support + audit log.
--
-- Ban and delete themselves happen in auth.users via the service-role client
-- (auth.admin.updateUserById / deleteUser) — they are deliberately NOT RPCs,
-- because exposing auth.users writes to the API role is the wrong direction.
-- What this migration adds is the surrounding plumbing:
--
--   1. admin_audit_log — who did what to whom. Insert-only through an RPC,
--      readable by admins. Survives the target's deletion (no FK on target).
--   2. admin_list_users now also returns banned_until + last_sign_in_at from
--      auth.users so the panel can show status without a second round-trip.
--      The return type changes, so the function is dropped and recreated.
--
-- DEPLOY NOTE: apply before shipping the panel; the server action reads the
-- new columns and the audit RPC on every ban/delete.

-- ---------------------------------------------------------------------------
-- Audit log
CREATE TABLE admin_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    admin_email text NOT NULL,
    action text NOT NULL CHECK (action IN ('ban', 'unban', 'delete', 'update_tier', 'update_tacos', 'grant_admin', 'revoke_admin')),
    -- No FK: the row must outlive the target (the whole point for 'delete').
    target_user_id uuid NOT NULL,
    target_email text NOT NULL,
    detail jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_admin_audit_log_created ON admin_audit_log (created_at DESC);
CREATE INDEX idx_admin_audit_log_target ON admin_audit_log (target_user_id, created_at DESC);

ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
-- Admins read; nobody writes directly (insert goes through the RPC below).
CREATE POLICY "Admins can read audit log" ON admin_audit_log
    FOR SELECT USING (is_caller_admin());

CREATE OR REPLACE FUNCTION public.admin_log_action(
    p_action text,
    p_target_user_id uuid,
    p_target_email text,
    p_detail jsonb DEFAULT NULL
)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
    v_admin_email text;
    v_id uuid;
BEGIN
    IF NOT is_caller_admin() THEN RAISE EXCEPTION 'admin only'; END IF;
    SELECT email::text INTO v_admin_email FROM auth.users WHERE id = auth.uid();
    INSERT INTO admin_audit_log (admin_id, admin_email, action, target_user_id, target_email, detail)
    VALUES (auth.uid(), COALESCE(v_admin_email, '?'), p_action, p_target_user_id, p_target_email, p_detail)
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$function$;
REVOKE ALL ON FUNCTION public.admin_log_action(text, uuid, text, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_log_action(text, uuid, text, jsonb) TO authenticated;

-- ---------------------------------------------------------------------------
-- admin_list_users: add banned_until + last_sign_in_at.
-- Return type changes → must DROP first (CREATE OR REPLACE can't alter it).
DROP FUNCTION IF EXISTS public.admin_list_users(text, integer, integer);

CREATE FUNCTION public.admin_list_users(
    p_search text DEFAULT NULL,
    p_limit integer DEFAULT 50,
    p_offset integer DEFAULT 0
)
RETURNS TABLE (
    id uuid,
    email text,
    subscription_tier text,
    taco_balance integer,
    is_admin boolean,
    created_at timestamptz,
    banned_until timestamptz,
    last_sign_in_at timestamptz
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
    IF NOT is_caller_admin() THEN RAISE EXCEPTION 'admin only'; END IF;
    RETURN QUERY
    SELECT p.id, u.email::text, p.subscription_tier, p.taco_balance, p.is_admin, p.created_at,
           u.banned_until, u.last_sign_in_at
      FROM user_profiles p
      JOIN auth.users u ON u.id = p.id
     WHERE p_search IS NULL OR u.email ILIKE '%' || p_search || '%'
     ORDER BY p.created_at DESC
     LIMIT LEAST(GREATEST(p_limit, 1), 200) OFFSET GREATEST(p_offset, 0);
END;
$function$;
REVOKE ALL ON FUNCTION public.admin_list_users(text, integer, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_users(text, integer, integer) TO authenticated;

-- Recent audit entries for the panel.
CREATE OR REPLACE FUNCTION public.admin_list_audit(p_limit integer DEFAULT 50)
RETURNS TABLE (
    id uuid, admin_email text, action text, target_user_id uuid, target_email text,
    detail jsonb, created_at timestamptz
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
    IF NOT is_caller_admin() THEN RAISE EXCEPTION 'admin only'; END IF;
    RETURN QUERY
    SELECT a.id, a.admin_email, a.action, a.target_user_id, a.target_email, a.detail, a.created_at
      FROM admin_audit_log a
     ORDER BY a.created_at DESC
     LIMIT LEAST(GREATEST(p_limit, 1), 200);
END;
$function$;
REVOKE ALL ON FUNCTION public.admin_list_audit(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_audit(integer) TO authenticated;

-- Verification (run as an admin session, then as a non-admin):
--   SELECT * FROM admin_list_users(NULL, 10, 0);      -- admin: rows incl. banned_until; non-admin: 'admin only'
--   SELECT admin_log_action('ban', '<uuid>', 'x@y', '{}');  -- admin: uuid; non-admin: 'admin only'
--   INSERT INTO admin_audit_log ... via PostgREST       -- rejected (no INSERT policy)
