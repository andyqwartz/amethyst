-- Drop the existing policy that is causing issues
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.profiles;
