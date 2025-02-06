-- Setup Auth Schema and Tables
CREATE SCHEMA IF NOT EXISTS auth;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop existing auth schema objects to ensure clean slate
DROP TABLE IF EXISTS auth.users CASCADE;
DROP TABLE IF EXISTS auth.refresh_tokens CASCADE;
DROP TABLE IF EXISTS auth.instances CASCADE;
DROP FUNCTION IF EXISTS auth.uid() CASCADE;
DROP FUNCTION IF EXISTS auth.role() CASCADE;
DROP FUNCTION IF EXISTS auth.email() CASCADE;

-- Create auth schema functions
CREATE OR REPLACE FUNCTION auth.uid() 
RETURNS uuid AS $$
  SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION auth.role() 
RETURNS text AS $$
  SELECT nullif(current_setting('request.jwt.claim.role', true), '')::text;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION auth.email() 
RETURNS text AS $$
  SELECT nullif(current_setting('request.jwt.claim.email', true), '')::text;
$$ LANGUAGE sql STABLE;

-- Create auth schema tables
CREATE TABLE auth.instances (
    id uuid NOT NULL PRIMARY KEY,
    uuid uuid NOT NULL,
    raw_base_config text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE auth.users (
    instance_id UUID REFERENCES auth.instances(id),
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aud VARCHAR(255),
    role VARCHAR(255),
    email TEXT UNIQUE,
    encrypted_password TEXT,
    email_confirmed_at TIMESTAMP WITH TIME ZONE,
    invited_at TIMESTAMP WITH TIME ZONE,
    confirmation_token TEXT,
    confirmation_sent_at TIMESTAMP WITH TIME ZONE,
    recovery_token TEXT,
    recovery_sent_at TIMESTAMP WITH TIME ZONE,
    email_change_token TEXT,
    email_change TEXT,
    email_change_sent_at TIMESTAMP WITH TIME ZONE,
    last_sign_in_at TIMESTAMP WITH TIME ZONE,
    raw_app_meta_data JSONB DEFAULT '{}',
    raw_user_meta_data JSONB DEFAULT '{}',
    is_super_admin BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    phone TEXT UNIQUE DEFAULT NULL,
    phone_confirmed_at TIMESTAMP WITH TIME ZONE,
    phone_change TEXT DEFAULT '',
    phone_change_token TEXT DEFAULT '',
    phone_change_sent_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

CREATE TABLE auth.refresh_tokens (
    instance_id UUID REFERENCES auth.instances(id),
    id BIGSERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    revoked BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    parent TEXT
);

-- Create auth schema indexes
CREATE INDEX IF NOT EXISTS users_instance_id_email_idx ON auth.users (instance_id, email);
CREATE INDEX IF NOT EXISTS users_instance_id_idx ON auth.users (instance_id);
CREATE INDEX IF NOT EXISTS refresh_tokens_instance_id_idx ON auth.refresh_tokens (instance_id);
CREATE INDEX IF NOT EXISTS refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens (instance_id, user_id);
CREATE INDEX IF NOT EXISTS refresh_tokens_token_idx ON auth.refresh_tokens (token);
CREATE INDEX IF NOT EXISTS users_email_partial_idx ON auth.users (email) WHERE (is_super_admin IS NULL OR NOT is_super_admin);
CREATE INDEX IF NOT EXISTS users_phone_idx ON auth.users (phone);
CREATE INDEX IF NOT EXISTS users_confirmation_token_idx ON auth.users (confirmation_token) WHERE confirmation_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS users_recovery_token_idx ON auth.users (recovery_token) WHERE recovery_token IS NOT NULL;

-- Create initial instance
INSERT INTO auth.instances (id, uuid, raw_base_config)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    '{"SITE_URL": "http://localhost:8081", "MAILER_AUTOCONFIRM": false, "MAILER_SECURE_EMAIL_CHANGE_ENABLED": true, "SECURITY_UPDATE_PASSWORD_REQUIRE_REAUTHENTICATION": false}'
) ON CONFLICT (id) DO NOTHING;

-- Create initial admin user if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email = 'admin@serendippo.me'
    ) THEN
        INSERT INTO auth.users (
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            confirmed_at,
            aud,
            role
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            'admin@serendippo.me',
            crypt('admin123', gen_salt('bf')),
            now(),
            '{"provider": "email", "providers": ["email"]}',
            '{"is_admin": true}',
            true,
            now(),
            'authenticated',
            'authenticated'
        );
    END IF;
END
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres, service_role, anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA auth TO postgres, service_role;

GRANT SELECT ON TABLE auth.users TO authenticated;
GRANT SELECT ON TABLE auth.users TO anon;

-- Enable RLS on auth schema
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for auth schema
DROP POLICY IF EXISTS "Public users are viewable by everyone" ON auth.users;
DROP POLICY IF EXISTS "Users can insert their own user" ON auth.users;
DROP POLICY IF EXISTS "Users can update own user data" ON auth.users;

CREATE POLICY "Public users are viewable by everyone"
    ON auth.users FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own user"
    ON auth.users FOR INSERT
    WITH CHECK (auth.uid() IS NULL OR auth.uid() = id);

CREATE POLICY "Users can update own user data"
    ON auth.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create RLS policies for refresh tokens
CREATE POLICY "Authenticated users can manage their own refresh tokens"
    ON auth.refresh_tokens FOR ALL
    USING (auth.uid() = user_id);

-- Verify setup
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.schemata 
        WHERE schema_name = 'auth'
    ) THEN
        RAISE EXCEPTION 'Auth schema not created properly';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email = 'admin@serendippo.me'
    ) THEN
        RAISE EXCEPTION 'Admin user not created properly';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'uid' 
        AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'auth')
    ) THEN
        RAISE EXCEPTION 'Auth functions not created properly';
    END IF;
END $$;
