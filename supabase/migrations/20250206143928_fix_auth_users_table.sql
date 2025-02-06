-- Drop and recreate auth.users table with essential columns
DROP TABLE IF EXISTS auth.users CASCADE;

CREATE TABLE auth.users (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    instance_id uuid,
    email character varying NOT NULL UNIQUE,
    encrypted_password character varying NOT NULL,
    email_confirmed_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb DEFAULT '{}'::jsonb,
    raw_user_meta_data jsonb DEFAULT '{}'::jsonb,
    is_super_admin boolean DEFAULT false,
    role character varying DEFAULT 'authenticated',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    phone text,
    phone_confirmed_at timestamp with time zone,
    confirmation_token text,
    confirmation_sent_at timestamp with time zone,
    recovery_token text,
    recovery_sent_at timestamp with time zone,
    email_change_token text,
    email_change text,
    email_change_sent_at timestamp with time zone,
    last_sign_in_ip text,
    is_sso_user boolean DEFAULT false,
    deleted_at timestamp with time zone,
    banned_until timestamp with time zone,
    reauthentication_token text,
    reauthentication_sent_at timestamp with time zone
);

-- Create indexes
CREATE INDEX IF NOT EXISTS users_instance_id_email_idx ON auth.users (email);
CREATE INDEX IF NOT EXISTS users_instance_id_idx ON auth.users (instance_id);

-- Grant permissions
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON auth.users TO postgres, service_role;
GRANT SELECT ON auth.users TO anon, authenticated;

-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public read access" ON auth.users
    FOR SELECT
    USING (true);

CREATE POLICY "Users can update own record" ON auth.users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

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

-- Create admin user if not exists
INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    role,
    is_super_admin
)
SELECT 
    'admin@serendippo.me',
    crypt('admin123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Admin"}'::jsonb,
    'admin',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@serendippo.me'
);

-- Create simpler email check function
CREATE OR REPLACE FUNCTION public.check_email_status(check_email text)
RETURNS TABLE (
    exists_in_auth boolean,
    is_banned boolean
) 
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        EXISTS (SELECT 1 FROM auth.users WHERE email = check_email) as exists_in_auth,
        EXISTS (SELECT 1 FROM public.banned_users WHERE email = check_email) as is_banned;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.check_email_status(text) TO anon, authenticated;

-- Commit all changes
COMMIT;
