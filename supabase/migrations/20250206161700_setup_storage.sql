-- Create storage schema
CREATE SCHEMA IF NOT EXISTS storage;

-- Create storage tables
CREATE TABLE IF NOT EXISTS storage.buckets (
    id text PRIMARY KEY,
    name text NOT NULL,
    owner uuid REFERENCES auth.users,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    public boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS storage.objects (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    bucket_id text REFERENCES storage.buckets,
    name text NOT NULL,
    owner uuid REFERENCES auth.users,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    last_accessed_at timestamptz DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/')) STORED
);

-- Create storage indexes
CREATE INDEX IF NOT EXISTS bname ON storage.buckets (name);
CREATE INDEX IF NOT EXISTS object_bucketid_index ON storage.objects (bucket_id);
CREATE INDEX IF NOT EXISTS objects_path_tokens_idx ON storage.objects USING gin (path_tokens);

-- Create reference-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('reference-images', 'reference-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage schema
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
    END LOOP;
END $$;

-- Create storage RLS policies
CREATE POLICY "Enable upload for authenticated users"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'reference-images');

CREATE POLICY "Enable read access for all users"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'reference-images');

CREATE POLICY "Enable update for users based on user_id"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'reference-images' AND owner = auth.uid())
    WITH CHECK (bucket_id = 'reference-images' AND owner = auth.uid());

CREATE POLICY "Enable delete for users based on user_id"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'reference-images' AND owner = auth.uid());

-- Create public access policies
CREATE POLICY "Allow public uploads"
    ON storage.objects FOR INSERT
    TO anon
    WITH CHECK (bucket_id = 'reference-images');

CREATE POLICY "Allow public downloads"
    ON storage.objects FOR SELECT
    TO anon
    USING (bucket_id = 'reference-images');

CREATE POLICY "Allow public updates"
    ON storage.objects FOR UPDATE
    TO anon
    USING (bucket_id = 'reference-images')
    WITH CHECK (bucket_id = 'reference-images');

CREATE POLICY "Allow public deletes"
    ON storage.objects FOR DELETE
    TO anon
    USING (bucket_id = 'reference-images');

-- Grant storage permissions
GRANT ALL ON SCHEMA storage TO postgres, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA storage TO postgres, service_role;

-- Verify storage setup
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets 
        WHERE id = 'reference-images'
    ) THEN
        RAISE EXCEPTION 'Storage bucket not created properly';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects'
        AND policyname = 'Enable upload for authenticated users'
    ) THEN
        RAISE EXCEPTION 'Storage policies not created properly';
    END IF;
END $$;
