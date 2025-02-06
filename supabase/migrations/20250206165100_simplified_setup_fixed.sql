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
    DROP TABLE IF EXISTS public.Amethyst CASCADE;
    DROP TABLE IF EXISTS public.profiles CASCADE;
END $$;

-- Create profiles table
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY,
    email text,
    is_admin boolean DEFAULT false,
    is_banned boolean DEFAULT false,
    created_at timestamptz DEFAULT timezone('utc'::text, now()),
    last_sign_in_at timestamptz DEFAULT timezone('utc'::text, now()),
    full_name text,
    phone_number text,
    avatar_url text,
    auth_provider text,
    provider_id text,
    subscription_tier text DEFAULT 'free'::text,
    subscription_status text DEFAULT 'active'::text,
    subscription_end_date timestamp without time zone,
    stripe_customer_id text,
    credits_balance integer DEFAULT 0,
    lifetime_credits integer DEFAULT 0,
    last_credit_update timestamp without time zone DEFAULT now(),
    language text DEFAULT 'fr'::text,
    theme text DEFAULT 'light'::text,
    notifications_enabled boolean DEFAULT true,
    marketing_emails_enabled boolean DEFAULT true,
    ads_enabled boolean DEFAULT true,
    ads_credits_earned integer DEFAULT 0,
    ads_watched_today integer DEFAULT 0,
    ads_last_watched timestamp without time zone,
    daily_ads_limit integer DEFAULT 10,
    email_verified boolean DEFAULT false,
    phone_verified boolean DEFAULT false,
    needs_attention boolean DEFAULT false,
    updated_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Create images table
CREATE TABLE public.images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    width integer NOT NULL,
    height integer NOT NULL,
    file_size_bytes bigint NOT NULL,
    format text NOT NULL,
    hash text NOT NULL UNIQUE,
    storage_path text NOT NULL,
    public_url text,
    is_nsfw boolean DEFAULT false,
    created_at timestamptz DEFAULT timezone('utc'::text, now()),
    metadata jsonb DEFAULT '{}'::jsonb
);

-- Create generated_images table
CREATE TABLE public.generated_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id),
    image_id uuid REFERENCES public.images(id),
    prompt text NOT NULL,
    negative_prompt text DEFAULT ''::text,
    width integer DEFAULT 512,
    height integer DEFAULT 512,
    num_inference_steps integer DEFAULT 20,
    guidance_scale double precision DEFAULT 7.5,
    seed bigint,
    strength double precision DEFAULT 1.0,
    num_outputs integer DEFAULT 1,
    output_quality integer DEFAULT 100,
    prompt_strength double precision DEFAULT 0.8,
    lora_scales double precision[] DEFAULT ARRAY[]::double precision[],
    disable_safety_checker boolean DEFAULT false,
    reference_image_id uuid REFERENCES public.images(id),
    reference_image_strength double precision DEFAULT 0.75,
    generation_time double precision,
    status text DEFAULT 'pending'::text,
    raw_parameters jsonb DEFAULT '{}'::jsonb,
    parameter_history jsonb[] DEFAULT ARRAY[]::jsonb[],
    created_at timestamptz DEFAULT timezone('utc'::text, now()),
    started_at timestamptz,
    completed_at timestamptz,
    model_version text DEFAULT 'SDXL 1.0'::text,
    scheduler text DEFAULT 'DPMSolverMultistep'::text,
    hf_loras text[] DEFAULT ARRAY[]::text[],
    aspect_ratio text DEFAULT '1:1'::text,
    output_format text DEFAULT 'png'::text,
    error_message text
);

-- Create reference_images table
CREATE TABLE public.reference_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id),
    image_id uuid REFERENCES public.images(id),
    original_filename text,
    purpose text DEFAULT 'reference'::text,
    preprocessing_applied jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT timezone('utc'::text, now()),
    last_used_at timestamptz DEFAULT timezone('utc'::text, now()),
    usage_count integer DEFAULT 0,
    width integer,
    height integer,
    public_url text
);

-- Create image_metadata table
CREATE TABLE public.image_metadata (
    image_id uuid PRIMARY KEY REFERENCES public.images(id),
    vision_text text,
    vision_labels jsonb DEFAULT '{}'::jsonb,
    vision_objects jsonb DEFAULT '{}'::jsonb,
    vision_colors jsonb DEFAULT '{}'::jsonb,
    embedding vector(512),
    style_embedding vector(512),
    content_embedding vector(512),
    confidence_score double precision,
    nsfw_score double precision,
    processing_status text DEFAULT 'pending'::text,
    processed_at timestamptz,
    raw_analysis_result jsonb DEFAULT '{}'::jsonb,
    error_message text
);

-- Create collections tables
CREATE TABLE public.image_collections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id),
    name text NOT NULL,
    description text,
    is_public boolean DEFAULT false,
    created_at timestamptz DEFAULT timezone('utc'::text, now()),
    updated_at timestamptz DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.collection_images (
    collection_id uuid REFERENCES public.image_collections(id),
    image_id uuid REFERENCES public.images(id),
    added_at timestamptz DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (collection_id, image_id)
);

-- Create banned users tables
CREATE TABLE public.banned_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    reason text,
    banned_at timestamptz DEFAULT timezone('utc'::text, now()),
    banned_by uuid REFERENCES public.profiles(id),
    created_at timestamptz DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.banned_emails (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    reason text,
    banned_at timestamptz DEFAULT now(),
    banned_by uuid REFERENCES public.profiles(id)
);

