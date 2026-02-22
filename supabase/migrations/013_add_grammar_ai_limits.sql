-- Add grammar AI limit columns to user_profiles
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS daily_grammar_ai_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_grammar_ai_date date;

-- Function to check and increment grammar AI usage
-- Returns true if allowed (under limit), false if limit reached
-- Premium only, resets daily, limit = 3
CREATE OR REPLACE FUNCTION check_and_increment_grammar_ai(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tier text;
  v_is_admin boolean;
  v_count integer;
  v_last_date date;
BEGIN
  SELECT subscription_tier, is_admin, daily_grammar_ai_count, last_grammar_ai_date
  INTO v_tier, v_is_admin, v_count, v_last_date
  FROM user_profiles
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Only premium users and admins can use AI grammar generation
  IF v_tier != 'premium' AND v_is_admin IS NOT TRUE THEN
    RETURN false;
  END IF;

  -- Reset count if it's a new day
  IF v_last_date IS NULL OR v_last_date < CURRENT_DATE THEN
    v_count := 0;
  END IF;

  -- Check limit (3 per day)
  IF v_count >= 3 THEN
    RETURN false;
  END IF;

  -- Increment
  UPDATE user_profiles
  SET daily_grammar_ai_count = v_count + 1,
      last_grammar_ai_date = CURRENT_DATE,
      updated_at = NOW()
  WHERE id = p_user_id;

  RETURN true;
END;
$$;

-- Function to get remaining grammar AI count for today
CREATE OR REPLACE FUNCTION get_grammar_ai_remaining(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
  v_last_date date;
BEGIN
  SELECT daily_grammar_ai_count, last_grammar_ai_date
  INTO v_count, v_last_date
  FROM user_profiles
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  -- Reset if new day
  IF v_last_date IS NULL OR v_last_date < CURRENT_DATE THEN
    RETURN 3;
  END IF;

  RETURN GREATEST(0, 3 - v_count);
END;
$$;
