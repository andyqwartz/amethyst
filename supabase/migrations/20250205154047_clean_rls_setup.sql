-- Disable RLS temporarily to avoid any issues during setup
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies dynamically
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN
    FOR policy_record IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', policy_record.policyname);
    END LOOP;
END $$;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.is_admin();

-- Create admin check function with proper security
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  );
$$;

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create simplified policies
CREATE POLICY "profiles_select" ON public.profiles
FOR SELECT TO authenticated
USING (
  auth.uid() = id OR 
  public.is_admin() OR
  auth.role() = 'service_role'
);

CREATE POLICY "profiles_insert" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = id OR 
  public.is_admin() OR
  auth.role() = 'service_role'
);

CREATE POLICY "profiles_update" ON public.profiles
FOR UPDATE TO authenticated
USING (
  auth.uid() = id OR 
  public.is_admin() OR
  auth.role() = 'service_role'
)
WITH CHECK (
  auth.uid() = id OR 
  public.is_admin() OR
  auth.role() = 'service_role'
);

CREATE POLICY "profiles_delete" ON public.profiles
FOR DELETE TO authenticated
USING (
  auth.uid() = id OR 
  public.is_admin() OR
  auth.role() = 'service_role'
);

-- Create a view for public profile data
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles AS
SELECT 
    id,
    full_name,
    avatar_url,
    created_at,
    is_banned,
    subscription_tier,
    language,
    theme
FROM public.profiles;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;
GRANT SELECT ON public.public_profiles TO public;
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;

-- Add needs_attention column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = 'needs_attention'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN needs_attention BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Verify setup
DO $$
BEGIN
    -- Verify RLS is enabled
    IF NOT EXISTS (
        SELECT 1
        FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'profiles'
        AND rowsecurity = true
    ) THEN
        RAISE EXCEPTION 'RLS must be enabled on the profiles table';
    END IF;

    -- Verify function exists
    IF NOT EXISTS (
        SELECT 1
        FROM pg_proc
        WHERE proname = 'is_admin'
    ) THEN
        RAISE EXCEPTION 'is_admin function must exist';
    END IF;

    -- Verify policies exist
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'profiles'
    ) THEN
        RAISE EXCEPTION 'Policies must exist on the profiles table';
    END IF;

    -- Verify needs_attention column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = 'needs_attention'
    ) THEN
        RAISE EXCEPTION 'needs_attention column must exist';
    END IF;
END $$;
