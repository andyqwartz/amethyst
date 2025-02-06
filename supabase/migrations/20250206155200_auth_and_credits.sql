-- Functions for credit management
CREATE OR REPLACE FUNCTION add_credits(
    user_id UUID,
    amount INTEGER,
    credit_type TEXT,
    description TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    -- Add credits to user's balance
    UPDATE public.profiles 
    SET 
        credits_balance = credits_balance + amount,
        lifetime_credits = lifetime_credits + GREATEST(amount, 0)
    WHERE id = user_id;

    -- Record the transaction
    INSERT INTO public.credit_transactions (
        profile_id,
        type,
        amount,
        description,
        metadata
    ) VALUES (
        user_id,
        credit_type,
        amount,
        COALESCE(description, credit_type),
        jsonb_build_object(
            'previous_balance', (SELECT credits_balance - amount FROM profiles WHERE id = user_id),
            'new_balance', (SELECT credits_balance FROM profiles WHERE id = user_id)
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle ad view credits
CREATE OR REPLACE FUNCTION handle_ad_view(
    user_id UUID,
    ad_id TEXT,
    view_duration INTEGER
)
RETURNS INTEGER AS $$
DECLARE
    credits INTEGER;
BEGIN
    -- Calculate credits based on view duration
    credits := CASE
        WHEN view_duration >= 30 THEN 2
        WHEN view_duration >= 15 THEN 1
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
        user_id,
        ad_id,
        view_duration,
        credits,
        view_duration >= 15,
        jsonb_build_object(
            'timestamp', extract(epoch from now()),
            'duration', view_duration
        )
    );

    -- Add credits if earned
    IF credits > 0 THEN
        PERFORM add_credits(
            user_id,
            credits,
            'ad_view',
            'Credits earned from watching ad ' || ad_id
        );

        -- Update ad stats
        UPDATE public.profiles
        SET 
            ads_credits_earned = ads_credits_earned + credits,
            ads_watched_today = ads_watched_today + 1,
            ads_last_watched = now()
        WHERE id = user_id;
    END IF;

    RETURN credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check admin status
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND is_admin = true
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

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
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
