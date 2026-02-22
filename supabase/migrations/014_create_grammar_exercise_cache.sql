CREATE TABLE grammar_exercise_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level text NOT NULL,
  chapter_id integer NOT NULL,
  chapter_title text NOT NULL,
  exercises jsonb NOT NULL DEFAULT '[]',
  exercise_count integer NOT NULL DEFAULT 0,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (level, chapter_id)
);

-- Enable RLS
ALTER TABLE grammar_exercise_cache ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read cached exercises
CREATE POLICY "Authenticated users can read grammar exercise cache"
  ON grammar_exercise_cache
  FOR SELECT
  TO authenticated
  USING (true);
