-- Vocabulary sets: premium word collections
CREATE TABLE vocabulary_sets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    level text CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    category text,
    word_count integer NOT NULL DEFAULT 0,
    is_premium boolean NOT NULL DEFAULT true,
    price_cents integer,
    sort_order integer NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Vocabulary set items: link sets to vocabulary
CREATE TABLE vocabulary_set_items (
    set_id uuid NOT NULL REFERENCES vocabulary_sets(id) ON DELETE CASCADE,
    vocabulary_id uuid NOT NULL REFERENCES master_vocabulary(id) ON DELETE CASCADE,
    sort_order integer NOT NULL DEFAULT 0,
    PRIMARY KEY (set_id, vocabulary_id)
);

-- Indexes
CREATE INDEX idx_vocabulary_sets_level ON vocabulary_sets(level);
CREATE INDEX idx_vocabulary_sets_sort_order ON vocabulary_sets(sort_order);
CREATE INDEX idx_vocabulary_set_items_vocabulary ON vocabulary_set_items(vocabulary_id);

-- Enable RLS
ALTER TABLE vocabulary_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_set_items ENABLE ROW LEVEL SECURITY;

-- Everyone can read vocabulary sets (for browsing/purchasing)
CREATE POLICY "Vocabulary sets are publicly readable"
    ON vocabulary_sets FOR SELECT
    USING (true);

-- Everyone can read vocabulary set items
CREATE POLICY "Vocabulary set items are publicly readable"
    ON vocabulary_set_items FOR SELECT
    USING (true);

-- Function to update word_count when items change
CREATE OR REPLACE FUNCTION update_vocabulary_set_word_count()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE vocabulary_sets
        SET word_count = word_count + 1, updated_at = now()
        WHERE id = NEW.set_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE vocabulary_sets
        SET word_count = word_count - 1, updated_at = now()
        WHERE id = OLD.set_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to keep word_count in sync
CREATE TRIGGER trigger_update_word_count
AFTER INSERT OR DELETE ON vocabulary_set_items
FOR EACH ROW EXECUTE FUNCTION update_vocabulary_set_word_count();
