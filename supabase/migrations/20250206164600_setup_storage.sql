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
CREATE POLICY "Public Access"
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

CREATE POLICY "Admins have full access to storage"
    ON storage.objects FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Verify setup
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets 
        WHERE id IN ('reference-images', 'generated-images', 'avatars')
    ) THEN
        RAISE EXCEPTION 'Storage buckets not set up properly';
    END IF;
END $$;
