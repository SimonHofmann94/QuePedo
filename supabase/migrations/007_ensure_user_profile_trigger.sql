-- Ensure the trigger function exists and is correct
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, trial_started_at, trial_ends_at)
    VALUES (
        NEW.id,
        NOW(),
        NOW() + INTERVAL '14 days'
    )
    ON CONFLICT (id) DO NOTHING; -- Prevent errors if profile already exists
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile();
