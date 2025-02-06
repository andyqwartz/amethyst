he-- Drop and recreate check_email_status function with proper security
drop function if exists public.check_email_status(check_email text);

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

-- Drop and recreate check_admin_status function with proper security
drop function if exists public.check_admin_status(user_id uuid);

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

-- Grant execute permissions to anon and authenticated roles
grant execute on function public.check_email_status(text) to anon, authenticated;
grant execute on function public.check_admin_status(uuid) to anon, authenticated;

-- Ensure public can access auth functions
alter function public.check_email_status(text) set search_path = public;
alter function public.check_admin_status(uuid) set search_path = public;
