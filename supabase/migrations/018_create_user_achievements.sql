-- 018_create_user_achievements.sql
-- Tracks which achievements a user has unlocked. One row per (user, achievement).

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id        uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id text NOT NULL,
  earned_at      timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users read own achievements"   ON user_achievements;
DROP POLICY IF EXISTS "users insert own achievements" ON user_achievements;

CREATE POLICY "users read own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users insert own achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS user_achievements_user_idx
  ON user_achievements(user_id);
