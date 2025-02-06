-- Drop existing functions first
DROP FUNCTION IF EXISTS add_credits(UUID, INTEGER, TEXT, TEXT);
DROP FUNCTION IF EXISTS handle_ad_view(UUID, TEXT, INTEGER);
DROP FUNCTION IF EXISTS is_admin(UUID);
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS reset_daily_ad_limits();

-- Functions for credit management
CREATE OR REPLACE FUNCTION add_credits(
    p_user_id UUID,
    p_amount INTEGER,
    p_credit_type TEXT,
    p_description TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    -- Add credits to user's balance
    UPDATE public.profiles 
    SET 
        credits_balance = credits_balance + p_amount,
        lifetime_credits = lifetime_credits + GREATEST(p_amount, 0)
    WHERE id = p_user_id;

    -- Record the transaction
    INSERT INTO public.credit_transactions (
        profile_id,
        type,
        amount,
        description,
        metadata
    ) VALUES (
        p_user_id,
        p_credit_type,
        p_amount,
        COALESCE(p_description, p_credit_type),
        jsonb_build_object(
            'previous_balance', (SELECT credits_balance - p_amount FROM profiles WHERE id = p_user_id),
            'new_balance', (SELECT credits_balance FROM profiles WHERE id = p_user_id)
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle ad view credits
CREATE OR REPLACE FUNCTION handle_ad_view(
    p_user_id UUID,
    p_ad_id TEXT,
    p_view_duration INTEGER
)
RETURNS INTEGER AS $$
DECLARE
    v_credits INTEGER;
BEGIN
    -- Calculate credits based on view duration
    v_credits := CASE
        WHEN p_view_duration >= 30 THEN 2
        WHEN p_view_duration >= 15 THEN 1
        ELSE 0
    END;

    -- Record the ad view
    INSERT INTO public.ad_views (
        profile_id,
        ad_id,
        view_duration,
        credits_earned,
        completed,
        metadata
    ) VALUES (
        p_user_id,
        p_ad_id,
        p_view_duration,
        v_credits,
        p_view_duration >= 15,
        jsonb_build_object(
            'timestamp', extract(epoch from now()),
            'duration', p_view_duration
        )
    );

    -- Add credits if earned
    IF v_credits > 0 THEN
        PERFORM add_credits(
            p_user_id,
            v_credits,
            'ad_view',
            'Credits earned from watching ad ' || p_ad_id
        );

        -- Update ad stats
        UPDATE public.profiles
        SET 
            ads_credits_earned = ads_credits_earned + v_credits,
            ads_watched_today = ads_watched_today + 1,
            ads_last_watched = now()
        WHERE id = p_user_id;
    END IF;

    RETURN v_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check admin status
CREATE OR REPLACE FUNCTION is_admin(
    p_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = p_user_id AND is_admin = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to reset daily ad limits
CREATE OR REPLACE FUNCTION reset_daily_ad_limits()
RETURNS void AS $$
BEGIN
    UPDATE public.profiles
    SET ads_watched_today = 0
    WHERE ads_watched_today > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule daily reset (requires pg_cron extension)
SELECT cron.schedule(
    'reset-ad-limits',
    '0 0 * * *',  -- At midnight every day
    $$SELECT reset_daily_ad_limits()$$
);
