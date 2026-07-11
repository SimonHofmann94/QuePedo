-- 021: Juegos — game_results table + award_tacos RPC.
--
-- Design: docs/superpowers/specs/2026-07-11-juegos-games-design.md
-- Payout/cap math lives in shared/games/scoring.ts; this migration only adds
-- the storage primitive and a hard server-side ceiling on taco credits.
--
-- DEPLOY NOTE (known prod drift, see 020 header): verify that
-- user_profiles.taco_balance exists in the target DB (it does — mobile uses
-- it) and that record_user_activity / user_achievements have been applied
-- (020 notes they were missing in prod at audit time). Games degrade
-- gracefully without them (activity/achievements calls are try/catch), but
-- streak credit needs record_user_activity.

-- ---------------------------------------------------------------------------
-- game_results — one row per completed session. Immutable from the client:
-- select/insert only (no update/delete policies); the tacos_awarded flag is
-- flipped exclusively by the SECURITY DEFINER function below.

CREATE TABLE game_results (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id text NOT NULL CHECK (game_id IN ('chili_rush', 'loteria', 'construye')),
    score integer NOT NULL CHECK (score >= 0),
    correct integer NOT NULL CHECK (correct >= 0),
    total integer NOT NULL CHECK (total >= 1),
    duration_ms integer NOT NULL CHECK (duration_ms > 0),
    tacos_earned integer NOT NULL DEFAULT 0 CHECK (tacos_earned >= 0),
    tacos_awarded boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_game_results_user_game ON game_results (user_id, game_id, created_at DESC);

ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own game results"
    ON game_results FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game results"
    ON game_results FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- award_tacos(p_result_id) — credit user_profiles.taco_balance for one game
-- result, exactly once per row.
--
-- Threat model: this RPC is callable by any authenticated client, so it must
-- be self-limiting (cf. 020 F4). Guards:
--   * row must belong to auth.uid() and not be awarded yet (idempotent)
--   * ≤ 2 tacos per row (scoring.ts max payout), regardless of stored value
--   * ≤ 9 tacos per day total (scoring.ts daily-curve maximum) — a client
--     inserting fabricated rows caps at the same ceiling as honest play
--
-- Deliberately NO clamp to FREE_TIER_LIMITS.maxTacos: the daily ceiling
-- already bounds farming, and clamping would punish saving tacos up.
-- Returns the amount actually credited (may be less than tacos_earned).

CREATE OR REPLACE FUNCTION public.award_tacos(p_result_id uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  v_row game_results%ROWTYPE;
  v_awarded_today integer;
  v_amount integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT * INTO v_row FROM game_results
    WHERE id = p_result_id AND user_id = auth.uid()
    FOR UPDATE;
  IF NOT FOUND OR v_row.tacos_awarded THEN
    RETURN 0;
  END IF;

  -- Mark awarded first — even a 0-taco award consumes the row.
  UPDATE game_results SET tacos_awarded = true WHERE id = p_result_id;

  v_amount := LEAST(GREATEST(v_row.tacos_earned, 0), 2);

  SELECT COALESCE(SUM(tacos_earned), 0) INTO v_awarded_today
    FROM game_results
    WHERE user_id = auth.uid()
      AND tacos_awarded = true
      AND id <> p_result_id
      AND created_at >= date_trunc('day', now());
  v_amount := LEAST(v_amount, GREATEST(0, 9 - v_awarded_today));

  IF v_amount > 0 THEN
    UPDATE user_profiles
      SET taco_balance = taco_balance + v_amount, updated_at = now()
      WHERE id = auth.uid();
  END IF;

  RETURN v_amount;
END;
$function$;

-- Match 020 exposure hardening: authenticated only.
REVOKE ALL ON FUNCTION public.award_tacos(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.award_tacos(uuid) TO authenticated;
