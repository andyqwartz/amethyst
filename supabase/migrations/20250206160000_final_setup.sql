-- Final Database Setup with Comprehensive Improvements

-- First, backup existing admin users
CREATE TEMP TABLE admin_backup AS
SELECT * FROM profiles WHERE is_admin = true;

-- Drop all existing functions with full signatures
DO $$ 
DECLARE
    func record;
BEGIN
    FOR func IN (
        SELECT 
            p.proname as name,
            pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname IN ('add_credits', 'handle_ad_view', 'is_admin', 'create_profile_on_signup', 
                         'reset_daily_ad_counts', 'create_admin_user', 'notify_credit_change',
                         'handle_new_user', 'handle_user_delete', 'check_user_credits',
                         'process_stripe_webhook', 'handle_subscription_change')
    )
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || func.name || '(' || func.args || ') CASCADE';
    END LOOP;
END $$;

-- Drop existing triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS credit_update_notification ON profiles;

-- Create additional tables if they don't exist
CREATE TABLE IF NOT EXISTS banned_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    reason TEXT,
    banned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    banned_by UUID REFERENCES profiles(id)
);

CREATE TABLE IF NOT EXISTS banned_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    reason TEXT,
    banned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    banned_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Simplified auth functions
CREATE OR REPLACE FUNCTION create_profile_on_signup()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        is_admin,
        email_verified,
        created_at,
        updated_at,
        last_sign_in_at,
        credits_balance,
        lifetime_credits,
        subscription_tier,
        subscription_status,
        language,
        theme,
        notifications_enabled,
        marketing_emails_enabled,
        ads_enabled,
        daily_ads_limit
    )
    VALUES (
        new.id,
        new.email,
        false,
        false,
        now(),
        now(),
        now(),
        0,
        0,
        'free',
        'active',
        'fr',
        'light',
        true,
        true,
        true,
        10
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_profile_on_signup();

-- Simplified credit management
CREATE OR REPLACE FUNCTION add_credits(
    user_id UUID,
    amount INTEGER,
    source TEXT,
    description TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    UPDATE profiles
    SET credits_balance = credits_balance + amount,
        lifetime_credits = CASE 
            WHEN amount > 0 THEN lifetime_credits + amount
            ELSE lifetime_credits
        END,
        last_credit_update = now()
    WHERE id = user_id;

    INSERT INTO credit_transactions (
        profile_id,
        type,
        amount,
        description,
        created_at,
        metadata
    )
    VALUES (
        user_id,
        source,
        amount,
        COALESCE(description, source),
        now(),
        jsonb_build_object(
            'source', source,
            'timestamp', extract(epoch from now())
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Simplified ad credit function
CREATE OR REPLACE FUNCTION handle_ad_view(
    user_id UUID,
    ad_id TEXT,
    duration INTEGER,
    platform TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    credits INTEGER;
    current_count INTEGER;
BEGIN
    SELECT ads_watched_today INTO current_count
    FROM profiles
    WHERE id = user_id;

    IF current_count >= 10 THEN
        RETURN 0;
    END IF;

    credits := CASE
        WHEN duration >= 30 THEN 2
        WHEN duration >= 15 THEN 1
        ELSE 0
    END;

    UPDATE profiles
    SET ads_watched_today = COALESCE(ads_watched_today, 0) + 1,
        ads_last_watched = now(),
        ads_credits_earned = COALESCE(ads_credits_earned, 0) + credits
    WHERE id = user_id;

    INSERT INTO ad_views (
        profile_id,
        ad_id,
        view_duration,
        credits_earned,
        completed,
        created_at,
        metadata
    )
    VALUES (
        user_id,
        ad_id,
        duration,
        credits,
        duration >= 30,
        now(),
        jsonb_build_object(
            'platform', platform,
            'timestamp', extract(epoch from now())
        )
    );

    IF credits > 0 THEN
        PERFORM add_credits(user_id, credits, 'ad_view', 'Credits earned from watching ad');
    END IF;

    RETURN credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reset daily ad counts
CREATE OR REPLACE FUNCTION reset_daily_ad_counts()
RETURNS void AS $$
BEGIN
    UPDATE profiles
    SET ads_watched_today = 0
    WHERE DATE(ads_last_watched) < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin check
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = user_id
        AND is_admin = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin user
CREATE OR REPLACE FUNCTION create_admin_user(
    admin_email TEXT,
    admin_password TEXT
)
RETURNS UUID AS $$
DECLARE
    user_id UUID;
BEGIN
    INSERT INTO auth.users (
        email,
        encrypted_password,
        email_confirmed_at,
        raw_user_meta_data,
        created_at,
        updated_at
    )
    VALUES (
        admin_email,
        crypt(admin_password, gen_salt('bf')),
        now(),
        jsonb_build_object('is_admin', true),
        now(),
        now()
    )
    RETURNING id INTO user_id;

    INSERT INTO profiles (
        id,
        email,
        is_admin,
        email_verified,
        created_at,
        updated_at,
        last_sign_in_at,
        credits_balance,
        lifetime_credits,
        subscription_tier,
        subscription_status
    )
    VALUES (
        user_id,
        admin_email,
        true,
        true,
        now(),
        now(),
        now(),
        999999,
        999999,
        'admin',
        'active'
    );

    RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Restore admin users
INSERT INTO profiles 
SELECT * FROM admin_backup
ON CONFLICT (id) DO UPDATE 
SET is_admin = true,
    email_verified = true,
    subscription_tier = 'admin',
    subscription_status = 'active',
    credits_balance = 999999,
    lifetime_credits = 999999;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION add_credits(UUID, INTEGER, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION handle_ad_view(UUID, TEXT, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated;

-- Schedule daily reset
SELECT cron.schedule(
    'reset-ad-counts',
    '0 0 * * *',
    $$SELECT reset_daily_ad_counts()$$
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON profiles(subscription_tier, subscription_status);
CREATE INDEX IF NOT EXISTS idx_images_metadata ON images USING gin(metadata);
CREATE INDEX IF NOT EXISTS idx_generated_images_user ON generated_images(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_images_status ON generated_images(status);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON credit_transactions(profile_id);
CREATE INDEX IF NOT EXISTS idx_ad_views_user ON ad_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_banned_emails_email ON banned_emails(email);
CREATE INDEX IF NOT EXISTS idx_image_metadata_embeddings ON image_metadata USING ivfflat (embedding vector_cosine_ops);

-- Set up notifications
CREATE OR REPLACE FUNCTION notify_credit_change()
RETURNS trigger AS $$
BEGIN
    PERFORM pg_notify(
        'credit_update',
        json_build_object(
            'user_id', NEW.id,
            'credits', NEW.credits_balance,
            'previous_credits', OLD.credits_balance
        )::text
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER credit_update_notification
AFTER UPDATE OF credits_balance ON profiles
FOR EACH ROW
EXECUTE FUNCTION notify_credit_change();

-- Final verification
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin') THEN
        RAISE EXCEPTION 'Missing admin check function';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'add_credits') THEN
        RAISE EXCEPTION 'Missing credit management function';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        RAISE EXCEPTION 'Missing auth trigger';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'profiles' AND rowsecurity = true) THEN
        RAISE EXCEPTION 'RLS not enabled on profiles table';
    END IF;
END $$;
