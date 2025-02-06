-- Query to list all tables in the public schema
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- Query to list all policies in the public schema
SELECT *
FROM pg_policies
WHERE schemaname = 'public';

-- Query to list all columns in the auth.users table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users' AND table_schema = 'auth';

-- Query to list all columns in the public.profiles table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles' AND table_schema = 'public';
