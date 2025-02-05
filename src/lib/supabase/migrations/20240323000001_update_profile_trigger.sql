-- Mise à jour de la fonction de création de profil
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        created_at,
        last_sign_in_at,
        credits_balance,
        subscription_tier,
        subscription_status,
        auth_provider,
        language
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.created_at,
        NEW.last_sign_in_at,
        100,
        'free',
        'active',
        COALESCE(NEW.app_metadata->>'provider', 'email'),
        'fr'
    );
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Erreur dans create_profile_for_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Recréer le trigger
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
CREATE TRIGGER create_profile_on_signup
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_profile_for_user(); 