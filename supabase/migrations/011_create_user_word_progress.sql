-- User word progress: spaced repetition tracking
CREATE TABLE user_word_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    master_vocab_id uuid REFERENCES master_vocabulary(id) ON DELETE CASCADE,
    user_vocab_id uuid REFERENCES user_vocabulary(id) ON DELETE CASCADE,
    box_level integer NOT NULL DEFAULT 1 CHECK (box_level >= 1 AND box_level <= 5),
    times_correct integer NOT NULL DEFAULT 0,
    times_wrong integer NOT NULL DEFAULT 0,
    streak integer NOT NULL DEFAULT 0,
    last_reviewed_at timestamptz,
    next_review_at timestamptz,
    created_at timestamptz DEFAULT now(),

    -- Exactly one vocabulary reference must be set
    CONSTRAINT one_vocab_reference CHECK (
        (master_vocab_id IS NOT NULL AND user_vocab_id IS NULL) OR
        (master_vocab_id IS NULL AND user_vocab_id IS NOT NULL)
    ),

    -- Unique progress per user per vocabulary word
    CONSTRAINT unique_master_progress UNIQUE (user_id, master_vocab_id),
    CONSTRAINT unique_user_progress UNIQUE (user_id, user_vocab_id)
);

-- Indexes
CREATE INDEX idx_user_word_progress_user_id ON user_word_progress(user_id);
CREATE INDEX idx_user_word_progress_next_review ON user_word_progress(user_id, next_review_at);
CREATE INDEX idx_user_word_progress_box_level ON user_word_progress(user_id, box_level);

-- Enable RLS
ALTER TABLE user_word_progress ENABLE ROW LEVEL SECURITY;

-- Users can only see their own progress
CREATE POLICY "Users can view their own progress"
    ON user_word_progress FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert their own progress"
    ON user_word_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update their own progress"
    ON user_word_progress FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own progress
CREATE POLICY "Users can delete their own progress"
    ON user_word_progress FOR DELETE
    USING (auth.uid() = user_id);
