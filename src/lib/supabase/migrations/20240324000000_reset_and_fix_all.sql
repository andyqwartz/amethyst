-- 1. Reset complet
DO $$ 
BEGIN
    -- Supprimer toutes les politiques existantes
    DROP POLICY IF EXISTS "service_role_all" ON profiles;
    DROP POLICY IF EXISTS "authenticated_access" ON profiles;
    DROP POLICY IF EXISTS "anon_read" ON profiles;
    DROP POLICY IF EXISTS "service_role_all_access" ON profiles;
    DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;
    DROP POLICY IF EXISTS "anon_read_profiles" ON profiles;
    DROP POLICY IF EXISTS "authenticated_select" ON profiles;
    DROP POLICY IF EXISTS "authenticated_update" ON profiles;
    DROP POLICY IF EXISTS "anon_select" ON profiles;
    DROP POLICY IF EXISTS "bypass_rls" ON profiles;
    DROP POLICY IF EXISTS "users_read_own" ON profiles;
    DROP POLICY IF EXISTS "users_update_own" ON profiles;
    DROP POLICY IF EXISTS "public_read" ON profiles;
    DROP POLICY IF EXISTS "authenticated_read" ON profiles;
    DROP POLICY IF EXISTS "authenticated_update_own" ON profiles;
    DROP POLICY IF EXISTS "public_profiles" ON profiles;
    DROP POLICY IF EXISTS "service_role_full_access" ON profiles;
    DROP POLICY IF EXISTS "admin_full_access" ON profiles;

    -- Supprimer les triggers
    DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
    
    -- Supprimer les fonctions
    DROP FUNCTION IF EXISTS create_profile_for_user() CASCADE;
    DROP FUNCTION IF EXISTS check_admin_status(uuid) CASCADE;
    
    -- Désactiver RLS
    ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
    
    -- Révoquer toutes les permissions
    REVOKE ALL ON profiles FROM authenticated, anon;
    REVOKE ALL ON profiles FROM service_role;
END $$;

-- 2. Recréer la fonction check_admin_status
CREATE OR REPLACE FUNCTION check_admin_status(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM profiles 
        WHERE id = user_id 
        AND is_admin = true
    );
END;
$$;

-- 3. Recréer la fonction create_profile_for_user
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
        language,
        is_admin
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
        'fr',
        COALESCE((NEW.raw_user_meta_data->>'is_admin')::boolean, false)
    );
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Erreur dans create_profile_for_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- 4. Recréer le trigger
CREATE TRIGGER create_profile_on_signup
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_profile_for_user();

-- 5. Réaccorder les permissions de base
GRANT ALL ON profiles TO service_role;
GRANT SELECT, UPDATE(
    full_name,
    avatar_url,
    language,
    theme,
    notifications_enabled,
    marketing_emails_enabled
) ON profiles TO authenticated;

-- 6. Réactiver RLS avec des politiques simplifiées
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 7. Créer les nouvelles politiques
CREATE POLICY "service_role_full_access" ON profiles
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "users_read_own" ON profiles 
FOR SELECT TO authenticated
USING (
    id = auth.uid() OR
    EXISTS (
        SELECT 1 
        FROM profiles 
        WHERE id = auth.uid() 
        AND is_admin = true
    )
);

CREATE POLICY "users_update_own" ON profiles
FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- 8. S'assurer que l'admin existe
INSERT INTO profiles (
    id, 
    email, 
    is_admin, 
    created_at, 
    last_sign_in_at
) 
VALUES (
    '7af13416-82bf-4400-8caa-6c79298fc110',
    'admin@example.com',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE 
SET is_admin = true;

-- 9. Accorder les permissions d'exécution
GRANT EXECUTE ON FUNCTION check_admin_status(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION create_profile_for_user() TO service_role; 