-- Create ad views table
CREATE TABLE public.ad_views (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES public.profiles(id),
    ad_id text NOT NULL,
    view_duration integer,
    credits_earned integer DEFAULT 0,
    completed boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb
);

-- Create credit transactions table
CREATE TABLE public.credit_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES public.profiles(id),
    type text NOT NULL,
    amount integer NOT NULL,
    description text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_images_hash ON public.images(hash);
CREATE INDEX IF NOT EXISTS idx_images_format_size ON public.images(format, file_size_bytes);
CREATE INDEX IF NOT EXISTS idx_images_metadata ON public.images USING gin (metadata jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_images_nsfw ON public.images(is_nsfw) WHERE (is_nsfw = true);

CREATE INDEX IF NOT EXISTS idx_generated_images_user ON public.generated_images(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_images_created ON public.generated_images(created_at);
CREATE INDEX IF NOT EXISTS idx_generated_images_model ON public.generated_images(model_version, created_at);
CREATE INDEX IF NOT EXISTS idx_generated_images_completed ON public.generated_images(completed_at) WHERE (status = 'completed');
CREATE INDEX IF NOT EXISTS idx_generated_images_processing ON public.generated_images(started_at) WHERE (status = 'processing');
CREATE INDEX IF NOT EXISTS idx_generated_images_generation_time ON public.generated_images(generation_time);
CREATE INDEX IF NOT EXISTS idx_generated_images_status ON public.generated_images(status);

CREATE INDEX IF NOT EXISTS idx_reference_images_user ON public.reference_images(user_id);
CREATE INDEX IF NOT EXISTS idx_reference_images_last_used ON public.reference_images(last_used_at);
CREATE INDEX IF NOT EXISTS idx_reference_images_usage_count ON public.reference_images(usage_count);

CREATE INDEX IF NOT EXISTS idx_image_metadata_nsfw_score ON public.image_metadata(nsfw_score) WHERE (nsfw_score > 0.5);
CREATE INDEX IF NOT EXISTS idx_image_metadata_vision_labels ON public.image_metadata USING gin (vision_labels jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_image_metadata_vision_objects ON public.image_metadata USING gin (vision_objects jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_image_metadata_embedding ON public.image_metadata USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_image_metadata_style ON public.image_metadata USING ivfflat (style_embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_image_metadata_content ON public.image_metadata USING ivfflat (content_embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_collections_public ON public.image_collections(is_public) WHERE (is_public = true);
CREATE INDEX IF NOT EXISTS idx_collections_user ON public.image_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_images_added ON public.collection_images(added_at);
CREATE INDEX IF NOT EXISTS idx_collection_images_collection ON public.collection_images(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_images_image ON public.collection_images(image_id);

CREATE INDEX IF NOT EXISTS idx_banned_users_email ON public.banned_users(email);
CREATE INDEX IF NOT EXISTS idx_banned_emails_email ON public.banned_emails(email);

CREATE INDEX IF NOT EXISTS idx_ad_views_profile ON public.ad_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_profile ON public.credit_transactions(profile_id);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_is_banned ON public.profiles(is_banned);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banned_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banned_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view images"
    ON public.images FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert images"
    ON public.images FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can view their own generated images"
    ON public.generated_images FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generated images"
    ON public.generated_images FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generated images"
    ON public.generated_images FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own reference images"
    ON public.reference_images FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reference images"
    ON public.reference_images FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reference images"
    ON public.reference_images FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view image metadata"
    ON public.image_metadata FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert image metadata"
    ON public.image_metadata FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can view their own collections and public collections"
    ON public.image_collections FOR SELECT
    USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert their own collections"
    ON public.image_collections FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections"
    ON public.image_collections FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections"
    ON public.image_collections FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view images in their collections or public collections"
    ON public.collection_images FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.image_collections
        WHERE id = collection_id
        AND (user_id = auth.uid() OR is_public = true)
    ));

CREATE POLICY "Users can add images to their collections"
    ON public.collection_images FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.image_collections
        WHERE id = collection_id AND user_id = auth.uid()
    ));

CREATE POLICY "Users can remove images from their collections"
    ON public.collection_images FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.image_collections
        WHERE id = collection_id AND user_id = auth.uid()
    ));

CREATE POLICY "Users can view their own ad views"
    ON public.ad_views FOR SELECT
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own ad views"
    ON public.ad_views FOR INSERT
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can view their own credit transactions"
    ON public.credit_transactions FOR SELECT
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own credit transactions"
    ON public.credit_transactions FOR INSERT
    WITH CHECK (auth.uid() = profile_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('reference-images', 'Reference Images', true),
    ('generated-images', 'Generated Images', true),
    ('avatars', 'User Avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage policies
CREATE POLICY "Public Access to Storage"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('reference-images', 'generated-images', 'avatars'));

CREATE POLICY "Authenticated users can upload reference images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'reference-images' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Authenticated users can upload generated images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'generated-images' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'avatars' AND
        name = auth.uid()::text || '.jpg'
    );

CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'avatars' AND
        name = auth.uid()::text || '.jpg'
    )
    WITH CHECK (
        bucket_id = 'avatars' AND
        name = auth.uid()::text || '.jpg'
    );

CREATE POLICY "Users can delete their own files"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id IN ('reference-images', 'generated-images', 'avatars') AND
        (
            (storage.foldername(name))[1] = auth.uid()::text OR
            name = auth.uid()::text || '.jpg'
        )
    );

-- Create trigger for profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, created_at)
    VALUES (new.id, new.email, new.created_at);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

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
