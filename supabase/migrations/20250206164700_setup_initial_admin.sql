-- Create initial admin user in profiles
INSERT INTO public.profiles (
    id,
    email,
    is_admin,
    created_at,
    last_sign_in_at,
    auth_provider,
    subscription_tier,
    subscription_status,
    credits_balance,
    lifetime_credits,
    language,
    theme,
    notifications_enabled,
    marketing_emails_enabled,
    ads_enabled,
    email_verified,
    needs_attention,
    updated_at
) VALUES (
    -- Get ID from auth.users where email = 'admin@serendippo.me'
    (SELECT id FROM auth.users WHERE email = 'admin@serendippo.me'),
    'admin@serendippo.me',
    true,
    now(),
    now(),
    'email',
    'admin',
    'active',
    999999,
    999999,
    'fr',
    'light',
    true,
    true,
    false,
    true,
    false,
    now()
) ON CONFLICT (id) DO UPDATE SET
    is_admin = true,
    subscription_tier = 'admin',
    credits_balance = 999999,
    lifetime_credits = 999999,
    updated_at = now();

-- Verify complete setup
DO $$
DECLARE
    tables_count integer;
    functions_count integer;
    policies_count integer;
    buckets_count integer;
    admin_exists boolean;
BEGIN
    -- Check tables
    SELECT COUNT(*) INTO tables_count
    FROM information_schema.tables
    WHERE table_schema = 'public';

    IF tables_count < 10 THEN
        RAISE EXCEPTION 'Missing tables. Expected at least 10 tables, found %', tables_count;
    END IF;

    -- Check functions
    SELECT COUNT(*) INTO functions_count
    FROM pg_proc
    WHERE pronamespace = 'public'::regnamespace;

    IF functions_count < 5 THEN
        RAISE EXCEPTION 'Missing functions. Expected at least 5 functions, found %', functions_count;
    END IF;

    -- Check policies
    SELECT COUNT(*) INTO policies_count
    FROM pg_policies
    WHERE schemaname = 'public';

    IF policies_count < 30 THEN
        RAISE EXCEPTION 'Missing policies. Expected at least 30 policies, found %', policies_count;
    END IF;

    -- Check storage buckets
    SELECT COUNT(*) INTO buckets_count
    FROM storage.buckets
    WHERE id IN ('reference-images', 'generated-images', 'avatars');

    IF buckets_count < 3 THEN
        RAISE EXCEPTION 'Missing storage buckets. Expected 3 buckets, found %', buckets_count;
    END IF;

    -- Check admin user
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE email = 'admin@serendippo.me'
        AND is_admin = true
    ) INTO admin_exists;

    IF NOT admin_exists THEN
        RAISE EXCEPTION 'Admin user not set up properly';
    END IF;

    RAISE NOTICE 'Database setup complete:';
    RAISE NOTICE '- % tables', tables_count;
    RAISE NOTICE '- % functions', functions_count;
    RAISE NOTICE '- % policies', policies_count;
    RAISE NOTICE '- % storage buckets', buckets_count;
    RAISE NOTICE '- Admin user configured';
END $$;
