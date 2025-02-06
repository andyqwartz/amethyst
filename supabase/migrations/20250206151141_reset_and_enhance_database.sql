-- Backup current admin users before clearing data
CREATE TEMP TABLE admin_backup AS
SELECT * FROM profiles WHERE is_admin = true;

-- Disable triggers temporarily to avoid side effects during cleanup
ALTER TABLE profiles DISABLE TRIGGER ALL;
ALTER TABLE images DISABLE TRIGGER ALL;
ALTER TABLE generated_images DISABLE TRIGGER ALL;
ALTER TABLE reference_images DISABLE TRIGGER ALL;
ALTER TABLE image_metadata DISABLE TRIGGER ALL;
ALTER TABLE credit_transactions DISABLE TRIGGER ALL;
ALTER TABLE subscription_history DISABLE TRIGGER ALL;

-- Clear data while preserving structure
TRUNCATE TABLE collection_images CASCADE;
TRUNCATE TABLE image_collections CASCADE;
TRUNCATE TABLE credit_transactions CASCADE;
TRUNCATE TABLE subscription_history CASCADE;
TRUNCATE TABLE credit_sources CASCADE;
TRUNCATE TABLE ad_views CASCADE;
TRUNCATE TABLE ads_history CASCADE;
TRUNCATE TABLE oauth_tokens CASCADE;
TRUNCATE TABLE banned_emails CASCADE;
TRUNCATE TABLE banned_users CASCADE;
TRUNCATE TABLE prompts CASCADE;
TRUNCATE TABLE image_metadata CASCADE;
TRUNCATE TABLE generated_images CASCADE;
TRUNCATE TABLE reference_images CASCADE;
TRUNCATE TABLE images CASCADE;
TRUNCATE TABLE profiles CASCADE;
TRUNCATE TABLE user_generation_stats CASCADE;

-- Drop duplicate tables if they exist
DROP TABLE IF EXISTS credits_transactions;
DROP TABLE IF EXISTS active_reference_images;

-- Add new columns for enhanced image analysis
ALTER TABLE image_metadata
    ADD COLUMN IF NOT EXISTS vision_api_provider TEXT DEFAULT 'google',
    ADD COLUMN IF NOT EXISTS vision_api_version TEXT,
    ADD COLUMN IF NOT EXISTS vision_api_model TEXT,
    ADD COLUMN IF NOT EXISTS vision_api_cost NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS vision_api_response_time INTEGER,
    ADD COLUMN IF NOT EXISTS content_moderation_score NUMERIC,
    ADD COLUMN IF NOT EXISTS content_categories JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS detected_faces JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS detected_text_blocks JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS image_quality_score NUMERIC,
    ADD COLUMN IF NOT EXISTS technical_metadata JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS similarity_search_enabled BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS last_embedding_update TIMESTAMP WITH TIME ZONE;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_image_metadata_vision_provider 
    ON image_metadata(vision_api_provider);
CREATE INDEX IF NOT EXISTS idx_image_metadata_content_moderation 
    ON image_metadata(content_moderation_score) 
    WHERE content_moderation_score > 0.7;
CREATE INDEX IF NOT EXISTS idx_image_metadata_quality 
    ON image_metadata(image_quality_score) 
    WHERE image_quality_score > 0.8;
CREATE INDEX IF NOT EXISTS idx_image_metadata_categories 
    ON image_metadata USING gin (content_categories);
CREATE INDEX IF NOT EXISTS idx_image_metadata_technical 
    ON image_metadata USING gin (technical_metadata);

