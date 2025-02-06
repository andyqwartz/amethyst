-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pgjwt;

-- Create auth schema
CREATE SCHEMA IF NOT EXISTS auth;

-- Drop existing auth schema objects to ensure clean slate
DROP TABLE IF EXISTS auth.users CASCADE;
DROP TABLE IF EXISTS auth.refresh_tokens CASCADE;
DROP TABLE IF EXISTS auth.instances CASCADE;
DROP TABLE IF EXISTS auth.audit_log_entries CASCADE;
DROP TABLE IF EXISTS auth.schema_migrations CASCADE;
DROP TABLE IF EXISTS auth.flow_state CASCADE;
DROP TABLE IF EXISTS auth.mfa_factors CASCADE;
DROP TABLE IF EXISTS auth.mfa_challenges CASCADE;
DROP TABLE IF EXISTS auth.mfa_amr_claims CASCADE;
DROP TABLE IF EXISTS auth.saml_providers CASCADE;
DROP TABLE IF EXISTS auth.saml_relay_states CASCADE;
DROP TABLE IF EXISTS auth.sso_providers CASCADE;
DROP TABLE IF EXISTS auth.sso_domains CASCADE;
DROP FUNCTION IF EXISTS auth.uid() CASCADE;
DROP FUNCTION IF EXISTS auth.role() CASCADE;
DROP FUNCTION IF EXISTS auth.email() CASCADE;

-- Create auth schema functions
CREATE OR REPLACE FUNCTION auth.uid() 
RETURNS uuid AS $$
  SELECT coalesce(
    current_setting('request.jwt.claim.sub', true),
    (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
  )::uuid
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION auth.role() 
RETURNS text AS $$
  SELECT coalesce(
    current_setting('request.jwt.claim.role', true),
    (current_setting('request.jwt.claims', true)::jsonb ->> 'role')
  )::text
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION auth.email() 
RETURNS text AS $$
  SELECT coalesce(
    current_setting('request.jwt.claim.email', true),
    (current_setting('request.jwt.claims', true)::jsonb ->> 'email')
  )::text
$$ LANGUAGE sql STABLE;

-- Create auth schema tables
CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    aud character varying(255),
    role character varying(255),
    email character varying(255) UNIQUE,
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb DEFAULT '{}'::jsonb,
    raw_user_meta_data jsonb DEFAULT '{}'::jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text UNIQUE DEFAULT NULL,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT '',
    phone_change_token character varying(255) DEFAULT '',
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (
        LEAST(email_confirmed_at, phone_confirmed_at)
    ) STORED,
    email_change_token_current character varying(255) DEFAULT '',
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT '',
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT users_email_check CHECK (((email = lower(email)) AND (length(email) <= 255))),
    CONSTRAINT users_phone_check CHECK ((length(phone) <= 255))
);

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigserial PRIMARY KEY,
    token character varying(255),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255)
);

CREATE TABLE auth.instances (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create auth schema indexes
CREATE INDEX users_instance_id_email_idx ON auth.users (instance_id, email);
CREATE INDEX users_instance_id_idx ON auth.users (instance_id);
CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens (instance_id);
CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens (instance_id, user_id);
CREATE INDEX refresh_tokens_token_idx ON auth.refresh_tokens (token);
CREATE INDEX users_email_partial_idx ON auth.users (email) WHERE (is_super_admin IS NULL OR NOT is_super_admin);
CREATE INDEX users_phone_idx ON auth.users (phone);
CREATE UNIQUE INDEX users_email_partial_key ON auth.users (email) WHERE (deleted_at IS NULL);
CREATE UNIQUE INDEX users_phone_partial_key ON auth.users (phone) WHERE (deleted_at IS NULL);

-- Create initial instance
INSERT INTO auth.instances (id, uuid, raw_base_config)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    '{"SITE_URL": "http://localhost:8081", "MAILER_AUTOCONFIRM": true, "MAILER_SECURE_EMAIL_CHANGE_ENABLED": true, "SECURITY_UPDATE_PASSWORD_REQUIRE_REAUTHENTICATION": false}'
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
            created_at,
            updated_at,
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

-- Enable RLS on auth schema
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for auth schema
CREATE POLICY "Public users are viewable by everyone"
    ON auth.users FOR SELECT
    USING (true);

CREATE POLICY "Users can update own user data"
    ON auth.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create RLS policies for refresh tokens
CREATE POLICY "Authenticated users can manage own refresh tokens"
    ON auth.refresh_tokens FOR ALL
    USING (auth.uid() = user_id);

-- Verify setup
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email = 'admin@serendippo.me'
    ) THEN
        RAISE EXCEPTION 'Admin user not created properly';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM auth.instances 
        WHERE id = '00000000-0000-0000-0000-000000000000'
    ) THEN
        RAISE EXCEPTION 'Auth instance not created properly';
    END IF;
END $$;
