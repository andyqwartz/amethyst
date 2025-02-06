-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create cron schema if not exists
CREATE SCHEMA IF NOT EXISTS cron;

-- Grant all privileges to postgres role
GRANT ALL PRIVILEGES ON SCHEMA cron TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA cron GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA cron GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA cron GRANT ALL ON FUNCTIONS TO postgres;

-- Create cron tables
CREATE TABLE IF NOT EXISTS cron.jobs (
    job_id SERIAL PRIMARY KEY,
    schedule text NOT NULL,
    command text NOT NULL,
    enabled boolean DEFAULT true,
    last_run timestamp with time zone,
    next_run timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cron.job_logs (
    log_id SERIAL PRIMARY KEY,
    job_id integer REFERENCES cron.jobs(job_id),
    run_at timestamp with time zone DEFAULT now(),
    success boolean,
    error_message text,
    duration interval
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_jobs_enabled ON cron.jobs(enabled);
CREATE INDEX IF NOT EXISTS idx_jobs_next_run ON cron.jobs(next_run);
CREATE INDEX IF NOT EXISTS idx_job_logs_job_id ON cron.job_logs(job_id);
CREATE INDEX IF NOT EXISTS idx_job_logs_run_at ON cron.job_logs(run_at);

-- Create function to update ads_watched_today
CREATE OR REPLACE FUNCTION cron.reset_ads_watched()
RETURNS void AS $$
BEGIN
    UPDATE public.profiles 
    SET ads_watched_today = 0 
    WHERE ads_watched_today > 0;
END;
$$ LANGUAGE plpgsql;

-- Create daily reset job
INSERT INTO cron.jobs (schedule, command)
VALUES 
('0 0 * * *', 'SELECT cron.reset_ads_watched();')
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE cron.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cron.job_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow read access to authenticated users"
    ON cron.jobs FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow read access to job logs for authenticated users"
    ON cron.job_logs FOR SELECT
    TO authenticated
    USING (true);

-- Grant permissions
GRANT USAGE ON SCHEMA cron TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA cron TO authenticated;

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
        SELECT 1 FROM cron.jobs 
        WHERE command LIKE '%reset_ads_watched%'
    ) THEN
        RAISE EXCEPTION 'Cron job not created properly';
    END IF;
END $$;
