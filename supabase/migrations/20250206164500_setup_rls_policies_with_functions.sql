-- Drop existing policies
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

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins have full access to profiles"
    ON public.profiles FOR ALL
    USING (public.is_admin());

-- Images policies
CREATE POLICY "Anyone can view images"
    ON public.images FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert images"
    ON public.images FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Admins have full access to images"
    ON public.images FOR ALL
    USING (public.is_admin());

-- Generated images policies
CREATE POLICY "Users can view their own generated images"
    ON public.generated_images FOR SELECT
    USING (public.owns_record(user_id));

CREATE POLICY "Users can insert their own generated images"
    ON public.generated_images FOR INSERT
    WITH CHECK (public.owns_record(user_id));

CREATE POLICY "Users can update their own generated images"
    ON public.generated_images FOR UPDATE
    USING (public.owns_record(user_id))
    WITH CHECK (public.owns_record(user_id));

CREATE POLICY "Admins have full access to generated_images"
    ON public.generated_images FOR ALL
    USING (public.is_admin());

-- Reference images policies
CREATE POLICY "Users can view their own reference images"
    ON public.reference_images FOR SELECT
    USING (public.owns_record(user_id));

CREATE POLICY "Users can insert their own reference images"
    ON public.reference_images FOR INSERT
    WITH CHECK (public.owns_record(user_id));

CREATE POLICY "Users can update their own reference images"
    ON public.reference_images FOR UPDATE
    USING (public.owns_record(user_id))
    WITH CHECK (public.owns_record(user_id));

CREATE POLICY "Admins have full access to reference_images"
    ON public.reference_images FOR ALL
    USING (public.is_admin());

-- Image metadata policies
CREATE POLICY "Anyone can view image metadata"
    ON public.image_metadata FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert image metadata"
    ON public.image_metadata FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Admins have full access to image_metadata"
    ON public.image_metadata FOR ALL
    USING (public.is_admin());

-- Collections policies
CREATE POLICY "Users can view their own collections and public collections"
    ON public.image_collections FOR SELECT
    USING (public.owns_record(user_id) OR is_public = true);

CREATE POLICY "Users can insert their own collections"
    ON public.image_collections FOR INSERT
    WITH CHECK (public.owns_record(user_id));

CREATE POLICY "Users can update their own collections"
    ON public.image_collections FOR UPDATE
    USING (public.owns_record(user_id))
    WITH CHECK (public.owns_record(user_id));

CREATE POLICY "Users can delete their own collections"
    ON public.image_collections FOR DELETE
    USING (public.owns_record(user_id));

CREATE POLICY "Admins have full access to collections"
    ON public.image_collections FOR ALL
    USING (public.is_admin());

-- Collection images policies
CREATE POLICY "Users can view images in their collections or public collections"
    ON public.collection_images FOR SELECT
    USING (public.can_access_collection(collection_id));

CREATE POLICY "Users can add images to their collections"
    ON public.collection_images FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.image_collections
        WHERE id = collection_id AND public.owns_record(user_id)
    ));

CREATE POLICY "Users can remove images from their collections"
    ON public.collection_images FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.image_collections
        WHERE id = collection_id AND public.owns_record(user_id)
    ));

CREATE POLICY "Admins have full access to collection_images"
    ON public.collection_images FOR ALL
    USING (public.is_admin());

-- Banned users policies
CREATE POLICY "Admins have full access to banned_users"
    ON public.banned_users FOR ALL
    USING (public.is_admin());

-- Banned emails policies
CREATE POLICY "Admins have full access to banned_emails"
    ON public.banned_emails FOR ALL
    USING (public.is_admin());

-- Ad views policies
CREATE POLICY "Users can view their own ad views"
    ON public.ad_views FOR SELECT
    USING (public.owns_record(profile_id));

CREATE POLICY "Users can insert their own ad views"
    ON public.ad_views FOR INSERT
    WITH CHECK (public.owns_record(profile_id));

CREATE POLICY "Admins have full access to ad_views"
    ON public.ad_views FOR ALL
    USING (public.is_admin());

-- Credit transactions policies
CREATE POLICY "Users can view their own credit transactions"
    ON public.credit_transactions FOR SELECT
    USING (public.owns_record(profile_id));

CREATE POLICY "Users can insert their own credit transactions"
    ON public.credit_transactions FOR INSERT
    WITH CHECK (public.owns_record(profile_id));

CREATE POLICY "Admins have full access to credit_transactions"
    ON public.credit_transactions FOR ALL
    USING (public.is_admin());

-- Verify setup
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public'
        AND tablename = 'profiles'
        AND policyname = 'Users can view their own profile'
    ) THEN
        RAISE EXCEPTION 'RLS policies not set up properly';
    END IF;
END $$;