-- Add function for image analysis scheduling
CREATE OR REPLACE FUNCTION schedule_image_analysis()
RETURNS trigger AS $$
BEGIN
    -- Set default values for new image analysis
    NEW.processing_status := 'pending';
    NEW.vision_api_provider := COALESCE(NEW.vision_api_provider, 'google');
    NEW.similarity_search_enabled := true;
    NEW.content_categories := '[]'::jsonb;
    NEW.technical_metadata := jsonb_build_object(
        'scheduled_at', CURRENT_TIMESTAMP,
        'priority', CASE 
            WHEN EXISTS (
                SELECT 1 FROM generated_images 
                WHERE image_id = NEW.image_id
            ) THEN 'high'
            ELSE 'normal'
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic image analysis scheduling
DROP TRIGGER IF EXISTS on_image_metadata_insert ON image_metadata;
CREATE TRIGGER on_image_metadata_insert
    BEFORE INSERT ON image_metadata
    FOR EACH ROW
    EXECUTE FUNCTION schedule_image_analysis();

-- Add function for content moderation
CREATE OR REPLACE FUNCTION check_content_moderation()
RETURNS trigger AS $$
BEGIN
    IF NEW.content_moderation_score > 0.8 OR NEW.nsfw_score > 0.8 THEN
        UPDATE images 
        SET is_nsfw = true 
        WHERE id = NEW.image_id;
        
        -- Flag user profile for review if multiple violations
        IF (
            SELECT COUNT(*) 
            FROM image_metadata im
            JOIN images i ON im.image_id = i.id
            JOIN generated_images gi ON i.id = gi.image_id
            WHERE gi.user_id = (
                SELECT user_id 
                FROM generated_images 
                WHERE image_id = NEW.image_id
            )
            AND (im.content_moderation_score > 0.8 OR im.nsfw_score > 0.8)
        ) >= 3 THEN
            UPDATE profiles 
            SET needs_attention = true
            WHERE id = (
                SELECT user_id 
                FROM generated_images 
                WHERE image_id = NEW.image_id
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for content moderation
DROP TRIGGER IF EXISTS on_image_metadata_update ON image_metadata;
CREATE TRIGGER on_image_metadata_update
    AFTER UPDATE OF content_moderation_score, nsfw_score ON image_metadata
    FOR EACH ROW
    EXECUTE FUNCTION check_content_moderation();

-- Restore admin users
INSERT INTO profiles 
SELECT * FROM admin_backup
ON CONFLICT (id) DO UPDATE
SET is_admin = true,
    email_verified = true;

DROP TABLE admin_backup;

-- Re-enable triggers
ALTER TABLE profiles ENABLE TRIGGER ALL;
ALTER TABLE images ENABLE TRIGGER ALL;
ALTER TABLE generated_images ENABLE TRIGGER ALL;
ALTER TABLE reference_images ENABLE TRIGGER ALL;
ALTER TABLE image_metadata ENABLE TRIGGER ALL;
ALTER TABLE credit_transactions ENABLE TRIGGER ALL;
ALTER TABLE subscription_history ENABLE TRIGGER ALL;

-- Add function to calculate image similarity
CREATE OR REPLACE FUNCTION calculate_image_similarity(
    embedding1 vector,
    embedding2 vector
) RETURNS float AS $$
BEGIN
    RETURN 1 - (embedding1 <=> embedding2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add function to find similar images
CREATE OR REPLACE FUNCTION find_similar_images(
    target_embedding vector,
    similarity_threshold float DEFAULT 0.8,
    max_results integer DEFAULT 10
) RETURNS TABLE (
    image_id uuid,
    similarity float
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        im.image_id,
        calculate_image_similarity(im.embedding, target_embedding) as similarity
    FROM image_metadata im
    WHERE im.similarity_search_enabled = true
    AND im.embedding IS NOT NULL
    AND calculate_image_similarity(im.embedding, target_embedding) >= similarity_threshold
    ORDER BY similarity DESC
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Update RLS policies for new features
ALTER TABLE image_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all image metadata"
    ON image_metadata FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ));

CREATE POLICY "Users can view their own image metadata"
    ON image_metadata FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM images i
            JOIN generated_images g ON g.image_id = i.id
            WHERE i.id = image_id
            AND g.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM images i
            JOIN reference_images r ON r.image_id = i.id
            WHERE i.id = image_id
            AND r.user_id = auth.uid()
        )
    );

-- Grant permissions for new functions
GRANT EXECUTE ON FUNCTION calculate_image_similarity TO authenticated;
GRANT EXECUTE ON FUNCTION find_similar_images TO authenticated;
