-- 028_activity_achievements.sql
--
-- APPLIED TO PRODUCTION on 2026-10-30 via the Supabase MCP as
-- `activity_achievements`, WITHOUT the DROP ... IF EXISTS lines (none of the
-- objects existed, and the MCP auto-declines statements it deems destructive).
-- Verified with a rollback-only DO block: streak 2 for yesterday+day-before
-- (003 returned 0), record_user_activity returns 1 then 2, streak 3 with
-- today, direct INSERT blocked, foreign p_user_id blocked, anon has no EXECUTE.
--
-- Streaks + achievements for production. Written against the PRODUCTION
-- schema, which never received 003 (user_activity) or 018 (user_achievements)
-- — see the 020 header. Until this lands, every streak read returns 0 and
-- every achievement unlock fails silently (all callers degrade gracefully).
--
-- Differences from 003 on purpose:
--   * record_user_activity is guarded to the caller (020's F3, deferred there
--     only because the function did not exist) and returns the day's
--     activity_count, so callers run the streak/achievement check once per
--     day instead of on every flashcard.
--   * No client INSERT policy on user_activity: writes go through the RPC
--     only, so a client cannot backfill fake streak days.
--   * get_user_streak fixes 003's off-by-one: a user active yesterday but not
--     yet today kept a guard pass but then counted from today and got 0.
--
-- Day boundary is the DB's CURRENT_DATE (UTC).
-- ponytail: UTC day, per-user timezone if users complain about midnight.

-- ---------------------------------------------------------------------------
-- user_activity — one row per user per active day.

CREATE TABLE IF NOT EXISTS public.user_activity (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date  date NOT NULL,
  activity_count integer NOT NULL DEFAULT 1,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, activity_date)
);

ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own activity"   ON public.user_activity;
DROP POLICY IF EXISTS "Users can insert their own activity" ON public.user_activity;

CREATE POLICY "Users can view their own activity"
  ON public.user_activity FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE INDEX IF NOT EXISTS idx_user_activity_user_date
  ON public.user_activity (user_id, activity_date DESC);

-- ---------------------------------------------------------------------------
-- record_user_activity — idempotent per day; returns that day's count
-- (1 = first learning activity today).

DROP FUNCTION IF EXISTS public.record_user_activity(uuid);

CREATE FUNCTION public.record_user_activity(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE v_count integer;
BEGIN
  IF auth.uid() IS NULL OR p_user_id <> auth.uid() THEN
    RAISE EXCEPTION 'cannot act on behalf of another user';
  END IF;
  INSERT INTO public.user_activity (user_id, activity_date)
  VALUES (p_user_id, CURRENT_DATE)
  ON CONFLICT (user_id, activity_date)
  DO UPDATE SET activity_count = public.user_activity.activity_count + 1
  RETURNING activity_count INTO v_count;
  RETURN v_count;
END;
$$;

-- ---------------------------------------------------------------------------
-- get_user_streak — consecutive days ending today, or ending yesterday if
-- today has no activity yet (the streak is still alive until midnight).
-- SECURITY INVOKER: RLS limits it to the caller's own rows.

DROP FUNCTION IF EXISTS public.get_user_streak(uuid);

CREATE FUNCTION public.get_user_streak(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = ''
AS $$
DECLARE
  v_streak   integer := 0;
  v_expected date;
  v_day      date;
BEGIN
  SELECT max(activity_date) INTO v_expected
    FROM public.user_activity
   WHERE user_id = p_user_id AND activity_date >= CURRENT_DATE - 1;
  IF v_expected IS NULL THEN RETURN 0; END IF;

  FOR v_day IN
    SELECT activity_date FROM public.user_activity
     WHERE user_id = p_user_id AND activity_date <= v_expected
     ORDER BY activity_date DESC
  LOOP
    EXIT WHEN v_day <> v_expected;
    v_streak   := v_streak + 1;
    v_expected := v_expected - 1;
  END LOOP;

  RETURN v_streak;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.record_user_activity(uuid) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.record_user_activity(uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.get_user_streak(uuid) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_user_streak(uuid) TO authenticated;

-- ---------------------------------------------------------------------------
-- user_achievements — as 018. The client inserts its own rows (the unlock
-- logic lives in web/src/actions/achievements.ts + mobile/services). That
-- means a user can self-grant an achievement; acceptable while achievements
-- are cosmetic. Move unlocks server-side before they ever pay out tacos.

CREATE TABLE IF NOT EXISTS public.user_achievements (
  user_id        uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id text NOT NULL,
  earned_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users read own achievements"   ON public.user_achievements;
DROP POLICY IF EXISTS "users insert own achievements" ON public.user_achievements;

CREATE POLICY "users read own achievements"
  ON public.user_achievements FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "users insert own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

-- No separate user_id index: it is the leading column of the primary key.
