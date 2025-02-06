BEGIN;

-- Vérifie si le schéma auth existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'auth') THEN
        CREATE SCHEMA IF NOT EXISTS auth;
    END IF;
END $$;

-- Vérifie et crée les types si nécessaire
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'aal_level') THEN
        CREATE TYPE auth.aal_level AS ENUM ('aal1', 'aal2', 'aal3');
    END IF;
END $$;

-- Vérifie et met à jour les tables existantes
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
        -- Ajoute les colonnes manquantes si nécessaire
        ALTER TABLE auth.users 
            ADD COLUMN IF NOT EXISTS email_confirmed_at timestamp with time zone,
            ADD COLUMN IF NOT EXISTS instance_id uuid,
            ADD COLUMN IF NOT EXISTS encrypted_password text;
    END IF;
END $$;

-- Vérifie et met à jour les index
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'users_email_idx') THEN
        CREATE INDEX IF NOT EXISTS users_email_idx ON auth.users(email);
    END IF;
END $$;

-- Supprime les anciennes politiques RLS si elles existent
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Crée une nouvelle politique RLS unifiée
CREATE POLICY "Enable all access for authenticated users"
    ON public.profiles FOR ALL
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Met à jour les permissions
GRANT USAGE ON SCHEMA auth TO authenticated, anon, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO authenticated;

-- Active RLS sur la table profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

COMMIT; 