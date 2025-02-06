-- Drop all existing tables first to ensure clean state
drop table if exists public.active_reference_images cascade;
drop table if exists public.reference_images cascade;
drop table if exists public.generated_images cascade;
drop table if exists public.credit_transactions cascade;
drop table if exists public.subscription_history cascade;
drop table if exists public.ad_views cascade;
drop table if exists public.profiles cascade;
drop table if exists public.banned_users cascade;
drop table if exists public.banned_emails cascade;

-- Core tables
create table if not exists public.banned_users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  reason text,
  banned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  banned_by uuid references auth.users on delete set null
);

create table if not exists public.banned_emails (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  reason text,
  banned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  banned_by uuid references auth.users on delete set null
);

create table if not exists public.active_reference_images (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  image_id uuid,
  original_filename text,
  purpose text,
  preprocessing_applied jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_used_at timestamp with time zone,
  usage_count integer default 0,
  public_url text,
  width integer,
  height integer
);

create table if not exists public.reference_images (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  image_id uuid,
  original_filename text,
  purpose text,
  preprocessing_applied jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_used_at timestamp with time zone,
  usage_count integer default 0
);

create table if not exists public.generated_images (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  prompt text,
  negative_prompt text,
  width integer,
  height integer,
  num_inference_steps integer,
  guidance_scale double precision,
  seed bigint,
  scheduler text,
  strength double precision,
  num_outputs integer,
  aspect_ratio text,
  output_format text,
  output_quality integer,
  prompt_strength double precision,
  hf_loras text[],
  lora_scales double precision[],
  disable_safety_checker boolean,
  reference_image_id uuid,
  reference_image_strength double precision,
  model_version text,
  generation_time double precision,
  status text,
  error_message text,
  raw_parameters jsonb,
  parameter_history jsonb[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  started_at timestamp with time zone,
  completed_at timestamp with time zone
);

create table if not exists public.credit_transactions (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references auth.users on delete cascade,
  amount integer not null,
  type text not null,
  description text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.subscription_history (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references auth.users on delete cascade,
  tier text not null,
  status text not null,
  start_date timestamp without time zone not null,
  end_date timestamp without time zone,
  payment_method text,
  amount numeric,
  currency text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.ad_views (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references auth.users on delete cascade,
  ad_id text not null,
  view_duration integer not null,
  completed boolean default false,
  credits_earned integer default 0,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Profiles table with updated structure
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  is_admin boolean default false,
  is_banned boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_sign_in_at timestamp with time zone,
  full_name text,
  phone_number text,
  avatar_url text,
  auth_provider text,
  provider_id text,
  subscription_tier text default 'free',
  subscription_status text default 'inactive',
  subscription_end_date timestamp without time zone,
  stripe_customer_id text unique,
  credits_balance integer default 0,
  lifetime_credits integer default 0,
  last_credit_update timestamp without time zone,
  language text default 'Français',
  theme text default 'light',
  notifications_enabled boolean default true,
  marketing_emails_enabled boolean default true,
  ads_enabled boolean default true,
  ads_credits_earned integer default 0,
  ads_watched_today integer default 0,
  ads_last_watched timestamp without time zone,
  daily_ads_limit integer default 5,
  google_id text,
  apple_id text,
  github_id text,
  email_verified boolean default false,
  phone_verified boolean default false,
  needs_attention boolean default false,
  constraint profiles_email_check check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes
create index if not exists profiles_email_idx on profiles(email);
create index if not exists profiles_stripe_customer_id_idx on profiles(stripe_customer_id);
create index if not exists profiles_subscription_status_idx on profiles(subscription_status);
create index if not exists profiles_credits_balance_idx on profiles(credits_balance);

-- Auth functions
create or replace function public.check_email_status(check_email text)
returns table (
  exists_in_auth boolean,
  is_banned boolean
)
language sql
security definer
set search_path = public
as $$
  select 
    exists(select 1 from auth.users where email = check_email) as exists_in_auth,
    exists(
      select 1 
      from public.banned_users 
      where email = check_email
      union
      select 1 
      from public.banned_emails 
      where email = check_email
    ) as is_banned;
$$;

create or replace function public.check_admin_status(user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
    and is_admin = true
  );
$$;

-- Profile creation trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    created_at,
    last_sign_in_at,
    avatar_url,
    auth_provider,
    subscription_tier,
    subscription_status,
    credits_balance,
    lifetime_credits,
    language,
    theme,
    ads_enabled,
    ads_credits_earned,
    ads_watched_today,
    daily_ads_limit
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.created_at,
    new.last_sign_in_at,
    new.raw_user_meta_data->>'avatar_url',
    new.raw_app_meta_data->>'provider',
    'free',
    'inactive',
    0,
    0,
    'Français',
    'light',
    true,
    0,
    0,
    5
  );
  return new;
end;
$$;

-- Drop and recreate trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Ad views reset function
create or replace function reset_daily_ad_views()
returns void as $$
begin
  update profiles
  set ads_watched_today = 0
  where ads_watched_today > 0;
end;
$$ language plpgsql security definer;

-- Create cron job to reset daily ad views
select cron.schedule(
  'reset-daily-ad-views',
  '0 0 * * *',  -- At midnight every day
  $$
    select reset_daily_ad_views();
  $$
);

-- Enable RLS on all tables
alter table public.banned_users enable row level security;
alter table public.banned_emails enable row level security;
alter table public.active_reference_images enable row level security;
alter table public.reference_images enable row level security;
alter table public.generated_images enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.subscription_history enable row level security;
alter table public.ad_views enable row level security;
alter table public.profiles enable row level security;

-- Create indexes for banned tables
create index if not exists banned_users_email_idx on banned_users(email);
create index if not exists banned_emails_email_idx on banned_emails(email);

-- RLS Policies for core tables
-- RLS Policies for ban management
create policy "Admin users can manage banned users"
  on public.banned_users for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Admin users can manage banned emails"
  on public.banned_emails for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Users can read their own active reference images" on public.active_reference_images for select using (auth.uid() = user_id);
create policy "Users can insert their own active reference images" on public.active_reference_images for insert with check (auth.uid() = user_id);
create policy "Users can delete their own active reference images" on public.active_reference_images for delete using (auth.uid() = user_id);

create policy "Users can read their own reference images" on public.reference_images for select using (auth.uid() = user_id);
create policy "Users can insert their own reference images" on public.reference_images for insert with check (auth.uid() = user_id);
create policy "Users can delete their own reference images" on public.reference_images for delete using (auth.uid() = user_id);

create policy "Users can read their own generated images" on public.generated_images for select using (auth.uid() = user_id);
create policy "Users can insert their own generated images" on public.generated_images for insert with check (auth.uid() = user_id);

create policy "Users can read their own credit transactions" on public.credit_transactions for select using (auth.uid() = profile_id);
create policy "Users can read their own subscription history" on public.subscription_history for select using (auth.uid() = profile_id);
create policy "Users can read their own ad views" on public.ad_views for select using (auth.uid() = profile_id);

-- Updated RLS Policies for profiles
create policy "Enable all access for authenticated users"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Enable public profile creation"
  on public.profiles for insert
  with check (true);

create policy "Public can read minimal profile data"
  on public.profiles for select
  using (true);

-- Add instance_id to refresh_tokens if it doesn't exist
do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'auth'
    and table_name = 'refresh_tokens'
    and column_name = 'instance_id'
  ) then
    alter table auth.refresh_tokens add column instance_id uuid;
  end if;
end $$;

-- Create index on instance_id
create index if not exists refresh_tokens_instance_id_idx on auth.refresh_tokens(instance_id);

-- Permissions
grant usage on schema public to anon, authenticated;
grant usage on schema auth to anon, authenticated;
grant select on auth.users to anon, authenticated;
grant select, delete on auth.refresh_tokens to authenticated;
grant all on public.profiles to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
grant usage on all sequences in schema public to authenticated;
revoke insert, update, delete on all tables in schema public from anon;

-- Function permissions
grant execute on function public.check_email_status(text) to anon, authenticated;
grant execute on function public.check_admin_status(uuid) to anon, authenticated;
grant execute on function public.handle_new_user() to postgres;

-- Create admin user if not exists
do $$
begin
  if not exists (
    select 1 from auth.users
    where email = 'admin@serendippo.me'
  ) then
    insert into auth.users (
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data
    )
    values (
      'admin@serendippo.me',
      crypt('admin123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"full_name": "Admin"}'::jsonb
    );
  end if;
end $$;

-- Set admin flag for admin user
update public.profiles
set is_admin = true
where email = 'admin@serendippo.me';
