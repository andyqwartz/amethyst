-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Custom types
DO $$ BEGIN
    CREATE TYPE image_status AS ENUM ('pending', 'processing', 'completed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop existing tables (if needed)
DROP TABLE IF EXISTS image_metadata CASCADE;
DROP TABLE IF EXISTS generated_images CASCADE;
DROP TABLE IF EXISTS reference_images CASCADE;
DROP TABLE IF EXISTS collection_images CASCADE;
DROP TABLE IF EXISTS image_collections CASCADE;
DROP TABLE IF EXISTS credit_transactions CASCADE;
DROP TABLE IF EXISTS subscription_history CASCADE;
DROP TABLE IF EXISTS credit_sources CASCADE;
DROP TABLE IF EXISTS ad_views CASCADE;
DROP TABLE IF EXISTS ads_history CASCADE;
DROP TABLE IF EXISTS oauth_tokens CASCADE;
DROP TABLE IF EXISTS banned_emails CASCADE;
DROP TABLE IF EXISTS banned_users CASCADE;
DROP TABLE IF EXISTS prompts CASCADE;
DROP TABLE IF EXISTS images CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create base tables
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE,
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

CREATE TABLE IF NOT EXISTS images (
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

CREATE TABLE IF NOT EXISTS image_metadata (
    image_id UUID PRIMARY KEY REFERENCES images(id),
    embedding VECTOR(512),
    style_embedding VECTOR(512),
    content_embedding VECTOR(512),
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

CREATE TABLE IF NOT EXISTS prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    prompt TEXT NOT NULL,
    negative_prompt TEXT DEFAULT '',
    prompt_strength DOUBLE PRECISION DEFAULT 0.8,
    steps INTEGER DEFAULT 28,
    guidance_scale DOUBLE PRECISION DEFAULT 7.5,
    aspect_ratio TEXT DEFAULT '1:1',
    num_outputs INTEGER DEFAULT 1,
    seed INTEGER DEFAULT -1,
    output_quality INTEGER DEFAULT 90,
    output_format TEXT DEFAULT 'webp',
    safety_checker BOOLEAN DEFAULT true,
    hf_loras TEXT[] DEFAULT ARRAY['AndyVampiro/fog'],
    lora_scales DOUBLE PRECISION[] DEFAULT ARRAY[1.0],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS generated_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    image_id UUID REFERENCES images(id),
    prompt TEXT NOT NULL,
    negative_prompt TEXT DEFAULT '',
    model_version TEXT DEFAULT 'SDXL 1.0',
    scheduler TEXT DEFAULT 'DPMSolverMultistep',
    width INTEGER DEFAULT 512,
    height INTEGER DEFAULT 512,
    num_inference_steps INTEGER DEFAULT 20,
    guidance_scale DOUBLE PRECISION DEFAULT 7.5,
    prompt_strength DOUBLE PRECISION DEFAULT 0.8,
    seed BIGINT,
    strength DOUBLE PRECISION DEFAULT 1.0,
    num_outputs INTEGER DEFAULT 1,
    output_quality INTEGER DEFAULT 100,
    output_format TEXT DEFAULT 'png',
    aspect_ratio TEXT DEFAULT '1:1',
    lora_scales DOUBLE PRECISION[] DEFAULT ARRAY[]::double precision[],
    hf_loras TEXT[] DEFAULT ARRAY[]::text[],
    disable_safety_checker BOOLEAN DEFAULT false,
    reference_image_id UUID REFERENCES images(id),
    reference_image_strength DOUBLE PRECISION DEFAULT 0.75,
    generation_time DOUBLE PRECISION,
    status image_status DEFAULT 'pending',
    error_message TEXT,
    raw_parameters JSONB DEFAULT '{}'::jsonb,
    parameter_history JSONB[] DEFAULT ARRAY[]::jsonb[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS reference_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    image_id UUID REFERENCES images(id),
    original_filename TEXT,
    purpose TEXT DEFAULT 'reference',
    public_url TEXT,
    preprocessing_applied JSONB DEFAULT '{}'::jsonb,
    width INTEGER,
    height INTEGER,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS image_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS collection_images (
    collection_id UUID REFERENCES image_collections(id),
    image_id UUID REFERENCES images(id),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (collection_id, image_id)
);

CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id),
    type TEXT NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS subscription_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id),
    tier TEXT NOT NULL,
    status TEXT NOT NULL,
    payment_method TEXT,
    currency TEXT DEFAULT 'EUR',
    amount NUMERIC,
    start_date TIMESTAMP DEFAULT now(),
    end_date TIMESTAMP,
    metadata JSONB DEFAULT null
);

CREATE TABLE IF NOT EXISTS credit_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id),
    type TEXT NOT NULL,
    amount INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    expires_at TIMESTAMP,
    metadata JSONB DEFAULT null
);

