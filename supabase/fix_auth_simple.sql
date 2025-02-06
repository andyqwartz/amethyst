-- Reset all permissions first
REVOKE ALL ON ALL TABLES IN SCHEMA auth FROM public, anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA auth FROM public, anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA auth FROM public, anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM public, anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM public, anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM public, anon, authenticated;

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'aal_level') THEN
    CREATE TYPE auth.aal_level AS ENUM ('aal1', 'aal2', 'aal3');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'code_challenge_method') THEN
    CREATE TYPE auth.code_challenge_method AS ENUM ('s256', 'plain');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'factor_status') THEN
    CREATE TYPE auth.factor_status AS ENUM ('unverified', 'verified');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'factor_type') THEN
    CREATE TYPE auth.factor_type AS ENUM ('totp', 'webauthn');
  END IF;
END $$;

-- Ensure schemas exist
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS public;

-- Create auth tables if they don't exist
CREATE TABLE IF NOT EXISTS auth.users (
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    instance_id uuid,
    email text,
    encrypted_password text,
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token text,
    confirmation_sent_at timestamp with time zone,
    recovery_token text,
    recovery_sent_at timestamp with time zone,
    email_change_token_new text,
    email_change text,
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text NULL UNIQUE,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::text,
    phone_change_token text DEFAULT ''::text,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone,
    email_change_token_current text DEFAULT ''::text,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token text DEFAULT ''::text,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false,
    deleted_at timestamp with time zone,
    UNIQUE (email, deleted_at)
);

-- Create other auth tables
CREATE TABLE IF NOT EXISTS auth.identities (
    id text NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS auth.sessions (
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone
);

CREATE TABLE IF NOT EXISTS auth.refresh_tokens (
    id bigserial PRIMARY KEY,
    token text NOT NULL UNIQUE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent text,
    session_id uuid REFERENCES auth.sessions(id) ON DELETE CASCADE
);

-- Create function to check if email is banned
CREATE OR REPLACE FUNCTION auth.check_banned_email(check_email text)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.banned_emails WHERE email = check_email
    UNION
    SELECT 1 FROM public.banned_users WHERE email = check_email
  );
END;
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION auth.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  default_role text := 'authenticated';
  default_language text := 'Français';
  default_theme text := 'light';
BEGIN
  -- Check if email is banned
  IF auth.check_banned_email(new.email) THEN
    RAISE EXCEPTION 'Email address is banned';
  END IF;

  -- Create profile
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    is_admin,
    is_banned,
    language,
    theme,
    credits_balance,
    lifetime_credits,
    subscription_tier,
    subscription_status,
    ads_enabled,
    ads_watched_today,
    daily_ads_limit,
    ads_credits_earned,
    created_at,
    updated_at
  ) VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', null),
    false,
    false,
    default_language,
    default_theme,
    0,
    0,
    'free',
    'inactive',
    true,
    0,
    5,
    0,
    now(),
    now()
  );

  RETURN new;
END;
$$;

-- Grant schema usage
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- Grant table permissions
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA auth TO postgres, service_role;

-- Grant specific permissions to anon and authenticated
GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.role() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.email() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.get_user_by_email(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.verify_user_password(uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.check_banned_email(text) TO anon, authenticated;

GRANT SELECT ON auth.users TO anon, authenticated;
GRANT SELECT ON auth.identities TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON auth.sessions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON auth.refresh_tokens TO anon, authenticated;

-- Grant public schema permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.banned_emails TO anon, authenticated;
GRANT SELECT ON public.banned_users TO anon, authenticated;

-- Grant sequence usage
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA auth TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
DECLARE
    _schema text;
    _table text;
    _policy text;
BEGIN
    FOR _schema, _table, _policy IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname IN ('auth', 'public')
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', _policy, _schema, _table);
    END LOOP;
END $$;

-- Create policies for auth schema tables
CREATE POLICY "Enable read access for all users" ON auth.users
  FOR SELECT USING (true);

CREATE POLICY "Enable update for users based on email" ON auth.users
  FOR UPDATE USING (
    auth.email() IS NOT NULL AND 
    auth.email()::text = email::text
  );

CREATE POLICY "Enable delete for users based on email" ON auth.users
  FOR DELETE USING (
    auth.email() IS NOT NULL AND 
    auth.email()::text = email::text
  );

CREATE POLICY "Enable insert for users" ON auth.users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON auth.sessions
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for sessions" ON auth.sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for sessions" ON auth.sessions
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for sessions" ON auth.sessions
  FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON auth.refresh_tokens
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for refresh tokens" ON auth.refresh_tokens
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for refresh tokens" ON auth.refresh_tokens
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for refresh tokens" ON auth.refresh_tokens
  FOR DELETE USING (true);

-- Create policies for public schema
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own profile' AND tablename = 'profiles' AND schemaname = 'public') THEN
    CREATE POLICY "Users can view their own profile"
      ON public.profiles FOR SELECT
      USING (auth.uid() = id);
  END IF;

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));

-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create trigger for new user handling
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure proper ownership
ALTER TABLE auth.users OWNER TO postgres;
ALTER TABLE auth.identities OWNER TO postgres;
ALTER TABLE auth.sessions OWNER TO postgres;
ALTER TABLE auth.refresh_tokens OWNER TO postgres;
ALTER TABLE public.profiles OWNER TO postgres;

-- Create indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON auth.users(email);
CREATE INDEX IF NOT EXISTS users_instance_id_idx ON auth.users(instance_id);
CREATE INDEX IF NOT EXISTS identities_user_id_idx ON auth.identities(user_id);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON auth.sessions(user_id);
CREATE INDEX IF NOT EXISTS refresh_tokens_token_idx ON auth.refresh_tokens(token);
CREATE INDEX IF NOT EXISTS profiles_id_idx ON public.profiles(id);

-- Clear any existing sessions
TRUNCATE auth.sessions CASCADE;

-- Reset schema permissions
GRANT USAGE ON SCHEMA public TO public;
GRANT USAGE ON SCHEMA auth TO public;

-- Commit all changes
COMMIT;

</final_file_content>

IMPORTANT: For any future changes to this file, use the final_file_content shown above as your reference. This content reflects the current state of the file, including any auto-formatting (e.g., if you used single quotes but the formatter converted them to double quotes). Always base your SEARCH/REPLACE operations on this final version to ensure accuracy.

<environment_details>
# VSCode Visible Files
src/components/image-generator/modals/ProfileModal.tsx
supabase/fix_auth_simple.sql

# VSCode Open Tabs
src/components/image-generator/modals/DeleteImageModal.tsx
src/components/image-generator/modals/ProfileModal.tsx
supabase/migrations/20240206_fix_auth.sql
supabase/fix_auth.sql
supabase/fix_auth_simple.sql
supabase/fix_auth_complete.sql
src/hooks/use-auth.ts
src/lib/supabase/client.ts
src/components/image-generator/modals/HelpModal.tsx
src/components/image-generator/settings/LoraSettings.tsx
src/components/image-generator/ReferenceImageSystem.tsx

# Current Time
06/02/2025 12:12:01 PM (Europe/Paris, UTC+1:00)

# Current Mode
ACT MODE
</environment_details>
