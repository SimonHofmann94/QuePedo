-- Create user_activity table for tracking daily logins and streaks
CREATE TABLE IF NOT EXISTS user_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    activity_count INTEGER DEFAULT 1, -- Number of activities that day
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one row per user per day
    UNIQUE(user_id, activity_date)
);

-- Enable RLS
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own activity"
    ON user_activity FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
    ON user_activity FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_user_activity_user_date ON user_activity(user_id, activity_date DESC);

-- Function to record daily activity (called on login or any activity)
CREATE OR REPLACE FUNCTION record_user_activity(p_user_id UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO user_activity (user_id, activity_date)
    VALUES (p_user_id, CURRENT_DATE)
    ON CONFLICT (user_id, activity_date)
    DO UPDATE SET activity_count = user_activity.activity_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current streak
CREATE OR REPLACE FUNCTION get_user_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_streak INTEGER := 0;
    v_current_date DATE := CURRENT_DATE;
    v_check_date DATE;
BEGIN
    -- Check if there's activity today or yesterday (streak is still active)
    IF NOT EXISTS (
        SELECT 1 FROM user_activity 
        WHERE user_id = p_user_id 
        AND activity_date >= CURRENT_DATE - INTERVAL '1 day'
    ) THEN
        RETURN 0;
    END IF;
    
    -- Count consecutive days backwards from today
    FOR v_check_date IN 
        SELECT activity_date 
        FROM user_activity 
        WHERE user_id = p_user_id 
        ORDER BY activity_date DESC
    LOOP
        IF v_check_date = v_current_date THEN
            v_streak := v_streak + 1;
            v_current_date := v_current_date - INTERVAL '1 day';
        ELSE
            EXIT;
        END IF;
    END LOOP;
    
    RETURN v_streak;
END;
$$ LANGUAGE plpgsql;
