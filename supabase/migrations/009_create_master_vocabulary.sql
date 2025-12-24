-- Master vocabulary: curated content for premium sets
CREATE TABLE master_vocabulary (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    term text NOT NULL,
    translations jsonb NOT NULL DEFAULT '{}',
    context_sentence text,
    context_translations jsonb DEFAULT '{}',
    part_of_speech text CHECK (part_of_speech IN ('noun', 'verb', 'adjective', 'adverb', 'phrase', 'preposition', 'conjunction', 'pronoun', 'interjection')),
    level text NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    category text,
    difficulty_rating integer DEFAULT 1 CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
    synonyms text[] DEFAULT '{}',
    gender text CHECK (gender IN ('m', 'f', NULL)),
    conjugation_group text CHECK (conjugation_group IN ('-ar', '-er', '-ir', 'irregular', NULL)),
    audio_url text,
    image_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Index for common queries
CREATE INDEX idx_master_vocabulary_level ON master_vocabulary(level);
CREATE INDEX idx_master_vocabulary_category ON master_vocabulary(category);
CREATE INDEX idx_master_vocabulary_term ON master_vocabulary(term);

-- Enable RLS
ALTER TABLE master_vocabulary ENABLE ROW LEVEL SECURITY;

-- Everyone can read master vocabulary
CREATE POLICY "Master vocabulary is publicly readable"
    ON master_vocabulary FOR SELECT
    USING (true);
