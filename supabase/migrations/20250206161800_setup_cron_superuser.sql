-- Note: This file must be executed with superuser privileges
-- In Supabase Dashboard SQL Editor, select "New Query (superuser)"

-- Create cron extension if not exists
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create cron schema if not exists
CREATE SCHEMA IF NOT EXISTS cron;

-- Grant usage on cron schema
GRANT USAGE ON SCHEMA cron TO postgres, service_role;

-- Create cron tables
CREATE TABLE IF NOT EXISTS cron.job (
    id bigint NOT NULL PRIMARY KEY,
    schedule text NOT NULL,
    command text NOT NULL,
    nodename text NOT NULL,
    nodeport integer NOT NULL,
    database text NOT NULL,
    username text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cron.job_run_details (
    id bigint NOT NULL PRIMARY KEY,
    job_id bigint NOT NULL REFERENCES cron.job(id),
    run_time timestamptz NOT NULL,
    retval text,
    error text,
    started_at timestamptz NOT NULL,
    finished_at timestamptz NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS job_active_idx ON cron.job (active);
CREATE INDEX IF NOT EXISTS job_run_details_job_id_idx ON cron.job_run_details (job_id);

-- Enable RLS
ALTER TABLE cron.job ENABLE ROW LEVEL SECURITY;
ALTER TABLE cron.job_run_details ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'cron'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON cron.%I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- Create RLS policies
CREATE POLICY "cron_job_policy"
    ON cron.job
    TO authenticated
    USING (true);

CREATE POLICY "cron_job_run_details_policy"
    ON cron.job_run_details
    TO authenticated
    USING (true);

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA cron TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA cron TO postgres, service_role;

-- Create daily reset job for ad views
SELECT cron.schedule(
    'reset-daily-ad-views',
    '0 0 * * *',  -- Run at midnight every day
    $$
    UPDATE public.profiles 
    SET ads_watched_today = 0 
    WHERE ads_watched_today > 0;
    $$
);

-- Verify setup
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.schemata 
        WHERE schema_name = 'cron'
    ) THEN
        RAISE EXCEPTION 'Cron schema not created properly';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_extension 
        WHERE extname = 'pg_cron'
    ) THEN
        RAISE EXCEPTION 'pg_cron extension not installed properly';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM cron.job 
        WHERE command LIKE '%ads_watched_today%'
    ) THEN
        RAISE EXCEPTION 'Cron job not created properly';
    END IF;
END $$;
