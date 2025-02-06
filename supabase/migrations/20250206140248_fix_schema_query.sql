-- First, ensure the auth schema exists and has proper permissions
CREATE SCHEMA IF NOT EXISTS auth;
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;

-- Ensure proper permissions on auth.users table
GRANT SELECT ON auth.users TO anon, authenticated;
GRANT UPDATE ON auth.users TO authenticated;

-- Grant specific permissions for critical auth functions
DO $$
BEGIN
    -- Grant execute on specific auth functions with their argument types
    EXECUTE 'GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated';
    EXECUTE 'GRANT EXECUTE ON FUNCTION auth.role() TO anon, authenticated';
    EXECUTE 'GRANT EXECUTE ON FUNCTION auth.email() TO anon, authenticated';
    EXECUTE 'GRANT EXECUTE ON FUNCTION auth.jwt() TO anon, authenticated';
END
$$;

-- Create or replace the check_email_status function with proper permissions
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
        EXISTS (
            SELECT 1 
            FROM auth.users 
            WHERE email = check_email
        ) as exists_in_auth,
        EXISTS (
            SELECT 1 
            FROM public.banned_users 
            WHERE email = check_email
        ) as is_banned;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.check_email_status(text) TO anon, authenticated;

-- Create or replace the check_admin_status function with proper permissions
CREATE OR REPLACE FUNCTION public.check_admin_status(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = user_id
        AND is_admin = true
    );
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.check_admin_status(uuid) TO anon, authenticated;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access" ON auth.users;
DROP POLICY IF EXISTS "Users can update own record" ON auth.users;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Ensure proper RLS policies
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public read access" ON auth.users
    FOR SELECT
    USING (true);

CREATE POLICY "Users can update own record" ON auth.users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Ensure proper permissions on profiles table
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT UPDATE, INSERT ON public.profiles TO authenticated;

-- Create RLS policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Ensure proper permissions on auth sequences
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT sequence_name 
        FROM information_schema.sequences 
        WHERE sequence_schema = 'auth'
    ) LOOP
        EXECUTE format('GRANT USAGE ON SEQUENCE auth.%I TO anon, authenticated', r.sequence_name);
    END LOOP;
END
$$;

-- Commit all changes
COMMIT;
