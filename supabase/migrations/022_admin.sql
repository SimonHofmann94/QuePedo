-- 022: Admin dashboard v1 — SECURITY DEFINER RPCs for user/subscription
-- management, gated on user_profiles.is_admin (which 020 already protects
-- from client-side escalation).
--
-- House rules (cf. 020): SECURITY DEFINER + pinned search_path, first-line
-- admin guard, REVOKE from anon/PUBLIC, GRANT to authenticated only.

-- ---------------------------------------------------------------------------
-- Guard helper — true iff the calling user is an admin.

CREATE OR REPLACE FUNCTION public.is_caller_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT COALESCE((SELECT is_admin FROM user_profiles WHERE id = auth.uid()), false)
$$;

REVOKE ALL ON FUNCTION public.is_caller_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_caller_admin() TO authenticated;

-- ---------------------------------------------------------------------------
-- List/search users (email from auth.users — only reachable through this
-- admin-gated function).

CREATE OR REPLACE FUNCTION public.admin_list_users(
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
  created_at timestamptz
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT is_caller_admin() THEN
    RAISE EXCEPTION 'admin only';
  END IF;

  RETURN QUERY
  SELECT p.id,
         u.email::text,
         p.subscription_tier,
         p.taco_balance,
         p.is_admin,
         p.created_at
    FROM user_profiles p
    JOIN auth.users u ON u.id = p.id
   WHERE p_search IS NULL OR u.email ILIKE '%' || p_search || '%'
   ORDER BY p.created_at DESC
   LIMIT LEAST(GREATEST(p_limit, 1), 200)
  OFFSET GREATEST(p_offset, 0);
END;
$function$;

REVOKE ALL ON FUNCTION public.admin_list_users(text, integer, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_users(text, integer, integer) TO authenticated;

-- ---------------------------------------------------------------------------
-- Update a user's subscription tier / taco balance / admin flag.
-- NULL params are left unchanged. Self-demotion is blocked so an admin
-- can't lock themselves out by accident.

CREATE OR REPLACE FUNCTION public.admin_update_user(
  p_user_id uuid,
  p_tier text DEFAULT NULL,
  p_taco_balance integer DEFAULT NULL,
  p_is_admin boolean DEFAULT NULL
)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT is_caller_admin() THEN
    RAISE EXCEPTION 'admin only';
  END IF;
  IF p_tier IS NOT NULL AND p_tier NOT IN ('free', 'premium') THEN
    RAISE EXCEPTION 'invalid tier: %', p_tier;
  END IF;
  IF p_taco_balance IS NOT NULL AND (p_taco_balance < 0 OR p_taco_balance > 10000) THEN
    RAISE EXCEPTION 'taco balance out of range';
  END IF;
  IF p_is_admin = false AND p_user_id = auth.uid() THEN
    RAISE EXCEPTION 'cannot remove your own admin flag';
  END IF;

  UPDATE user_profiles
     SET subscription_tier = COALESCE(p_tier, subscription_tier),
         taco_balance      = COALESCE(p_taco_balance, taco_balance),
         is_admin          = COALESCE(p_is_admin, is_admin),
         updated_at        = now()
   WHERE id = p_user_id;

  RETURN FOUND;
END;
$function$;

REVOKE ALL ON FUNCTION public.admin_update_user(uuid, text, integer, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_update_user(uuid, text, integer, boolean) TO authenticated;

-- ---------------------------------------------------------------------------
-- Dashboard KPIs. Only counts tables that exist everywhere (game_results
-- shipped in 021; user_activity is still drifted out of prod — see 020).

CREATE OR REPLACE FUNCTION public.admin_stats()
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT is_caller_admin() THEN
    RAISE EXCEPTION 'admin only';
  END IF;

  RETURN json_build_object(
    'total_users',   (SELECT count(*) FROM user_profiles),
    'premium_users', (SELECT count(*) FROM user_profiles WHERE subscription_tier = 'premium'),
    'admins',        (SELECT count(*) FROM user_profiles WHERE is_admin),
    'new_users_7d',  (SELECT count(*) FROM user_profiles WHERE created_at >= now() - interval '7 days'),
    'games_7d',      (SELECT count(*) FROM game_results  WHERE created_at >= now() - interval '7 days'),
    'game_players_7d', (SELECT count(DISTINCT user_id) FROM game_results WHERE created_at >= now() - interval '7 days')
  );
END;
$function$;

REVOKE ALL ON FUNCTION public.admin_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_stats() TO authenticated;
