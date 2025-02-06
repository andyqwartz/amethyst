-- Function to create initial admin user
CREATE OR REPLACE FUNCTION create_initial_admin(
    admin_email TEXT,
    admin_password TEXT
) RETURNS void AS $$
DECLARE
    user_id UUID;
BEGIN
    -- Create user in auth.users
    user_id := (
        SELECT id FROM auth.users
        WHERE email = admin_email
        LIMIT 1
    );

    IF user_id IS NULL THEN
        user_id := (
            SELECT id FROM auth.users
            WHERE raw_user_meta_data->>'email' = admin_email
            LIMIT 1
        );
    END IF;

    IF user_id IS NULL THEN
        INSERT INTO auth.users (
            email,
            encrypted_password,
            email_confirmed_at,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change_token_new,
            recovery_token
        )
        VALUES (
            admin_email,
            crypt(admin_password, gen_salt('bf')),
            now(),
            jsonb_build_object(
                'email', admin_email,
                'is_admin', true
            ),
            now(),
            now(),
            encode(sha256(random()::text::bytea), 'hex'),
            encode(sha256(random()::text::bytea), 'hex'),
            encode(sha256(random()::text::bytea), 'hex')
        )
        RETURNING id INTO user_id;
    END IF;

    -- Ensure profile exists and is admin
    INSERT INTO public.profiles (
        id,
        email,
        is_admin,
        email_verified,
        created_at,
        updated_at
    )
    VALUES (
        user_id,
        admin_email,
        true,
        true,
        now(),
        now()
    )
    ON CONFLICT (id) DO UPDATE
    SET is_admin = true,
        email_verified = true,
        updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if email is banned
CREATE OR REPLACE FUNCTION is_email_banned(check_email TEXT)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM banned_emails
        WHERE email = check_email
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is banned
CREATE OR REPLACE FUNCTION is_user_banned(user_id UUID)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = user_id
        AND is_banned = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add credits to user
CREATE OR REPLACE FUNCTION add_user_credits(
    target_user_id UUID,
    credit_amount INTEGER,
    credit_type TEXT,
    credit_description TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    -- Add credits to user's balance
    UPDATE profiles
    SET credits_balance = credits_balance + credit_amount,
        lifetime_credits = lifetime_credits + GREATEST(credit_amount, 0),
        last_credit_update = now()
    WHERE id = target_user_id;

    -- Record the transaction
    INSERT INTO credit_transactions (
        profile_id,
        type,
        amount,
        description,
        created_at
    )
    VALUES (
        target_user_id,
        credit_type,
        credit_amount,
        COALESCE(credit_description, credit_type),
        now()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle ad view credits
CREATE OR REPLACE FUNCTION handle_ad_view_credits(
    user_id UUID,
    ad_id TEXT,
    view_duration INTEGER,
    platform TEXT DEFAULT NULL
)
RETURNS void AS $$
DECLARE
    credits_to_award INTEGER;
    current_date DATE;
BEGIN
    -- Get current date for daily limits
    current_date := CURRENT_DATE;
    
    -- Check if user has reached daily limit
    IF EXISTS (
        SELECT 1 FROM profiles
        WHERE id = user_id
        AND ads_watched_today >= daily_ads_limit
        AND DATE(ads_last_watched) = current_date
    ) THEN
        RAISE EXCEPTION 'Daily ad view limit reached';
    END IF;

    -- Calculate credits to award (example logic)
    credits_to_award := CASE
        WHEN view_duration >= 30 THEN 2  -- Full view
        WHEN view_duration >= 15 THEN 1  -- Partial view
        ELSE 0
    END;

    -- Update user's ad viewing stats
    UPDATE profiles
    SET ads_watched_today = CASE
            WHEN DATE(ads_last_watched) = current_date THEN ads_watched_today + 1
            ELSE 1
        END,
        ads_last_watched = now(),
        ads_credits_earned = ads_credits_earned + credits_to_award
    WHERE id = user_id;

    -- Record the ad view
    INSERT INTO ad_views (
        profile_id,
        ad_id,
        view_duration,
        credits_earned,
        completed,
        created_at
    )
    VALUES (
        user_id,
        ad_id,
        view_duration,
        credits_to_award,
        view_duration >= 30,
        now()
    );

    -- Add credits to user's balance
    IF credits_to_award > 0 THEN
        PERFORM add_user_credits(
            user_id,
            credits_to_award,
            'ad_view',
            'Credits earned from watching ad'
        );
    END IF;

    -- Record in ads history
    INSERT INTO ads_history (
        profile_id,
        ad_id,
        platform,
        credits_earned,
        watched_duration,
        completed,
        watched_at
    )
    VALUES (
        user_id,
        ad_id,
        platform,
        credits_to_award,
        view_duration,
        view_duration >= 30,
        now()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create initial admin user (you'll need to replace these values)
SELECT create_initial_admin('admin@example.com', 'your-secure-password-here');

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION create_initial_admin TO postgres, service_role;
GRANT EXECUTE ON FUNCTION is_email_banned TO postgres, service_role, authenticated;
GRANT EXECUTE ON FUNCTION is_user_banned TO postgres, service_role, authenticated;
GRANT EXECUTE ON FUNCTION add_user_credits TO postgres, service_role;
GRANT EXECUTE ON FUNCTION handle_ad_view_credits TO postgres, service_role;
