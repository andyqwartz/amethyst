-- Fonction pour récupérer le profil utilisateur
create or replace function get_user_profile(user_id uuid)
returns table (
  full_name text,
  avatar_url text,
  credits integer,
  subscription_tier text,
  total_generations integer,
  updated_at timestamp with time zone,
  language text,
  notifications_enabled boolean,
  newsletter_subscribed boolean,
  role text
)
language plpgsql
security definer
as $$
declare
  profile_exists boolean;
begin
  -- Vérifier si le profil existe
  select exists(select 1 from profiles where id = user_id) into profile_exists;
  
  -- Si le profil n'existe pas, le créer avec des valeurs par défaut
  if not profile_exists then
    insert into profiles (
      id,
      role,
      credits,
      total_generations,
      subscription_tier,
      language,
      notifications_enabled,
      newsletter_subscribed,
      created_at,
      updated_at
    ) values (
      user_id,
      'user',
      100,
      0,
      'free',
      'Français',
      false,
      false,
      now(),
      now()
    );
  end if;

  -- Retourner le profil (qu'il soit nouveau ou existant)
  return query
  select
    p.full_name,
    p.avatar_url,
    p.credits,
    p.subscription_tier,
    p.total_generations,
    p.updated_at,
    p.language,
    p.notifications_enabled,
    p.newsletter_subscribed,
    p.role
  from profiles p
  where p.id = user_id;
end;
$$;

-- Accorder les permissions nécessaires
grant execute on function get_user_profile(uuid) to authenticated; 