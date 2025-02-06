-- Create moderation tables
CREATE TABLE IF NOT EXISTS public.banned_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    reason TEXT,
    banned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    banned_by UUID REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.banned_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    reason TEXT,
    banned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    banned_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create indexes for moderation tables
CREATE INDEX IF NOT EXISTS idx_banned_emails_email ON public.banned_emails(email);
CREATE INDEX IF NOT EXISTS idx_banned_users_email ON public.banned_users(email);

-- Create RLS policies for moderation tables
ALTER TABLE public.banned_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banned_users ENABLE ROW LEVEL SECURITY;

-- Only admins can view banned emails
CREATE POLICY "Admins can view banned emails"
ON public.banned_emails FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
));

-- Only admins can manage banned emails
CREATE POLICY "Admins can manage banned emails"
ON public.banned_emails FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
));

-- Only admins can view banned users
CREATE POLICY "Admins can view banned users"
ON public.banned_users FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
));

-- Only admins can manage banned users
CREATE POLICY "Admins can manage banned users"
ON public.banned_users FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
));

-- Grant necessary permissions
GRANT ALL ON public.banned_emails TO postgres, service_role;
GRANT ALL ON public.banned_users TO postgres, service_role;
GRANT SELECT ON public.banned_emails TO authenticated;
GRANT SELECT ON public.banned_users TO authenticated;

-- Verify setup
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'banned_emails'
    ) THEN
        RAISE EXCEPTION 'Moderation tables not created properly';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'banned_emails' 
        AND indexname = 'idx_banned_emails_email'
    ) THEN
        RAISE EXCEPTION 'Moderation indexes not created properly';
    END IF;
END $$;
