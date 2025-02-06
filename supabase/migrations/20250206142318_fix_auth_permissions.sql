-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO anon, authenticated;

-- Ensure proper permissions on auth sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA auth TO anon, authenticated;

-- Drop existing policies to avoid conflicts
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN (
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'auth'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON auth.%I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- Create essential RLS policies
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

-- Create essential auth functions if they don't exist
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
    SELECT 
        COALESCE(
            current_setting('request.jwt.claim.sub', true),
            (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
        )::uuid
$$;

CREATE OR REPLACE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
    SELECT 
        COALESCE(
            current_setting('request.jwt.claim.role', true),
            (current_setting('request.jwt.claims', true)::jsonb ->> 'role')
        )::text
$$;

CREATE OR REPLACE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
    SELECT 
        COALESCE(
            current_setting('request.jwt.claim.email', true),
            (current_setting('request.jwt.claims', true)::jsonb ->> 'email')
        )::text
$$;

-- Grant execute permissions on essential functions
GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.role() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.email() TO anon, authenticated;

-- Commit all changes
COMMIT;
