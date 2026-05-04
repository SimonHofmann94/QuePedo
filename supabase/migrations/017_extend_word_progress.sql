-- Extend user_word_progress with SM-2 spaced repetition fields.
-- The original 011 migration created the table with Leitner-box fields
-- (box_level, streak, times_correct, times_wrong). We keep those for
-- backwards compatibility and add SM-2 fields alongside.

ALTER TABLE user_word_progress
    ADD COLUMN IF NOT EXISTS ease numeric(4, 2) NOT NULL DEFAULT 2.5,
    ADD COLUMN IF NOT EXISTS interval_days integer NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS repetitions integer NOT NULL DEFAULT 0;

-- Ensure ease never drops below the SM-2 minimum
ALTER TABLE user_word_progress
    DROP CONSTRAINT IF EXISTS sm2_ease_min;
ALTER TABLE user_word_progress
    ADD CONSTRAINT sm2_ease_min CHECK (ease >= 1.3);

-- Index for "due now" queries (already covered by existing
-- idx_user_word_progress_next_review, but make sure it exists).
CREATE INDEX IF NOT EXISTS idx_user_word_progress_next_review_at
    ON user_word_progress (user_id, next_review_at);
