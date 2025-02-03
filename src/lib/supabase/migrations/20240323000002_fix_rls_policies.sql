-- Reset complet des politiques et permissions

-- 1. Permissions de base sur les schémas
GRANT USAGE ON SCHEMA public TO postgres, service_role, authenticated, anon;
GRANT ALL ON SCHEMA public TO postgres, service_role;
GRANT USAGE ON SCHEMA auth TO service_role;

-- 2. Configuration de la table profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_sign_in_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS credits_balance INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lifetime_credits INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'email';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ads_enabled BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ads_watched_today INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_ads_limit INTEGER DEFAULT 3;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ads_credits_earned INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS marketing_emails_enabled BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'fr';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 3. Désactiver temporairement RLS
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 4. Nettoyer toutes les politiques existantes
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

-- 5. Révoquer et réaccorder les permissions
GRANT ALL ON profiles TO postgres;
GRANT ALL ON profiles TO service_role;
GRANT SELECT, UPDATE ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon;

-- 6. Réactiver RLS avec des politiques simples
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 6. Politiques simplifiées sans récursion
CREATE POLICY "service_role_all_access" ON profiles
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "authenticated_read" ON profiles
FOR SELECT TO authenticated
USING (
  id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM auth.users u 
    WHERE u.id = auth.uid() 
    AND u.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "authenticated_update_own" ON profiles
FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "public_profiles" ON profiles
FOR SELECT TO anon
USING (NOT is_banned);

-- 7. Fonction de création de profil avec gestion d'erreurs
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO profiles (
        id,
        email,
        full_name,
        created_at,
        last_sign_in_at,
        credits_balance,
        subscription_tier,
        subscription_status,
        lifetime_credits,
        auth_provider,
        ads_enabled,
        ads_watched_today,
        daily_ads_limit,
        ads_credits_earned,
        notifications_enabled,
        marketing_emails_enabled,
        language,
        is_admin,
        is_banned,
        avatar_url
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.created_at, now()),
        COALESCE(NEW.last_sign_in_at, now()),
        0,
        'free',
        'active',
        0,
        COALESCE(NEW.app_metadata->>'provider', 'email'),
        true,
        0,
        3,
        0,
        true,
        true,
        'fr',
        COALESCE((NEW.raw_user_meta_data->>'is_admin')::boolean, false),
        false,
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Erreur dans create_profile_for_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- 8. Permissions pour le trigger
GRANT EXECUTE ON FUNCTION create_profile_for_user() TO service_role;

-- 9. Recréer le trigger
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
CREATE TRIGGER create_profile_on_signup
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_profile_for_user();

-- 10. Mettre à jour l'admin existant
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{is_admin}',
    'true'
)
WHERE id = '7af13416-82bf-4400-8caa-6c79298fc110';

UPDATE profiles 
SET is_admin = true
WHERE id = '7af13416-82bf-4400-8caa-6c79298fc110';

-- Désactiver RLS temporairement
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Révoquer toutes les permissions existantes
REVOKE ALL ON profiles FROM authenticated, anon;
REVOKE ALL ON profiles FROM service_role;

-- Réaccorder les permissions de base
GRANT ALL ON profiles TO service_role;
GRANT SELECT, UPDATE(
  full_name, 
  avatar_url,
  language,
  theme,
  notifications_enabled,
  marketing_emails_enabled
) ON profiles TO authenticated;

-- Réactiver RLS avec des politiques simplifiées
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour service_role
CREATE POLICY "service_role_full_access" ON profiles
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- Politique pour les utilisateurs authentifiés
CREATE POLICY "users_read_own" ON profiles 
FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Politique pour les admins
CREATE POLICY "admin_full_access" ON profiles
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  )
); 