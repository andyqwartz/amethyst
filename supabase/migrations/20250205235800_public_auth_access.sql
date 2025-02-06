purpose-- Enable public access to auth
alter table auth.users enable row level security;

-- Allow public to read auth users (needed for email checks)
create policy "Allow public read access to auth users"
  on auth.users for select
  using (true);

-- Allow public to create profiles
create policy "Allow public profile creation"
  on public.profiles for insert
  with check (true);

-- Grant public access to auth schema
grant usage on schema auth to anon;
grant select on auth.users to anon;

-- Grant public access to profiles
grant usage on schema public to anon;
grant insert on public.profiles to anon;

-- Ensure trigger has proper permissions
alter function public.handle_new_user() owner to postgres;
grant execute on function public.handle_new_user() to postgres;
