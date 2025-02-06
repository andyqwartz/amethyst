-- Reset all permissions first
REVOKE ALL ON ALL TABLES IN SCHEMA auth FROM public, anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA auth FROM public, anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA auth FROM public, anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM public, anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM public, anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM public, anon, authenticated;

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create custom types if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'aal_level') THEN
    CREATE TYPE auth.aal_level AS ENUM ('aal1', 'aal2', 'aal3');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'code_challenge_method') THEN
    CREATE TYPE auth.code_challenge_method AS ENUM ('s256', 'plain');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'factor_status') THEN
    CREATE TYPE auth.factor_status AS ENUM ('unverified', 'verified');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'factor_type') THEN
    CREATE TYPE auth.factor_type AS ENUM ('totp', 'webauthn');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'generation_status') THEN
    CREATE TYPE public.generation_status AS ENUM ('pending', 'processing', 'completed', 'failed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'processing_status') THEN
    CREATE TYPE public.processing_status AS ENUM ('pending', 'processing', 'completed', 'failed');
  END IF;
END $$;

-- Ensure schemas exist
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS public;

-- Create auth functions with proper error handling
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid 
LANGUAGE sql STABLE SECURITY DEFINER 
SET search_path = auth, public
AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

CREATE OR REPLACE FUNCTION auth.role() RETURNS text 
LANGUAGE sql STABLE SECURITY DEFINER 
SET search_path = auth, public
AS $$
  SELECT COALESCE(
    NULLIF(current_setting('request.jwt.claim.role', true), ''),
    'authenticated'
  );
$$;

CREATE OR REPLACE FUNCTION auth.email() RETURNS text 
LANGUAGE sql STABLE SECURITY DEFINER 
SET search_path = auth, public
AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.email', true), '');
$$;

CREATE OR REPLACE FUNCTION auth.jwt() RETURNS jsonb 
LANGUAGE sql STABLE SECURITY DEFINER 
SET search_path = auth, public
AS $$
  SELECT COALESCE(
    NULLIF(current_setting('request.jwt.claims', true), '')::jsonb,
    '{}'::jsonb
  );
$$;

-- Create public helper functions
CREATE OR REPLACE FUNCTION public.check_admin_status(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
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

CREATE OR REPLACE FUNCTION public.check_email_status(check_email text)
RETURNS table (
  exists_in_auth boolean,
  is_banned boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN QUERY
  SELECT
    EXISTS(SELECT 1 FROM auth.users WHERE email = check_email) AS exists_in_auth,
    EXISTS(
      SELECT 1 
      FROM public.banned_users 
      WHERE email = check_email
      UNION
      SELECT 1 
      FROM public.banned_emails 
      WHERE email = check_email
    ) AS is_banned;
END;
$$;

-- Create trigger function for handling new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$;

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;

-- Grant execute on auth functions
GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.role() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.email() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.jwt() TO anon, authenticated;

-- Grant execute on public functions
GRANT EXECUTE ON FUNCTION public.check_admin_status(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_email_status(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;

-- Grant table permissions for auth schema
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA auth TO postgres;

-- Grant specific permissions for auth schema to anon and authenticated
GRANT SELECT, INSERT, UPDATE, DELETE ON auth.users TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON auth.refresh_tokens TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON auth.sessions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON auth.mfa_factors TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON auth.mfa_challenges TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON auth.identities TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON auth.flow_state TO anon, authenticated;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA auth TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Grant public schema permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role;

-- Grant specific permissions for public schema
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Drop the specific policy that is causing issues
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.profiles;

-- Create policies for auth schema tables
CREATE POLICY "Enable read access for all users" ON auth.users
  FOR SELECT USING (true);

CREATE POLICY "Enable update for users based on email" ON auth.users
  FOR UPDATE USING (
    auth.email() IS NOT NULL AND 
    auth.email()::text = email::text
  );

CREATE POLICY "Enable delete for users based on email" ON auth.users
  FOR DELETE USING (
    auth.email() IS NOT NULL AND 
    auth.email()::text = email::text
  );

CREATE POLICY "Enable insert for users" ON auth.users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON auth.sessions
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for sessions" ON auth.sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for sessions" ON auth.sessions
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for sessions" ON auth.sessions
  FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON auth.refresh_tokens
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for refresh tokens" ON auth.refresh_tokens
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for refresh tokens" ON auth.refresh_tokens
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for refresh tokens" ON auth.refresh_tokens
  FOR DELETE USING (true);

-- Create policies for public schema
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));

-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create trigger for new user handling
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure proper ownership
ALTER TABLE auth.users OWNER TO postgres;
ALTER TABLE auth.identities OWNER TO postgres;
ALTER TABLE auth.sessions OWNER TO postgres;
ALTER TABLE auth.refresh_tokens OWNER TO postgres;
ALTER TABLE public.profiles OWNER TO postgres;

-- Create indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON auth.users(email);
CREATE INDEX IF NOT EXISTS users_instance_id_idx ON auth.users(instance_id);
CREATE INDEX IF NOT EXISTS identities_user_id_idx ON auth.identities(user_id);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON auth.sessions(user_id);
CREATE INDEX IF NOT EXISTS refresh_tokens_token_idx ON auth.refresh_tokens(token);
CREATE INDEX IF NOT EXISTS profiles_id_idx ON public.profiles(id);

-- Clear any existing sessions
TRUNCATE auth.sessions CASCADE;

-- Reset schema permissions
GRANT USAGE ON SCHEMA public TO public;
GRANT USAGE ON SCHEMA auth TO public;

-- Commit all changes
COMMIT;
