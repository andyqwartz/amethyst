-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Drop existing tables and types
DROP TABLE IF EXISTS public.image_metadata CASCADE;
DROP TABLE IF EXISTS public.generated_images CASCADE;
DROP TABLE IF EXISTS public.reference_images CASCADE;
DROP TABLE IF EXISTS public.collection_images CASCADE;
DROP TABLE IF EXISTS public.credit_transactions CASCADE;
DROP TABLE IF EXISTS public.ad_views CASCADE;
DROP TABLE IF EXISTS public.image_collections CASCADE;
DROP TABLE IF EXISTS public.images CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.credits_transactions CASCADE;
DROP TABLE IF EXISTS public.subscription_history CASCADE;
DROP TABLE IF EXISTS public.ads_history CASCADE;
DROP TABLE IF EXISTS public.credit_sources CASCADE;
DROP TABLE IF EXISTS public.oauth_tokens CASCADE;
DROP TABLE IF EXISTS public.banned_emails CASCADE;
DROP TABLE IF EXISTS public.banned_users CASCADE;
DROP TABLE IF EXISTS public.prompts CASCADE;
DROP TABLE IF EXISTS public.public_profiles CASCADE;
DROP TYPE IF EXISTS public.image_status CASCADE;

-- Create custom types
CREATE TYPE image_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Create base tables first
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    auth_provider TEXT,
    provider_id TEXT,
    google_id TEXT,
    apple_id TEXT,
    github_id TEXT,
    stripe_customer_id TEXT,
    phone_number TEXT,
    language TEXT DEFAULT 'fr',
    theme TEXT DEFAULT 'light',
    is_admin BOOLEAN DEFAULT false,
    is_banned BOOLEAN DEFAULT false,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    needs_attention BOOLEAN DEFAULT false,
    notifications_enabled BOOLEAN DEFAULT true,
    marketing_emails_enabled BOOLEAN DEFAULT true,
    ads_enabled BOOLEAN DEFAULT true,
    subscription_tier TEXT DEFAULT 'free',
    subscription_status TEXT DEFAULT 'active',
    subscription_end_date TIMESTAMP,
    credits_balance INTEGER DEFAULT 0,
    lifetime_credits INTEGER DEFAULT 0,
    ads_credits_earned INTEGER DEFAULT 0,
    ads_watched_today INTEGER DEFAULT 0,
    daily_ads_limit INTEGER DEFAULT 10,
    last_credit_update TIMESTAMP DEFAULT now(),
    ads_last_watched TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    last_sign_in_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hash TEXT NOT NULL UNIQUE,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    format TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    is_nsfw BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create dependent tables
CREATE TABLE public.image_metadata (
    image_id UUID PRIMARY KEY REFERENCES public.images(id),
    embedding vector(512),
    style_embedding vector(512),
    content_embedding vector(512),
    vision_text TEXT,
    vision_labels JSONB DEFAULT '{}'::jsonb,
    vision_objects JSONB DEFAULT '{}'::jsonb,
    vision_colors JSONB DEFAULT '{}'::jsonb,
    confidence_score DOUBLE PRECISION,
    nsfw_score DOUBLE PRECISION,
    processing_status image_status DEFAULT 'pending',
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    raw_analysis_result JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE public.generated_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id),
    image_id UUID REFERENCES public.images(id),
    prompt TEXT NOT NULL,
    negative_prompt TEXT DEFAULT ''::text,
    model_version TEXT DEFAULT 'SDXL 1.0'::text,
    scheduler TEXT DEFAULT 'DPMSolverMultistep'::text,
    width INTEGER DEFAULT 512,
    height INTEGER DEFAULT 512,
    num_inference_steps INTEGER DEFAULT 20,
    guidance_scale DOUBLE PRECISION DEFAULT 7.5,
    prompt_strength DOUBLE PRECISION DEFAULT 0.8,
    seed BIGINT,
    num_outputs INTEGER DEFAULT 1,
    output_format TEXT DEFAULT 'png'::text,
    aspect_ratio TEXT DEFAULT '1:1'::text,
    reference_image_id UUID REFERENCES public.images(id),
    reference_image_strength DOUBLE PRECISION DEFAULT 0.75,
    status image_status DEFAULT 'pending',
    error_message TEXT,
    generation_time DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    raw_parameters JSONB DEFAULT '{}'::jsonb,
    parameter_history JSONB[] DEFAULT ARRAY[]::jsonb[]
);

CREATE TABLE public.reference_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id),
    image_id UUID REFERENCES public.images(id),
    original_filename TEXT,
    purpose TEXT DEFAULT 'reference'::text,
    public_url TEXT,
    preprocessing_applied JSONB DEFAULT '{}'::jsonb,
    width INTEGER,
    height INTEGER,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create transaction and tracking tables
CREATE TABLE public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id),
    type TEXT NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.ad_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id),
    ad_id TEXT NOT NULL,
    view_duration INTEGER,
    credits_earned INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create admin functions
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND is_admin = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_views ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Public read access for images"
ON public.images FOR SELECT
TO authenticated
USING (true);

-- Create indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_is_admin ON public.profiles(is_admin);
CREATE INDEX idx_profiles_is_banned ON public.profiles(is_banned);
CREATE INDEX idx_images_hash ON public.images(hash);
CREATE INDEX idx_generated_images_user ON public.generated_images(user_id);
CREATE INDEX idx_generated_images_status ON public.generated_images(status);
CREATE INDEX idx_credit_transactions_profile ON public.credit_transactions(profile_id);
CREATE INDEX idx_ad_views_profile ON public.ad_views(profile_id);
