-- Query to list all policies for the public.profiles table
SELECT *
FROM pg_policies
WHERE tablename = 'profiles' AND schemaname = 'public';