CREATE TABLE IF NOT EXISTS ad_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id),
    ad_id TEXT NOT NULL,
    view_duration INTEGER,
    credits_earned INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT null,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ads_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id),
    ad_id TEXT NOT NULL,
    platform TEXT,
    credits_earned INTEGER NOT NULL,
    watched_duration INTEGER,
    completed BOOLEAN DEFAULT false,
    watched_at TIMESTAMP DEFAULT now(),
    metadata JSONB DEFAULT null
);

CREATE TABLE IF NOT EXISTS oauth_tokens (
    profile_id UUID REFERENCES profiles(id),
    provider TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    scope TEXT[],
    expires_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS banned_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    reason TEXT,
    banned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    banned_by UUID REFERENCES profiles(id)
);

CREATE TABLE IF NOT EXISTS banned_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    reason TEXT,
    banned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    banned_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_images_format_size ON images(format, file_size_bytes);
CREATE INDEX IF NOT EXISTS idx_images_metadata ON images USING gin (metadata jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_images_nsfw ON images(is_nsfw) WHERE is_nsfw = true;
CREATE INDEX IF NOT EXISTS idx_images_hash ON images(hash);

CREATE INDEX IF NOT EXISTS idx_image_metadata_vision_labels ON image_metadata USING gin (vision_labels jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_image_metadata_vision_objects ON image_metadata USING gin (vision_objects jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_image_metadata_nsfw_score ON image_metadata(nsfw_score) WHERE nsfw_score > 0.5;
CREATE INDEX IF NOT EXISTS idx_image_metadata_embedding ON image_metadata USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_image_metadata_style ON image_metadata USING ivfflat (style_embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_image_metadata_content ON image_metadata USING ivfflat (content_embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_generated_images_user ON generated_images(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_images_created ON generated_images(created_at);
CREATE INDEX IF NOT EXISTS idx_generated_images_user_status ON generated_images(user_id, status);
CREATE INDEX IF NOT EXISTS idx_generated_images_model ON generated_images(model_version, created_at);
CREATE INDEX IF NOT EXISTS idx_generated_images_prompt_trigram ON generated_images USING gist (prompt gist_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_generated_images_negative_prompt_trigram ON generated_images USING gist (negative_prompt gist_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_generated_images_completed ON generated_images(completed_at) WHERE status = 'completed';
CREATE INDEX IF NOT EXISTS idx_generated_images_processing ON generated_images(started_at) WHERE status = 'processing';
CREATE INDEX IF NOT EXISTS idx_generated_images_generation_time ON generated_images(generation_time);

CREATE INDEX IF NOT EXISTS idx_reference_images_user ON reference_images(user_id);
CREATE INDEX IF NOT EXISTS idx_reference_images_last_used ON reference_images(last_used_at);
CREATE INDEX IF NOT EXISTS idx_reference_images_usage_count ON reference_images(usage_count);

CREATE INDEX IF NOT EXISTS idx_collections_public ON image_collections(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_collection_images_added ON collection_images(added_at);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_profile_id ON credit_transactions(profile_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(type);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_subscription_history_profile ON subscription_history(profile_id);

CREATE INDEX IF NOT EXISTS idx_credit_sources_profile ON credit_sources(profile_id);

CREATE INDEX IF NOT EXISTS idx_ad_views_profile ON ad_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_ad_views_date ON ad_views(created_at);

CREATE INDEX IF NOT EXISTS idx_ads_history_profile ON ads_history(profile_id);
CREATE INDEX IF NOT EXISTS idx_ads_history_date ON ads_history(watched_at);

CREATE INDEX IF NOT EXISTS idx_oauth_tokens_profile ON oauth_tokens(profile_id, provider);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON profiles(subscription_tier, subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_is_banned ON profiles(is_banned);

-- Create RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reference_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE banned_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE banned_users ENABLE ROW LEVEL SECURITY;

-- Basic policies for profiles
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() IS NOT NULL AND
        id = auth.uid()
    );

CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    );

CREATE POLICY "Admins can update all profiles"
    ON profiles FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    );

-- Functions for profile management
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, created_at)
    VALUES (new.id, new.email, new.created_at);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS trigger AS $$
BEGIN
    DELETE FROM public.profiles WHERE id = old.id;
    RETURN old;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_deleted
    AFTER DELETE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_delete();

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to ensure at least one admin exists
CREATE OR REPLACE FUNCTION ensure_admin_exists()
RETURNS trigger AS $$
BEGIN
    IF OLD.is_admin = true AND
       NOT EXISTS (
           SELECT 1
           FROM profiles
           WHERE is_admin = true
           AND id != OLD.id
       ) THEN
        RAISE EXCEPTION 'Cannot remove last admin';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_admin_exists
    BEFORE UPDATE OR DELETE ON profiles
    FOR EACH ROW
    WHEN (OLD.is_admin = true)
    EXECUTE FUNCTION ensure_admin_exists();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role;

-- Grant specific permissions to authenticated users
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant specific permissions to anonymous users
GRANT SELECT ON TABLE profiles TO anon;
GRANT SELECT ON TABLE images TO anon;
GRANT SELECT ON TABLE image_collections TO anon;
GRANT SELECT ON TABLE collection_images TO anon;
