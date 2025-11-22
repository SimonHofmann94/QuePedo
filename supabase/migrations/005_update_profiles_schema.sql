-- Add new columns for onboarding flow
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Drop the strict check constraint on proficiency_level to allow for more granular or different values if needed
-- We will still enforce valid values at the application level
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_proficiency_level_check;

-- Ensure learning_style can handle the new values if they differ, or just rely on text
-- The previous constraint was: learning_style IN ('visual', 'auditory', 'reading', 'kinesthetic', 'mixed')
-- The new flow has: 'gamer', 'listener', 'visualizer', 'speaker'
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_learning_style_check;
