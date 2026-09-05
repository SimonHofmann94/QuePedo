-- 027: Grammar exercise pool — the DB growth layer over the baked JSON.
--
-- Layering (024 Culture-CMS pattern, the one content-in-DB pattern in this
-- repo that is actually wired): shared/content/grammar-exercises/*.json stays
-- the BASE and mobile's offline fallback; this table is the ADDITIVE layer.
-- Read paths union both on `content_key` — the exact string exerciseKey()
-- produces in shared/grammar/exercises.ts — so one item can never be served
-- twice regardless of which source it came from, and no bulk seed is needed
-- (the 956 baked items already ship in the bundle).
--
-- Writes go exclusively through add_grammar_exercises() (SECURITY DEFINER,
-- house pattern cf. 022/024). There is deliberately NO client INSERT policy:
-- a premium user can grow the pool only through the RPC's caps, and the
-- script grows it via service_role (which bypasses RLS entirely).
--
-- DEPLOY NOTE: drops grammar_exercise_cache (014) — 2 stale rows written by a
-- Feb-2026 edge-function smoke test, zero readers since the April bake
-- (mobile/services/grammarExercise.ts, deleted in this change, was the last).

-- ---------------------------------------------------------------------------
-- grammar_exercises — the pool. One row per exercise, payload is the
-- GrammarQuestion object verbatim (validated app-side against
-- grammarQuestionSchema before it ever reaches the RPC).

CREATE TABLE grammar_exercises (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    level text NOT NULL CHECK (level IN ('a1', 'a2', 'b1', 'b2', 'c1', 'c2')),
    chapter_id integer NOT NULL CHECK (chapter_id >= 0 AND chapter_id <= 99),
    type text NOT NULL CHECK (type IN ('multiple_choice', 'fill_in_blank', 'sentence_reorder', 'error_correction')),
    payload jsonb NOT NULL,
    -- Identity across BOTH sources. Capped so the unique btree can never hit
    -- Postgres' 2704-byte index-row limit on a pathological model response.
    content_key text NOT NULL UNIQUE CHECK (length(content_key) BETWEEN 1 AND 500),
    source text NOT NULL DEFAULT 'ai' CHECK (source IN ('ai', 'admin', 'script')),
    model text,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_grammar_exercises_chapter ON grammar_exercises (level, chapter_id);

ALTER TABLE grammar_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read the grammar pool"
    ON grammar_exercises FOR SELECT
    TO authenticated
    USING (true);

-- ---------------------------------------------------------------------------
-- add_grammar_exercises — the only client write path into the pool.
--
-- Threat model: callable by any authenticated client (that is the point — a
-- premium user's 3 daily generations feed the shared pool instead of being
-- thrown away). Guards: premium-or-admin, ≤16 items per call, 64 KB payload
-- cap, per-row shape check, and `source` is forced to 'ai' for non-admins so
-- a client cannot pass its rows off as curated. Dedupe is the unique index,
-- not a read-then-write, so concurrent generators cannot race.
--
-- Returns the number of rows actually inserted (duplicates count as 0).

CREATE OR REPLACE FUNCTION public.add_grammar_exercises(
    p_level text,
    p_chapter_id integer,
    p_items jsonb,
    p_source text DEFAULT 'ai',
    p_model text DEFAULT NULL
) RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_tier text;
  v_is_admin boolean;
  v_source text;
  v_inserted integer;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT subscription_tier, is_admin INTO v_tier, v_is_admin
    FROM user_profiles WHERE id = v_uid;
  IF NOT FOUND OR (v_tier IS DISTINCT FROM 'premium' AND v_is_admin IS NOT TRUE) THEN
    RAISE EXCEPTION 'premium only';
  END IF;

  IF p_level IS NULL OR lower(p_level) !~ '^(a1|a2|b1|b2|c1|c2)$' THEN
    RAISE EXCEPTION 'bad level';
  END IF;
  IF p_chapter_id IS NULL OR p_chapter_id < 0 OR p_chapter_id > 99 THEN
    RAISE EXCEPTION 'bad chapter';
  END IF;
  IF jsonb_typeof(p_items) <> 'array' THEN
    RAISE EXCEPTION 'items must be an array';
  END IF;
  IF jsonb_array_length(p_items) = 0 OR jsonb_array_length(p_items) > 16 THEN
    RAISE EXCEPTION 'items: 1..16 per call';
  END IF;
  IF pg_column_size(p_items) > 65536 THEN
    RAISE EXCEPTION 'items too large';
  END IF;

  -- Only admins may label rows as curated; everyone else writes 'ai'.
  v_source := CASE
    WHEN v_is_admin IS TRUE AND p_source IN ('ai', 'admin', 'script') THEN p_source
    ELSE 'ai'
  END;

  WITH candidate AS (
    SELECT DISTINCT ON (it->>'content_key')
           it->>'content_key' AS content_key,
           it->>'type'        AS type,
           it->'payload'      AS payload
    FROM jsonb_array_elements(p_items) AS it
    WHERE it->>'content_key' IS NOT NULL
      AND length(it->>'content_key') BETWEEN 1 AND 500
      AND it->>'type' IN ('multiple_choice', 'fill_in_blank', 'sentence_reorder', 'error_correction')
      AND jsonb_typeof(it->'payload') = 'object'
    ORDER BY it->>'content_key'
  ), ins AS (
    INSERT INTO grammar_exercises (level, chapter_id, type, payload, content_key, source, model, created_by)
    SELECT lower(p_level), p_chapter_id, type, payload, content_key, v_source, p_model, v_uid
    FROM candidate
    ON CONFLICT (content_key) DO NOTHING
    RETURNING 1
  )
  SELECT count(*) INTO v_inserted FROM ins;

  RETURN v_inserted;
END;
$function$;

REVOKE ALL ON FUNCTION public.add_grammar_exercises(text, integer, jsonb, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.add_grammar_exercises(text, integer, jsonb, text, text) TO authenticated;

-- ---------------------------------------------------------------------------
-- user_grammar_progress — which items this user has already met.
--
-- Keyed by content_key, NOT by grammar_exercises.id, because the baked JSON
-- items have no row here. One identity function, both sources, one progress
-- table. This is what makes a growing pool actually feel bigger: the read
-- path serves unseen items first.

CREATE TABLE user_grammar_progress (
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_key text NOT NULL CHECK (length(content_key) BETWEEN 1 AND 500),
    level text NOT NULL,
    chapter_id integer NOT NULL,
    times_seen integer NOT NULL DEFAULT 0,
    times_correct integer NOT NULL DEFAULT 0,
    last_seen_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, content_key)
);

CREATE INDEX idx_user_grammar_progress_chapter
    ON user_grammar_progress (user_id, level, chapter_id);

ALTER TABLE user_grammar_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own grammar progress"
    ON user_grammar_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own grammar progress"
    ON user_grammar_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own grammar progress"
    ON user_grammar_progress FOR UPDATE
    USING (auth.uid() = user_id);

-- record_grammar_progress — one round-trip for a finished session.
-- SECURITY INVOKER on purpose: the RLS policies above are the authorization,
-- there is nothing here a user may not do to their own rows. Items repeated
-- within a single call are folded first — ON CONFLICT cannot touch the same
-- row twice in one statement.

CREATE OR REPLACE FUNCTION public.record_grammar_progress(
    p_level text,
    p_chapter_id integer,
    p_results jsonb
) RETURNS integer
LANGUAGE plpgsql SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_n integer;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  IF jsonb_typeof(p_results) <> 'array' OR jsonb_array_length(p_results) > 64 THEN
    RAISE EXCEPTION 'results: 0..64 per call';
  END IF;

  WITH folded AS (
    SELECT ck, max(corr) AS corr
    FROM (
      SELECT r->>'content_key' AS ck,
             CASE WHEN r->'correct' = 'true'::jsonb THEN 1 ELSE 0 END AS corr
      FROM jsonb_array_elements(p_results) AS r
    ) x
    WHERE ck IS NOT NULL AND length(ck) BETWEEN 1 AND 500
    GROUP BY ck
  ), up AS (
    INSERT INTO user_grammar_progress
      (user_id, content_key, level, chapter_id, times_seen, times_correct, last_seen_at)
    SELECT v_uid, ck, lower(p_level), p_chapter_id, 1, corr, now()
    FROM folded
    ON CONFLICT (user_id, content_key) DO UPDATE
      SET times_seen    = user_grammar_progress.times_seen + 1,
          times_correct = user_grammar_progress.times_correct + EXCLUDED.times_correct,
          last_seen_at  = now()
    RETURNING 1
  )
  SELECT count(*) INTO v_n FROM up;

  RETURN v_n;
END;
$function$;

REVOKE ALL ON FUNCTION public.record_grammar_progress(text, integer, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_grammar_progress(text, integer, jsonb) TO authenticated;

-- ---------------------------------------------------------------------------
-- Retire the dead cache from 014. Superseded by grammar_exercises above.
DROP TABLE IF EXISTS grammar_exercise_cache;
