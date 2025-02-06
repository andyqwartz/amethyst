-- Final Database Setup with Comprehensive Improvements

-- First, backup existing admin users
CREATE TEMP TABLE admin_backup AS
SELECT * FROM profiles WHERE is_admin = true;

-- Disable triggers temporarily
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tgname, tgrelid::regclass AS table_name
              FROM pg_trigger
              WHERE NOT tgisinternal) 
    LOOP
        EXECUTE format('ALTER TABLE %s DISABLE TRIGGER %I', 
                      r.table_name, 
                      r.tgname);
    END LOOP;
END $$;

-- Drop existing complex functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS handle_user_delete() CASCADE;
DROP FUNCTION IF EXISTS check_user_credits() CASCADE;
DROP FUNCTION IF EXISTS process_stripe_webhook() CASCADE;
DROP FUNCTION IF EXISTS handle_subscription_change() CASCADE;

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

-- Simplified credit management
CREATE OR REPLACE FUNCTION add_credits(
    user_id UUID,
    amount INTEGER,
    source TEXT,
    description TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    -- Update profile credits
    UPDATE profiles
    SET credits_balance = credits_balance + amount,
        lifetime_credits = CASE 
            WHEN amount > 0 THEN lifetime_credits + amount
            ELSE lifetime_credits
        END,
        last_credit_update = now()
    WHERE id = user_id;

    -- Record transaction
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
    -- Get current daily ad count
    SELECT ads_watched_today INTO current_count
    FROM profiles
    WHERE id = user_id;

    -- Check daily limit
    IF current_count >= 10 THEN
        RETURN 0;
    END IF;

    -- Calculate credits
    credits := CASE
        WHEN duration >= 30 THEN 2  -- Full view
        WHEN duration >= 15 THEN 1  -- Partial view
        ELSE 0
    END;

    -- Update profile
    UPDATE profiles
    SET ads_watched_today = COALESCE(ads_watched_today, 0) + 1,
        ads_last_watched = now(),
        ads_credits_earned = COALESCE(ads_credits_earned, 0) + credits
    WHERE id = user_id;

    -- Record view
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

    -- Add credits
    IF credits > 0 THEN
        PERFORM add_credits(user_id, credits, 'ad_view', 'Credits earned from watching ad');
    END IF;

    RETURN credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reset daily ad counts at midnight
CREATE OR REPLACE FUNCTION reset_daily_ad_counts()
RETURNS void AS $$
BEGIN
    UPDATE profiles
    SET ads_watched_today = 0
    WHERE DATE(ads_last_watched) < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Simplified admin check
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

-- Create admin user function
CREATE OR REPLACE FUNCTION create_admin_user(
    admin_email TEXT,
    admin_password TEXT
)
RETURNS UUID AS $$
DECLARE
    user_id UUID;
BEGIN
    -- Create auth user
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

    -- Create profile
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

-- Stripe webhook handler
CREATE OR REPLACE FUNCTION handle_stripe_webhook()
RETURNS trigger AS $$
BEGIN
    IF NEW.type = 'customer.subscription.updated' THEN
        UPDATE profiles
        SET subscription_tier = 
            CASE 
                WHEN NEW.data->>'plan' = 'price_H5ggYwtDq4fbrJ' THEN 'pro'
                WHEN NEW.data->>'plan' = 'price_H5ggYwtDq4fbrK' THEN 'enterprise'
                ELSE 'free'
            END,
        subscription_status = 
            CASE 
                WHEN NEW.data->>'status' = 'active' THEN 'active'
                WHEN NEW.data->>'status' = 'canceled' THEN 'canceled'
                ELSE 'inactive'
            END,
        subscription_end_date = 
            CASE 
                WHEN NEW.data->>'cancel_at' IS NOT NULL 
                THEN to_timestamp((NEW.data->>'cancel_at')::bigint)
                ELSE NULL
            END
        WHERE stripe_customer_id = NEW.data->>'customer';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_profile_on_signup();

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

-- Re-enable all triggers
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tgname, tgrelid::regclass AS table_name
              FROM pg_trigger
              WHERE NOT tgisinternal) 
    LOOP
        EXECUTE format('ALTER TABLE %s ENABLE TRIGGER %I', 
                      r.table_name, 
                      r.tgname);
    END LOOP;
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role;

-- Grant specific permissions to authenticated users
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION add_credits TO authenticated;
GRANT EXECUTE ON FUNCTION handle_ad_view TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;

-- Create scheduled task for resetting daily ad counts
SELECT cron.schedule(
    'reset-ad-counts',
    '0 0 * * *',  -- At midnight every day
    $$SELECT reset_daily_ad_counts()$$
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reference_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE banned_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE banned_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_generation_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- Create essential indexes
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
    -- Verify admin functions
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin') THEN
        RAISE EXCEPTION 'Missing admin check function';
    END IF;
    
    -- Verify credit functions
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'add_credits') THEN
        RAISE EXCEPTION 'Missing credit management function';
    END IF;
    
    -- Verify triggers
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        RAISE EXCEPTION 'Missing auth trigger';
    END IF;
    
    -- Verify RLS
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'profiles' AND rowsecurity = true) THEN
        RAISE EXCEPTION 'RLS not enabled on profiles table';
    END IF;
END $$;
