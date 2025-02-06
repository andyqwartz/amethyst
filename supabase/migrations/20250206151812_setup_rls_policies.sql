-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reference_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE banned_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE banned_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_generation_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Profile policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ));

CREATE POLICY "Admins can update all profiles"
    ON profiles FOR UPDATE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ));

-- Image policies
CREATE POLICY "Users can view their own images"
    ON images FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM generated_images
            WHERE image_id = id AND user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM reference_images
            WHERE image_id = id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all images"
    ON images FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ));

-- Generated images policies
CREATE POLICY "Users can view their own generated images"
    ON generated_images FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own generated images"
    ON generated_images FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all generated images"
    ON generated_images FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ));

-- Reference images policies
CREATE POLICY "Users can view their own reference images"
    ON reference_images FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own reference images"
    ON reference_images FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Credit transaction policies
CREATE POLICY "Users can view their own credit transactions"
    ON credit_transactions FOR SELECT
    TO authenticated
    USING (profile_id = auth.uid());

CREATE POLICY "System can create credit transactions"
    ON credit_transactions FOR INSERT
    TO authenticated
    WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Admins can view all credit transactions"
    ON credit_transactions FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ));

-- Ad view policies
CREATE POLICY "Users can view their own ad views"
    ON ad_views FOR SELECT
    TO authenticated
    USING (profile_id = auth.uid());

CREATE POLICY "Users can create their own ad views"
    ON ad_views FOR INSERT
    TO authenticated
    WITH CHECK (profile_id = auth.uid());

-- Collection policies
CREATE POLICY "Users can view their own collections"
    ON image_collections FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can create their own collections"
    ON image_collections FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Collection images policies
CREATE POLICY "Users can view collection images"
    ON collection_images FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM image_collections
            WHERE id = collection_id
            AND (user_id = auth.uid() OR is_public = true)
        )
    );

CREATE POLICY "Users can add images to their collections"
    ON collection_images FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM image_collections
            WHERE id = collection_id
            AND user_id = auth.uid()
        )
    );

-- Admin-only policies for banned users/emails
CREATE POLICY "Admins can manage banned users"
    ON banned_users FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ));

CREATE POLICY "Admins can manage banned emails"
    ON banned_emails FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ));

-- Stats policies
CREATE POLICY "Users can view their own stats"
    ON user_generation_stats FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Admins can view all stats"
    ON user_generation_stats FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ));

-- Subscription policies
CREATE POLICY "Users can view their own subscriptions"
    ON subscription_history FOR SELECT
    TO authenticated
    USING (profile_id = auth.uid());

CREATE POLICY "Admins can view all subscriptions"
    ON subscription_history FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ));

-- OAuth token policies
CREATE POLICY "Users can manage their own tokens"
    ON oauth_tokens FOR ALL
    TO authenticated
    USING (profile_id = auth.uid())
    WITH CHECK (profile_id = auth.uid());

-- Prompt policies
CREATE POLICY "Users can view their own prompts"
    ON prompts FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own prompts"
    ON prompts FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Image metadata policies
CREATE POLICY "Users can view metadata for their images"
    ON image_metadata FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM images i
            LEFT JOIN generated_images g ON g.image_id = i.id
            LEFT JOIN reference_images r ON r.image_id = i.id
            WHERE i.id = image_id
            AND (g.user_id = auth.uid() OR r.user_id = auth.uid())
        )
    );

CREATE POLICY "Admins can view all metadata"
    ON image_metadata FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ));

-- Grant basic permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute permissions on necessary functions
GRANT EXECUTE ON FUNCTION add_credits TO authenticated;
GRANT EXECUTE ON FUNCTION handle_ad_view TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;
