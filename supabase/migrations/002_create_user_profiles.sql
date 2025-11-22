-- Create user_profiles table for onboarding and preferences
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Learning preferences
    native_language TEXT NOT NULL DEFAULT 'English',
    target_language TEXT NOT NULL DEFAULT 'Spanish',
    proficiency_level TEXT NOT NULL CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced')),
    learning_goals TEXT[] DEFAULT '{}',
    daily_study_minutes INTEGER DEFAULT 15,
    
    -- Additional profile data
    learning_style TEXT CHECK (learning_style IN ('visual', 'auditory', 'reading', 'kinesthetic', 'mixed')),
    preferred_content_types TEXT[] DEFAULT '{}', -- ['video', 'text', 'audio', 'interactive']
    interests TEXT[] DEFAULT '{}', -- ['travel', 'business', 'culture', 'food', etc.]
    timezone TEXT,
    
    -- Subscription & trial
    subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'enterprise')),
    trial_started_at TIMESTAMPTZ,
    trial_ends_at TIMESTAMPTZ,
    is_trial_active BOOLEAN GENERATED ALWAYS AS (
        trial_ends_at IS NOT NULL AND trial_ends_at > NOW()
    ) STORED,
    
    -- Onboarding
    onboarding_completed BOOLEAN DEFAULT FALSE,
    onboarding_completed_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own profile
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, trial_started_at, trial_ends_at)
    VALUES (
        NEW.id,
        NOW(),
        NOW() + INTERVAL '14 days' -- 14-day free trial
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile();
