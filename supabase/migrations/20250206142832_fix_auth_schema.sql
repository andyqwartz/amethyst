-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Ensure proper permissions
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO anon, authenticated;

-- Create essential auth functions
CREATE OR REPLACE FUNCTION auth.uid() 
RETURNS uuid 
LANGUAGE sql STABLE 
SECURITY DEFINER 
SET search_path = public
AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

CREATE OR REPLACE FUNCTION auth.role() 
RETURNS text 
LANGUAGE sql STABLE 
SECURITY DEFINER 
SET search_path = public
AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.role', true), '')::text;
$$;

CREATE OR REPLACE FUNCTION auth.jwt() 
RETURNS jsonb 
LANGUAGE sql STABLE 
SECURITY DEFINER 
SET search_path = public
AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true), '')::jsonb;
$$;

-- Grant execute on auth functions
GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.role() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.jwt() TO anon, authenticated;

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

-- Create trigger function for auth schema
CREATE OR REPLACE FUNCTION auth.check_auth_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.banned_users 
        WHERE email = NEW.email
    ) THEN
        RAISE EXCEPTION 'Email is banned';
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS check_auth_email_trigger ON auth.users;
CREATE TRIGGER check_auth_email_trigger
    BEFORE INSERT OR UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION auth.check_auth_email();

-- Commit all changes
COMMIT;
