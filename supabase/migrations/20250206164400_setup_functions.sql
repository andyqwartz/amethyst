-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND is_admin = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user owns a record
CREATE OR REPLACE FUNCTION public.owns_record(record_user_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN record_user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if collection is accessible
CREATE OR REPLACE FUNCTION public.can_access_collection(collection_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.image_collections
        WHERE id = collection_id
        AND (user_id = auth.uid() OR is_public = true)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's credit balance
CREATE OR REPLACE FUNCTION public.get_user_credits(user_id uuid)
RETURNS integer AS $$
DECLARE
    balance integer;
BEGIN
    SELECT credits_balance INTO balance
    FROM public.profiles
    WHERE id = user_id;
    RETURN COALESCE(balance, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user's credit balance
CREATE OR REPLACE FUNCTION public.update_user_credits(
    user_id uuid,
    amount integer,
    transaction_type text,
    description text DEFAULT NULL
)
RETURNS integer AS $$
DECLARE
    new_balance integer;
BEGIN
    -- Update credits balance
    UPDATE public.profiles
    SET 
        credits_balance = credits_balance + amount,
        lifetime_credits = CASE 
            WHEN amount > 0 THEN lifetime_credits + amount
            ELSE lifetime_credits
        END,
        last_credit_update = now()
    WHERE id = user_id
    RETURNING credits_balance INTO new_balance;

    -- Record transaction
    INSERT INTO public.credit_transactions (
        profile_id,
        type,
        amount,
        description,
        created_at
    ) VALUES (
        user_id,
        transaction_type,
        amount,
        description,
        now()
    );

    RETURN new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can watch ads
CREATE OR REPLACE FUNCTION public.can_watch_ads(user_id uuid)
RETURNS boolean AS $$
DECLARE
    user_record public.profiles;
BEGIN
    SELECT * INTO user_record
    FROM public.profiles
    WHERE id = user_id;

    RETURN (
        user_record.ads_enabled = true AND
        user_record.ads_watched_today < user_record.daily_ads_limit AND
        (
            user_record.ads_last_watched IS NULL OR
            EXTRACT(EPOCH FROM (now() - user_record.ads_last_watched)) >= 300 -- 5 minutes cooldown
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record ad view
CREATE OR REPLACE FUNCTION public.record_ad_view(
    user_id uuid,
    ad_id text,
    view_duration integer,
    credits_earned integer DEFAULT 1
)
RETURNS boolean AS $$
BEGIN
    -- Check if user can watch ads
    IF NOT public.can_watch_ads(user_id) THEN
        RETURN false;
    END IF;

    -- Record ad view
    INSERT INTO public.ad_views (
        profile_id,
        ad_id,
        view_duration,
        credits_earned,
        completed,
        created_at
    ) VALUES (
        user_id,
        ad_id,
        view_duration,
        credits_earned,
        true,
        now()
    );

    -- Update user profile
    UPDATE public.profiles
    SET 
        ads_watched_today = ads_watched_today + 1,
        ads_last_watched = now(),
        ads_credits_earned = ads_credits_earned + credits_earned
    WHERE id = user_id;

    -- Add credits to user's balance
    PERFORM public.update_user_credits(
        user_id,
        credits_earned,
        'ad_view',
        'Credits earned from watching ad ' || ad_id
    );

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify setup
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'is_admin'
    ) THEN
        RAISE EXCEPTION 'Functions not set up properly';
    END IF;
END $$;
