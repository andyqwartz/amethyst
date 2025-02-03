-- Suppression des triggers existants
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
DROP TRIGGER IF EXISTS update_profile_on_auth_sign_in ON auth.users;

-- Suppression des fonctions existantes
DROP FUNCTION IF EXISTS check_admin_status(uuid);
DROP FUNCTION IF EXISTS update_profile_on_sign_in() CASCADE;
DROP FUNCTION IF EXISTS create_profile_for_user() CASCADE;

-- Réinitialiser la table profiles
DROP TABLE IF EXISTS profiles CASCADE;
CREATE TABLE profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text,
    is_admin boolean DEFAULT false,
    is_banned boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_sign_in_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Fonction pour vérifier le statut admin
CREATE OR REPLACE FUNCTION check_admin_status(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN COALESCE(
        (SELECT is_admin FROM profiles WHERE id = user_id),
        false
    );
END;
$$;

-- Fonction pour créer un profil lors de l'inscription
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
        created_at,
        last_sign_in_at
    ) VALUES (
        NEW.id,
        NEW.email,
        NEW.created_at,
        NEW.last_sign_in_at
    );
    RETURN NEW;
END;
$$;

-- Fonction pour mettre à jour le profil lors des connexions
CREATE OR REPLACE FUNCTION update_profile_on_sign_in()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.profiles
    SET last_sign_in_at = NEW.last_sign_in_at,
        email = COALESCE(NEW.email, profiles.email)
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$;

-- Fonction pour récupérer le profil utilisateur
CREATE OR REPLACE FUNCTION get_user_profile(user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_profile json;
BEGIN
    SELECT json_build_object(
        'id', p.id,
        'email', p.email,
        'is_admin', p.is_admin,
        'is_banned', p.is_banned,
        'created_at', p.created_at,
        'last_sign_in_at', p.last_sign_in_at
    ) INTO user_profile
    FROM profiles p
    WHERE p.id = user_id;

    RETURN user_profile;
END;
$$;

-- Création des triggers
CREATE TRIGGER create_profile_on_signup
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_profile_for_user();

CREATE TRIGGER update_profile_on_auth_sign_in
    AFTER UPDATE OF last_sign_in_at ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_on_sign_in();

-- Permissions de base
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON profiles TO service_role;
GRANT SELECT, UPDATE ON profiles TO authenticated;

-- Permissions pour les fonctions
GRANT EXECUTE ON FUNCTION check_admin_status(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_user_profile(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_profile_for_user() TO service_role;
GRANT EXECUTE ON FUNCTION update_profile_on_sign_in() TO service_role;

-- Politiques de sécurité
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture pour tous les utilisateurs authentifiés"
ON profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Mise à jour pour soi-même ou admin"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id OR (SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- Insérer l'utilisateur admin
INSERT INTO profiles (id, email, is_admin)
VALUES ('7af13416-82bf-4400-8caa-6c79298fc110', 'admin@example.com', true)
ON CONFLICT (id) 
DO UPDATE SET is_admin = true;