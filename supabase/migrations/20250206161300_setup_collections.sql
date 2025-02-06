-- Create collections tables
CREATE TABLE IF NOT EXISTS public.image_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.collection_images (
    collection_id UUID REFERENCES public.image_collections(id) ON DELETE CASCADE,
    image_id UUID REFERENCES public.images(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (collection_id, image_id)
);

-- Create indexes for collections
CREATE INDEX IF NOT EXISTS idx_collections_user ON public.image_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_public ON public.image_collections(is_public) WHERE (is_public = true);
CREATE INDEX IF NOT EXISTS idx_collection_images_collection ON public.collection_images(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_images_image ON public.collection_images(image_id);
CREATE INDEX IF NOT EXISTS idx_collection_images_added ON public.collection_images(added_at);

-- Enable RLS on collections tables
ALTER TABLE public.image_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for collections
CREATE POLICY "Users can view their own collections"
    ON public.image_collections FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid() OR 
        is_public = true OR
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

CREATE POLICY "Users can insert their own collections"
    ON public.image_collections FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own collections"
    ON public.image_collections FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own collections"
    ON public.image_collections FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Create RLS policies for collection images
CREATE POLICY "Users can view images in their collections"
    ON public.collection_images FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.image_collections
            WHERE id = collection_id AND (
                user_id = auth.uid() OR 
                is_public = true OR
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE id = auth.uid() AND is_admin = true
                )
            )
        )
    );

CREATE POLICY "Users can add images to their collections"
    ON public.collection_images FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.image_collections
            WHERE id = collection_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can remove images from their collections"
    ON public.collection_images FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.image_collections
            WHERE id = collection_id AND user_id = auth.uid()
        )
    );

-- Grant necessary permissions
GRANT ALL ON public.image_collections TO postgres, service_role;
GRANT ALL ON public.collection_images TO postgres, service_role;
GRANT SELECT ON public.image_collections TO authenticated;
GRANT SELECT ON public.collection_images TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.image_collections TO authenticated;
GRANT INSERT, DELETE ON public.collection_images TO authenticated;

-- Verify setup
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'image_collections'
    ) THEN
        RAISE EXCEPTION 'Collections tables not created properly';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'image_collections' 
        AND indexname = 'idx_collections_user'
    ) THEN
        RAISE EXCEPTION 'Collections indexes not created properly';
    END IF;
END $$;
