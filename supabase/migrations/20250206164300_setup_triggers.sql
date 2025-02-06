-- Create trigger function to create profile on user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        created_at,
        last_sign_in_at,
        auth_provider,
        provider_id,
        email_verified,
        is_admin,
        is_banned,
        subscription_tier,
        subscription_status,
        credits_balance,
        lifetime_credits,
        last_credit_update,
        language,
        theme,
        notifications_enabled,
        marketing_emails_enabled,
        ads_enabled,
        ads_credits_earned,
        ads_watched_today,
        daily_ads_limit,
        needs_attention,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        NEW.created_at,
        NEW.last_sign_in_at,
        COALESCE((NEW.raw_app_meta_data->>'provider')::text, 'email'),
        COALESCE((NEW.raw_app_meta_data->>'provider_id')::text, NEW.id::text),
        COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
        COALESCE((NEW.raw_user_meta_data->>'is_admin')::boolean, false),
        false,
        'free',
        'active',
        0,
        0,
        now(),
        'fr',
        'light',
        true,
        true,
        true,
        0,
        0,
        10,
        false,
        now()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create trigger function to update profile on user update
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS trigger AS $$
BEGIN
    UPDATE public.profiles
    SET 
        email = NEW.email,
        last_sign_in_at = NEW.last_sign_in_at,
        auth_provider = COALESCE((NEW.raw_app_meta_data->>'provider')::text, 'email'),
        provider_id = COALESCE((NEW.raw_app_meta_data->>'provider_id')::text, NEW.id::text),
        email_verified = COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
        updated_at = now()
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users for updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_update();

-- Verify setup
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'on_auth_user_created'
    ) THEN
        RAISE EXCEPTION 'Triggers not set up properly';
    END IF;
END $$;
