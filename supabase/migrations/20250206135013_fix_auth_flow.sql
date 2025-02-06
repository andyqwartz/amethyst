-- Drop any existing policies
DO $$ 
BEGIN
    EXECUTE (
        SELECT string_agg('DROP POLICY IF EXISTS ' || quote_ident(policyname) || ' ON ' || quote_ident(schemaname) || '.' || quote_ident(tablename) || ';', E'\n')
        FROM pg_policies 
        WHERE schemaname = 'auth'
    );
END $$;

-- Ensure auth schema exists and is accessible
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated;

-- Grant basic auth functions to anon and authenticated roles
GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.role() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.email() TO anon, authenticated;

-- Ensure auth.users table has correct permissions
GRANT SELECT ON auth.users TO anon, authenticated;
GRANT UPDATE ON auth.users TO authenticated;

-- Create policies for auth.users
CREATE POLICY "Allow public read access" ON auth.users
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated update on own record" ON auth.users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Ensure auth.sessions table has correct permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON auth.sessions TO anon, authenticated;

-- Create policies for auth.sessions
CREATE POLICY "Allow session access" ON auth.sessions
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Ensure auth.refresh_tokens table has correct permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON auth.refresh_tokens TO anon, authenticated;

-- Create policies for auth.refresh_tokens
CREATE POLICY "Allow refresh token access" ON auth.refresh_tokens
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Ensure sequences are accessible
GRANT USAGE ON ALL SEQUENCES IN SCHEMA auth TO anon, authenticated;

-- Ensure RLS is enabled
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS users_email_idx ON auth.users(email);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON auth.sessions(user_id);
CREATE INDEX IF NOT EXISTS refresh_tokens_token_idx ON auth.refresh_tokens(token);

-- Commit changes
COMMIT;
