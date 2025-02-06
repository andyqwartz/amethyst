-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Drop and recreate auth.users table with exact schema
DROP TABLE IF EXISTS auth.users CASCADE;

CREATE TABLE auth.users (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    instance_id uuid,
    email character varying NOT NULL,
    encrypted_password character varying NOT NULL,
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token text,
    confirmation_sent_at timestamp with time zone,
    recovery_token text,
    recovery_sent_at timestamp with time zone,
    email_change_token text,
    email_change text,
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    phone text,
    phone_confirmed_at timestamp with time zone,
    phone_change text,
    phone_change_token text,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone,
    email_change_confirm_status smallint,
    banned_until timestamp with time zone,
    reauthentication_token text,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    raw_recovery_token text,
    raw_email_change_token text,
    role character varying,
    last_sign_in_ip text,
    raw_confirmation_token text
);

-- Create indexes
CREATE INDEX IF NOT EXISTS users_instance_id_email_idx ON auth.users (email);
CREATE INDEX IF NOT EXISTS users_instance_id_idx ON auth.users (instance_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON auth.users TO postgres, service_role;
GRANT SELECT ON auth.users TO anon, authenticated;

-- Enable RLS on auth.users
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access" ON auth.users;
DROP POLICY IF EXISTS "Users can update own record" ON auth.users;

-- Create RLS policies
CREATE POLICY "Public read access" ON auth.users
    FOR SELECT
    USING (true);

CREATE POLICY "Users can update own record" ON auth.users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Ensure proper permissions on auth functions
DO $$
BEGIN
    -- Basic auth functions
    EXECUTE 'GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated';
    EXECUTE 'GRANT EXECUTE ON FUNCTION auth.role() TO anon, authenticated';
    EXECUTE 'GRANT EXECUTE ON FUNCTION auth.email() TO anon, authenticated';
    EXECUTE 'GRANT EXECUTE ON FUNCTION auth.jwt() TO anon, authenticated';
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION auth.update_timestamps()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_auth_users_timestamps
    BEFORE UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION auth.update_timestamps();

-- Commit all changes
COMMIT;
