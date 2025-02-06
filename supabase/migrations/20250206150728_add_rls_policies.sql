-- RLS Policies for images
CREATE POLICY "Users can view public images"
    ON images FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert their own images"
    ON images FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update their own images"
    ON images FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM generated_images
            WHERE image_id = images.id
            AND user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM reference_images
            WHERE image_id = images.id
            AND user_id = auth.uid()
        )
    );

-- RLS Policies for image_metadata
CREATE POLICY "Users can view public image metadata"
    ON image_metadata FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert image metadata"
    ON image_metadata FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update their own image metadata"
    ON image_metadata FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM images i
            JOIN generated_images g ON g.image_id = i.id
            WHERE i.id = image_metadata.image_id
            AND g.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM images i
            JOIN reference_images r ON r.image_id = i.id
            WHERE i.id = image_metadata.image_id
            AND r.user_id = auth.uid()
        )
    );

-- RLS Policies for generated_images
CREATE POLICY "Users can view their own generated images"
    ON generated_images FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ));

CREATE POLICY "Users can insert their own generated images"
    ON generated_images FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own generated images"
    ON generated_images FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own generated images"
    ON generated_images FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- RLS Policies for reference_images
CREATE POLICY "Users can view their own reference images"
    ON reference_images FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ));

CREATE POLICY "Users can insert their own reference images"
    ON reference_images FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reference images"
    ON reference_images FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reference images"
    ON reference_images FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- RLS Policies for image_collections
CREATE POLICY "Users can view public collections"
    ON image_collections FOR SELECT
    TO authenticated
    USING (is_public OR user_id = auth.uid());

CREATE POLICY "Users can insert their own collections"
    ON image_collections FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own collections"
    ON image_collections FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own collections"
    ON image_collections FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- RLS Policies for collection_images
CREATE POLICY "Users can view images in public collections"
    ON collection_images FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM image_collections
            WHERE id = collection_id
            AND (is_public OR user_id = auth.uid())
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

CREATE POLICY "Users can remove images from their collections"
    ON collection_images FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM image_collections
            WHERE id = collection_id
            AND user_id = auth.uid()
        )
    );

-- RLS Policies for credit_transactions
CREATE POLICY "Users can view their own credit transactions"
    ON credit_transactions FOR SELECT
    TO authenticated
    USING (profile_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ));

CREATE POLICY "System can insert credit transactions"
    ON credit_transactions FOR INSERT
    TO authenticated
    WITH CHECK (profile_id = auth.uid());

-- RLS Policies for subscription_history
CREATE POLICY "Users can view their own subscription history"
    ON subscription_history FOR SELECT
    TO authenticated
    USING (profile_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ));

CREATE POLICY "System can insert subscription history"
    ON subscription_history FOR INSERT
    TO authenticated
    WITH CHECK (profile_id = auth.uid());

-- RLS Policies for credit_sources
CREATE POLICY "Users can view their own credit sources"
    ON credit_sources FOR SELECT
    TO authenticated
    USING (profile_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ));

-- RLS Policies for ad_views and ads_history
CREATE POLICY "Users can view their own ad views"
    ON ad_views FOR SELECT
    TO authenticated
    USING (profile_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ));

CREATE POLICY "Users can insert their own ad views"
    ON ad_views FOR INSERT
    TO authenticated
    WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can view their own ads history"
    ON ads_history FOR SELECT
    TO authenticated
    USING (profile_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ));

-- RLS Policies for oauth_tokens
CREATE POLICY "Users can view their own oauth tokens"
    ON oauth_tokens FOR SELECT
    TO authenticated
    USING (profile_id = auth.uid());

CREATE POLICY "Users can manage their own oauth tokens"
    ON oauth_tokens FOR ALL
    TO authenticated
    USING (profile_id = auth.uid())
    WITH CHECK (profile_id = auth.uid());

-- RLS Policies for banned_emails and banned_users
CREATE POLICY "Admins can manage banned emails"
    ON banned_emails FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ));

CREATE POLICY "Admins can manage banned users"
    ON banned_users FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ));

-- Additional helper functions
CREATE OR REPLACE FUNCTION check_user_credits()
RETURNS trigger AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = NEW.user_id
        AND credits_balance >= 1
    ) THEN
        RAISE EXCEPTION 'Insufficient credits';
    END IF;
    
    UPDATE profiles
    SET credits_balance = credits_balance - 1
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_profile_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for profile updates
CREATE TRIGGER update_profile_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_updated_at();

-- Create trigger for credit check on image generation
CREATE TRIGGER check_credits_before_generation
    BEFORE INSERT ON generated_images
    FOR EACH ROW
    EXECUTE FUNCTION check_user_credits();

-- Create function to handle reference image usage
CREATE OR REPLACE FUNCTION update_reference_image_usage()
RETURNS trigger AS $$
BEGIN
    UPDATE reference_images
    SET usage_count = usage_count + 1,
        last_used_at = now()
    WHERE id = NEW.reference_image_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reference image usage
CREATE TRIGGER on_reference_image_used
    AFTER UPDATE OF reference_image_id ON generated_images
    FOR EACH ROW
    WHEN (NEW.reference_image_id IS NOT NULL)
    EXECUTE FUNCTION update_reference_image_usage();
