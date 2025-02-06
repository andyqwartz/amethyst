-- Drop existing triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop existing storage policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop public schema policies
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            r.policyname, r.schemaname, r.tablename);
    END LOOP;

    -- Drop storage policies
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'storage'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            r.policyname, r.schemaname, r.tablename);
    END LOOP;

    -- Drop tables
    DROP TABLE IF EXISTS public.collection_images CASCADE;
    DROP TABLE IF EXISTS public.image_collections CASCADE;
    DROP TABLE IF EXISTS public.image_metadata CASCADE;
    DROP TABLE IF EXISTS public.generated_images CASCADE;
    DROP TABLE IF EXISTS public.reference_images CASCADE;
    DROP TABLE IF EXISTS public.images CASCADE;
    DROP TABLE IF EXISTS public.banned_users CASCADE;
    DROP TABLE IF EXISTS public.banned_emails CASCADE;
    DROP TABLE IF EXISTS public.credit_transactions CASCADE;
    DROP TABLE IF EXISTS public.ad_views CASCADE;
    DROP TABLE IF EXISTS public.profiles CASCADE;
END $$;

-- Create extension for vector support if not exists
CREATE EXTENSION IF NOT EXISTS vector;

[Previous file content continues from here, but without the Amethyst table and its references]

-- Create admin policies
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename != 'profiles'
        AND tablename NOT LIKE '%migration%'
    )
    LOOP
        EXECUTE format(
            'CREATE POLICY "Admins have full access" ON public.%I FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))',
            t
        );
    END LOOP;
END $$;

-- Verify setup
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
    ) THEN
        RAISE EXCEPTION 'Database not set up properly';
    END IF;
END $$;
