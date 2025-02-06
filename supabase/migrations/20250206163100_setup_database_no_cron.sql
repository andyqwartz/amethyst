-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
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
CREATE TABLE IF NOT EXISTS public.images (
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
CREATE TABLE IF NOT EXISTS public.generated_images (
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
CREATE TABLE IF NOT EXISTS public.reference_images (
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
CREATE TABLE IF NOT EXISTS public.image_metadata (
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
CREATE TABLE IF NOT EXISTS public.image_collections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id),
    name text NOT NULL,
    description text,
    is_public boolean DEFAULT false,
    created_at timestamptz DEFAULT timezone('utc'::text, now()),
    updated_at timestamptz DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.collection_images (
    collection_id uuid REFERENCES public.image_collections(id),
    image_id uuid REFERENCES public.images(id),
    added_at timestamptz DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (collection_id, image_id)
);

-- Create banned users tables
CREATE TABLE IF NOT EXISTS public.banned_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    reason text,
    banned_at timestamptz DEFAULT timezone('utc'::text, now()),
    banned_by uuid REFERENCES public.profiles(id),
    created_at timestamptz DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.banned_emails (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    reason text,
    banned_at timestamptz DEFAULT now(),
    banned_by uuid REFERENCES public.profiles(id)
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
CREATE INDEX IF NOT EXISTS idx_collection_images_added ON public.collection_images(added_at);

-- Create RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banned_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banned_emails ENABLE ROW LEVEL SECURITY;

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
