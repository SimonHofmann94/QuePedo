-- User vocabulary: personal words added by users
CREATE TABLE user_vocabulary (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    term text NOT NULL,
    translations jsonb NOT NULL DEFAULT '{}',
    context_sentence text,
    difficulty_rating integer DEFAULT 1 CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
    synonyms text[] DEFAULT '{}',
    tags text[] DEFAULT '{}',
    source text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'ai_generated')),
    ai_prompt text,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_user_vocabulary_user_id ON user_vocabulary(user_id);
CREATE INDEX idx_user_vocabulary_term ON user_vocabulary(term);

-- Enable RLS
ALTER TABLE user_vocabulary ENABLE ROW LEVEL SECURITY;

-- Users can only see their own vocabulary
CREATE POLICY "Users can view their own vocabulary"
    ON user_vocabulary FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own vocabulary
CREATE POLICY "Users can insert their own vocabulary"
    ON user_vocabulary FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own vocabulary
CREATE POLICY "Users can update their own vocabulary"
    ON user_vocabulary FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own vocabulary
CREATE POLICY "Users can delete their own vocabulary"
    ON user_vocabulary FOR DELETE
    USING (auth.uid() = user_id);
