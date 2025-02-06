-- Drop the problematic email check function
DROP FUNCTION IF EXISTS public.check_email_status(text);

-- Create a simpler version that only checks for banned status
CREATE OR REPLACE FUNCTION public.check_email_status(check_email text)
RETURNS TABLE (
    exists_in_auth boolean,
    is_banned boolean
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        false as exists_in_auth, -- Always allow new registrations
        EXISTS (
            SELECT 1 
            FROM public.banned_users 
            WHERE email = check_email
        ) as is_banned;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.check_email_status(text) TO anon, authenticated;

-- Drop existing policies
DO $$
BEGIN
    -- Drop all policies on auth.users
    DROP POLICY IF EXISTS "Public read access" ON auth.users;
    DROP POLICY IF EXISTS "Users can update own record" ON auth.users;
    DROP POLICY IF EXISTS "Users can delete own record" ON auth.users;
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON auth.users;
    DROP POLICY IF EXISTS "Users can update own profile" ON auth.users;
    DROP POLICY IF EXISTS "Users can insert own profile" ON auth.users;
    DROP POLICY IF EXISTS "Enable read access for all users" ON auth.users;
    DROP POLICY IF EXISTS "Enable update access for users based on id" ON auth.users;
    DROP POLICY IF EXISTS "Enable delete access for users based on id" ON auth.users;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- Create admin user if not exists
DO $$
BEGIN
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        role,
        is_super_admin
    )
    SELECT 
        gen_random_uuid(),
        'admin@serendippo.me',
        crypt('admin123', gen_salt('bf')),
        now(),
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        '{"full_name": "Admin"}'::jsonb,
        now(),
        now(),
        'admin',
        true
    WHERE NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'admin@serendippo.me'
    );
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- Create corresponding profile for admin
DO $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        is_admin,
        created_at,
        updated_at,
        theme,
        language,
        subscription_tier,
        subscription_status,
        credits_balance,
        lifetime_credits
    )
    SELECT 
        u.id,
        u.email,
        'Admin',
        true,
        now(),
        now(),
        'light',
        'Français',
        'admin',
        'active',
        9999,
        9999
    FROM auth.users u
    WHERE u.email = 'admin@serendippo.me'
    AND NOT EXISTS (
        SELECT 1 FROM public.profiles WHERE email = 'admin@serendippo.me'
    );
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- Ensure proper permissions
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON auth.users TO postgres, service_role;
GRANT SELECT ON auth.users TO anon, authenticated;

-- Enable RLS but with permissive policies
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Public read access" ON auth.users
    FOR SELECT
    USING (true);

CREATE POLICY "Users can update own record" ON auth.users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own record" ON auth.users
    FOR DELETE
    USING (auth.uid() = id);

-- Commit all changes
COMMIT;
