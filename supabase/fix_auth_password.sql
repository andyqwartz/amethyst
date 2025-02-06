-- Grant necessary permissions for password authentication
GRANT USAGE ON SCHEMA auth TO anon, authenticated;

-- Ensure anon can access necessary auth functions
GRANT EXECUTE ON FUNCTION auth.email() TO anon;
GRANT EXECUTE ON FUNCTION auth.uid() TO anon;
GRANT EXECUTE ON FUNCTION auth.role() TO anon;

-- Grant select permission on users table to anon for login
GRANT SELECT ON auth.users TO anon;

-- Modify RLS policy for auth.users to allow password verification
DROP POLICY IF EXISTS "Enable read access for all users" ON auth.users;
CREATE POLICY "Enable read access for all users" ON auth.users
  FOR SELECT USING (true);

-- Ensure proper ownership
ALTER TABLE auth.users OWNER TO supabase_auth_admin;

-- Reset sessions to ensure clean state
TRUNCATE auth.sessions CASCADE;

-- Commit changes
COMMIT;
