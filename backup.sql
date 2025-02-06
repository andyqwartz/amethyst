PGDMP     &    ;                }            postgres    15.8    15.10 (Homebrew)     D           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            E           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            F           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            G           1262    5    postgres    DATABASE     t   CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';
    DROP DATABASE postgres;
                postgres    false            H           0    0    DATABASE postgres    COMMENT     N   COMMENT ON DATABASE postgres IS 'default administrative connection database';
                   postgres    false    4935            I           0    0    postgres    DATABASE PROPERTIES     >   ALTER DATABASE postgres SET "app.settings.jwt_exp" TO '3600';
                     postgres    false                        2615    16488    auth    SCHEMA        CREATE SCHEMA auth;
    DROP SCHEMA auth;
                supabase_admin    false            3            2615    16388 
   extensions    SCHEMA        CREATE SCHEMA extensions;
    DROP SCHEMA extensions;
                postgres    false            &            2615    16618    graphql    SCHEMA        CREATE SCHEMA graphql;
    DROP SCHEMA graphql;
                supabase_admin    false            %            2615    16607    graphql_public    SCHEMA        CREATE SCHEMA graphql_public;
    DROP SCHEMA graphql_public;
                supabase_admin    false                        2615    16386 	   pgbouncer    SCHEMA        CREATE SCHEMA pgbouncer;
    DROP SCHEMA pgbouncer;
             	   pgbouncer    false                         2615    16645    pgsodium    SCHEMA        CREATE SCHEMA pgsodium;
    DROP SCHEMA pgsodium;
                supabase_admin    false                        3079    16646    pgsodium 	   EXTENSION     >   CREATE EXTENSION IF NOT EXISTS pgsodium WITH SCHEMA pgsodium;
    DROP EXTENSION pgsodium;
                   false    32            J           0    0    EXTENSION pgsodium    COMMENT     \   COMMENT ON EXTENSION pgsodium IS 'Pgsodium is a modern cryptography library for Postgres.';
                        false    2                        2615    16599    realtime    SCHEMA        CREATE SCHEMA realtime;
    DROP SCHEMA realtime;
                supabase_admin    false                        2615    16536    storage    SCHEMA        CREATE SCHEMA storage;
    DROP SCHEMA storage;
                supabase_admin    false                        2615    47178    supabase_migrations    SCHEMA     #   CREATE SCHEMA supabase_migrations;
 !   DROP SCHEMA supabase_migrations;
                postgres    false            #            2615    16949    vault    SCHEMA        CREATE SCHEMA vault;
    DROP SCHEMA vault;
                supabase_admin    false                        3079    16982 
   pg_graphql 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;
    DROP EXTENSION pg_graphql;
                   false    38            K           0    0    EXTENSION pg_graphql    COMMENT     B   COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';
                        false    4                        3079    16389    pg_stat_statements 	   EXTENSION     J   CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;
 #   DROP EXTENSION pg_stat_statements;
                   false    51            L           0    0    EXTENSION pg_stat_statements    COMMENT     u   COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';
                        false    8            	            3079    41879    pg_trgm 	   EXTENSION     ;   CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;
    DROP EXTENSION pg_trgm;
                   false            M           0    0    EXTENSION pg_trgm    COMMENT     e   COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';
                        false    9                        3079    16434    pgcrypto 	   EXTENSION     @   CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
    DROP EXTENSION pgcrypto;
                   false    51            N           0    0    EXTENSION pgcrypto    COMMENT     <   COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
                        false    6                        3079    16471    pgjwt 	   EXTENSION     =   CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;
    DROP EXTENSION pgjwt;
                   false    6    51            O           0    0    EXTENSION pgjwt    COMMENT     C   COMMENT ON EXTENSION pgjwt IS 'JSON Web Token API for Postgresql';
                        false    5                        3079    16950    supabase_vault 	   EXTENSION     A   CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;
    DROP EXTENSION supabase_vault;
                   false    35    2            P           0    0    EXTENSION supabase_vault    COMMENT     C   COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';
                        false    3                        3079    16423 	   uuid-ossp 	   EXTENSION     C   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
    DROP EXTENSION "uuid-ossp";
                   false    51            Q           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                        false    7            
            3079    41316    vector 	   EXTENSION     :   CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;
    DROP EXTENSION vector;
                   false            R           0    0    EXTENSION vector    COMMENT     W   COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';
                        false    10            �           1247    59195 	   aal_level    TYPE     K   CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);
    DROP TYPE auth.aal_level;
       auth          postgres    false    24            6           1247    28865    code_challenge_method    TYPE     L   CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);
 &   DROP TYPE auth.code_challenge_method;
       auth          supabase_auth_admin    false    24            $           1247    28718    factor_status    TYPE     M   CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);
    DROP TYPE auth.factor_status;
       auth          supabase_auth_admin    false    24            !           1247    28712    factor_type    TYPE     R   CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);
    DROP TYPE auth.factor_type;
       auth          supabase_auth_admin    false    24            9           1247    28907    one_time_token_type    TYPE     �   CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);
 $   DROP TYPE auth.one_time_token_type;
       auth          supabase_auth_admin    false    24            	           1247    54671    generation_status    TYPE     q   CREATE TYPE public.generation_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed'
);
 $   DROP TYPE public.generation_status;
       public          postgres    false            �           1247    41645    image_status    TYPE     l   CREATE TYPE public.image_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed'
);
    DROP TYPE public.image_status;
       public          postgres    false                       1247    54680    processing_status    TYPE     q   CREATE TYPE public.processing_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed'
);
 $   DROP TYPE public.processing_status;
       public          postgres    false            o           1247    29078    action    TYPE     o   CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);
    DROP TYPE realtime.action;
       realtime          supabase_admin    false    31            H           1247    29039    equality_op    TYPE     v   CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);
     DROP TYPE realtime.equality_op;
       realtime          supabase_admin    false    31            K           1247    29053    user_defined_filter    TYPE     j   CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);
 (   DROP TYPE realtime.user_defined_filter;
       realtime          supabase_admin    false    31    1608            u           1247    29120 
   wal_column    TYPE     �   CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);
    DROP TYPE realtime.wal_column;
       realtime          supabase_admin    false    31            r           1247    29091    wal_rls    TYPE     s   CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);
    DROP TYPE realtime.wal_rls;
       realtime          supabase_admin    false    31            �           1255    61618    check_auth_email()    FUNCTION     D  CREATE FUNCTION auth.check_auth_email() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.banned_users 
        WHERE email = NEW.email
    ) THEN
        RAISE EXCEPTION 'Email is banned';
    END IF;
    RETURN NEW;
END;
$$;
 '   DROP FUNCTION auth.check_auth_email();
       auth          postgres    false    24            �           1255    58808    check_banned_email(text)    FUNCTION     +  CREATE FUNCTION auth.check_banned_email(check_email text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  return exists (
    select 1 from public.banned_emails where email = check_email
    union
    select 1 from public.banned_users where email = check_email
  );
end;
$$;
 9   DROP FUNCTION auth.check_banned_email(check_email text);
       auth          postgres    false    24            �           1255    55952    check_role_exists()    FUNCTION        CREATE FUNCTION auth.check_role_exists() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    raise exception 'role ''anon'' does not exist';
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    raise exception 'role ''authenticated'' does not exist';
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    raise exception 'role ''service_role'' does not exist';
  end if;
end;
$$;
 (   DROP FUNCTION auth.check_role_exists();
       auth          postgres    false    24            �           1255    55783    check_user_role()    FUNCTION     �   CREATE FUNCTION auth.check_user_role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
      current_setting('request.jwt.claim.role', true),
      'anon'
    )::text
$$;
 &   DROP FUNCTION auth.check_user_role();
       auth          postgres    false    24            �           1255    54296    create_profile_on_signup()    FUNCTION     _  CREATE FUNCTION auth.create_profile_on_signup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  insert into public.profiles (id, email, full_name, created_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.created_at
  );
  return new;
end;
$$;
 /   DROP FUNCTION auth.create_profile_on_signup();
       auth          postgres    false    24            �           1255    16534    email()    FUNCTION     	  CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
    SELECT 
        COALESCE(
            current_setting('request.jwt.claim.email', true),
            (current_setting('request.jwt.claims', true)::jsonb ->> 'email')
        )::text
$$;
    DROP FUNCTION auth.email();
       auth          supabase_auth_admin    false    24            S           0    0    FUNCTION email()    COMMENT     X   COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';
          auth          supabase_auth_admin    false    714            �           1255    54295    email_matches_user()    FUNCTION     �   CREATE FUNCTION auth.email_matches_user() RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  return exists(
    select 1 from auth.users
    where email = current_setting('request.jwt.claims', true)::json->>'email'
  );
end;
$$;
 )   DROP FUNCTION auth.email_matches_user();
       auth          postgres    false    24            �           1255    58809    handle_new_user()    FUNCTION     n  CREATE FUNCTION auth.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'auth'
    AS $$
declare
  default_role text := 'authenticated';
  default_language text := 'Français';
  default_theme text := 'light';
begin
  -- Check if email is banned
  if auth.check_banned_email(new.email) then
    raise exception 'Email address is banned';
  end if;

  -- Create profile
  insert into public.profiles (
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
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', null),
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

  return new;
end;
$$;
 &   DROP FUNCTION auth.handle_new_user();
       auth          postgres    false    24            �           1255    55456    handle_user_registration()    FUNCTION       CREATE FUNCTION auth.handle_user_registration() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;
 /   DROP FUNCTION auth.handle_user_registration();
       auth          postgres    false    24            �           1255    28694    jwt()    FUNCTION     �   CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true), '')::jsonb;
$$;
    DROP FUNCTION auth.jwt();
       auth          supabase_auth_admin    false    24            �           1255    16533    role()    FUNCTION     �   CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.role', true), '')::text;
$$;
    DROP FUNCTION auth.role();
       auth          supabase_auth_admin    false    24            T           0    0    FUNCTION role()    COMMENT     V   COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';
          auth          supabase_auth_admin    false    405            �           1255    16532    uid()    FUNCTION     �   CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;
    DROP FUNCTION auth.uid();
       auth          supabase_auth_admin    false    24            U           0    0    FUNCTION uid()    COMMENT     T   COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';
          auth          supabase_auth_admin    false    708            �           1255    61485    update_timestamps()    FUNCTION     �   CREATE FUNCTION auth.update_timestamps() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;
 (   DROP FUNCTION auth.update_timestamps();
       auth          postgres    false    24            �           1255    61168     verify_user_password(text, text)    FUNCTION     �  CREATE FUNCTION auth.verify_user_password(email text, password text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'auth', 'public'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE 
      users.email = verify_user_password.email
      AND users.encrypted_password = crypt(verify_user_password.password, users.encrypted_password)
      AND users.deleted_at IS NULL
  );
END;
$$;
 D   DROP FUNCTION auth.verify_user_password(email text, password text);
       auth          postgres    false    24            �           1255    58891     verify_user_password(uuid, text)    FUNCTION     �  CREATE FUNCTION auth.verify_user_password(user_id uuid, password text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'auth', 'public'
    AS $$
declare
  _user auth.users;
begin
  select * into _user
  from auth.users
  where id = user_id;
  
  if _user.encrypted_password = crypt(password, _user.encrypted_password) then
    return true;
  else
    return false;
  end if;
end;
$$;
 F   DROP FUNCTION auth.verify_user_password(user_id uuid, password text);
       auth          postgres    false    24            �           1255    16591    grant_pg_cron_access()    FUNCTION     �  CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;
 1   DROP FUNCTION extensions.grant_pg_cron_access();
    
   extensions          postgres    false    51            V           0    0    FUNCTION grant_pg_cron_access()    COMMENT     U   COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';
       
   extensions          postgres    false    645            �           1255    16612    grant_pg_graphql_access()    FUNCTION     i	  CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;
 4   DROP FUNCTION extensions.grant_pg_graphql_access();
    
   extensions          supabase_admin    false    51            W           0    0 "   FUNCTION grant_pg_graphql_access()    COMMENT     [   COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';
       
   extensions          supabase_admin    false    403            x           1255    16593    grant_pg_net_access()    FUNCTION     �  CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
    ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

    ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
    ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

    REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
    REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

    GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
  END IF;
END;
$$;
 0   DROP FUNCTION extensions.grant_pg_net_access();
    
   extensions          postgres    false    51            X           0    0    FUNCTION grant_pg_net_access()    COMMENT     S   COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';
       
   extensions          postgres    false    632            w           1255    16603    pgrst_ddl_watch()    FUNCTION     >  CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;
 ,   DROP FUNCTION extensions.pgrst_ddl_watch();
    
   extensions          supabase_admin    false    51            �           1255    16604    pgrst_drop_watch()    FUNCTION       CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;
 -   DROP FUNCTION extensions.pgrst_drop_watch();
    
   extensions          supabase_admin    false    51            y           1255    16614    set_graphql_placeholder()    FUNCTION     r  CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;
 4   DROP FUNCTION extensions.set_graphql_placeholder();
    
   extensions          supabase_admin    false    51            Y           0    0 "   FUNCTION set_graphql_placeholder()    COMMENT     |   COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';
       
   extensions          supabase_admin    false    633            e           1255    16387    get_auth(text)    FUNCTION     J  CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RAISE WARNING 'PgBouncer auth request: %', p_usename;

    RETURN QUERY
    SELECT usename::TEXT, passwd::TEXT FROM pg_catalog.pg_shadow
    WHERE usename = p_usename;
END;
$$;
 2   DROP FUNCTION pgbouncer.get_auth(p_usename text);
    	   pgbouncer          postgres    false    16            �           1255    54297 &   add_credits(uuid, integer, text, text)    FUNCTION     i  CREATE FUNCTION public.add_credits(p_user_id uuid, p_amount integer, p_type text, p_description text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  -- Update user's credit balance
  update profiles
  set 
    credits_balance = credits_balance + p_amount,
    lifetime_credits = lifetime_credits + p_amount,
    last_credit_update = now()
  where id = p_user_id;

  -- Record the transaction
  insert into credit_transactions (
    profile_id,
    amount,
    type,
    description,
    created_at
  ) values (
    p_user_id,
    p_amount,
    p_type,
    p_description,
    now()
  );
end;
$$;
 e   DROP FUNCTION public.add_credits(p_user_id uuid, p_amount integer, p_type text, p_description text);
       public          postgres    false            �           1255    44287 .   award_ad_credits(uuid, text, integer, boolean)    FUNCTION       CREATE FUNCTION public.award_ad_credits(profile_id uuid, ad_id text, view_duration integer, completed boolean) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
    credits_to_award integer;
BEGIN
    -- Calcul des crédits en fonction du type de visionnage
    credits_to_award := CASE
        WHEN completed THEN 10  -- Visionnage complet
        WHEN view_duration >= 15 THEN 5  -- Au moins 15 secondes
        ELSE 0
    END;

    -- Enregistrer la vue
    INSERT INTO ad_views (
        profile_id, ad_id, view_duration, completed, credits_earned
    ) VALUES (
        profile_id, ad_id, view_duration, completed, credits_to_award
    );

    -- Si des crédits sont gagnés, les ajouter
    IF credits_to_award > 0 THEN
        -- Enregistrer la source
        INSERT INTO credit_sources (
            profile_id, type, amount, metadata
        ) VALUES (
            profile_id,
            'ad_view',
            credits_to_award,
            jsonb_build_object('ad_id', ad_id, 'duration', view_duration)
        );

        -- Mettre à jour le solde
        PERFORM update_credits_balance(
            profile_id,
            credits_to_award,
            'reward',
            'Crédits gagnés via publicité'
        );
    END IF;
END;
$$;
 n   DROP FUNCTION public.award_ad_credits(profile_id uuid, ad_id text, view_duration integer, completed boolean);
       public          postgres    false            �           1255    60274    check_admin_status(uuid)    FUNCTION     '  CREATE FUNCTION public.check_admin_status(user_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = user_id
        AND is_admin = true
    );
END;
$$;
 7   DROP FUNCTION public.check_admin_status(user_id uuid);
       public          postgres    false            �           1255    54023 %   check_and_reset_daily_ad_limits(uuid)    FUNCTION     >  CREATE FUNCTION public.check_and_reset_daily_ad_limits(user_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    last_watch_date date;
BEGIN
    -- Get the date of last ad watch
    SELECT (ads_last_watched AT TIME ZONE 'UTC')::date INTO last_watch_date
    FROM profiles
    WHERE id = user_id;

    -- If last watch was on a different day or null, reset the counter
    IF last_watch_date IS NULL OR last_watch_date < CURRENT_DATE THEN
        UPDATE profiles
        SET ads_watched_today = 0
        WHERE id = user_id;
    END IF;
END;
$$;
 D   DROP FUNCTION public.check_and_reset_daily_ad_limits(user_id uuid);
       public          postgres    false            �           1255    44289 "   check_daily_ad_credits_limit(uuid)    FUNCTION     �  CREATE FUNCTION public.check_daily_ad_credits_limit(profile_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $_$
DECLARE
    daily_credits integer;
    max_daily_credits integer := 50; -- Limite quotidienne
BEGIN
    SELECT COALESCE(SUM(credits_earned), 0)
    INTO daily_credits
    FROM ad_views
    WHERE profile_id = $1
    AND created_at >= CURRENT_DATE;

    RETURN daily_credits < max_daily_credits;
END;
$_$;
 D   DROP FUNCTION public.check_daily_ad_credits_limit(profile_id uuid);
       public          postgres    false            �           1255    61574    check_email_status(text)    FUNCTION     �  CREATE FUNCTION public.check_email_status(check_email text) RETURNS TABLE(exists_in_auth boolean, is_banned boolean)
    LANGUAGE sql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
    SELECT 
        EXISTS (SELECT 1 FROM auth.users WHERE email = check_email) as exists_in_auth,
        EXISTS (SELECT 1 FROM public.banned_users WHERE email = check_email) as is_banned;
$$;
 ;   DROP FUNCTION public.check_email_status(check_email text);
       public          postgres    false            �           1255    44213    check_expired_subscriptions()    FUNCTION     N  CREATE FUNCTION public.check_expired_subscriptions() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
    UPDATE profiles
    SET subscription_status = 'expired',
        subscription_tier = 'free'
    WHERE subscription_end_date < now()
    AND subscription_tier != 'free';
END;
$$;
 4   DROP FUNCTION public.check_expired_subscriptions();
       public          postgres    false            �           1255    53866    check_profile_update()    FUNCTION     d  CREATE FUNCTION public.check_profile_update() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
declare
  allowed_fields text[] := array[
    'full_name',
    'avatar_url',
    'theme',
    'notifications_enabled',
    'marketing_emails_enabled',
    'ads_enabled'
  ];
  field text;
  exists_check boolean;
begin
  -- Allow service role to update anything
  if current_setting('request.jwt.claims', true)::json->>'role' = 'service_role' then
    return new;
  end if;

  -- Check each column in the table
  for field in (select column_name::text from information_schema.columns where table_name = 'profiles')
  loop
    -- Skip allowed fields
    if field = any(allowed_fields) then
      continue;
    end if;

    -- For all other fields, ensure they haven't changed
    if field != 'updated_at' and new.id = old.id then
      execute format('select $1.%I is distinct from $2.%I', field, field)
        using new, old
        into strict exists_check;
      
      if exists_check then
        raise exception 'Cannot modify field: %', field;
      end if;
    end if;
  end loop;

  return new;
end;
$_$;
 -   DROP FUNCTION public.check_profile_update();
       public          postgres    false            �           1255    45485    create_profile_for_user()    FUNCTION     �  CREATE FUNCTION public.create_profile_for_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        created_at,
        last_sign_in_at,
        credits_balance,
        subscription_tier,
        subscription_status,
        auth_provider,
        language,
        is_admin
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.created_at,
        NEW.last_sign_in_at,
        100,
        'free',
        'active',
        COALESCE(NEW.app_metadata->>'provider', 'email'),
        'fr',
        COALESCE((NEW.raw_user_meta_data->>'is_admin')::boolean, false)
    );
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Erreur dans create_profile_for_user: %', SQLERRM;
    RETURN NEW;
END;
$$;
 0   DROP FUNCTION public.create_profile_for_user();
       public          postgres    false            �           1255    44391    daily_maintenance()    FUNCTION     �  CREATE FUNCTION public.daily_maintenance() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
    -- Réinitialiser les compteurs de pubs
    PERFORM reset_daily_ads();
    
    -- Vérifier les abonnements
    PERFORM check_expired_subscriptions();
    
    -- Nettoyer les vieux tokens
    DELETE FROM oauth_tokens 
    WHERE expires_at < now();
    
    -- Attribuer les bonus quotidiens
    UPDATE profiles 
    SET credits_balance = credits_balance + 
        CASE subscription_tier
            WHEN 'premium' THEN 20
            ELSE 5
        END
    WHERE last_sign_in_at > CURRENT_DATE - interval '1 day';
END;
$$;
 *   DROP FUNCTION public.daily_maintenance();
       public          postgres    false            �           1255    44009    get_user_profile(uuid)    FUNCTION        CREATE FUNCTION public.get_user_profile(user_id uuid) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
    user_profile json;
BEGIN
    SELECT json_build_object(
        'id', p.id,
        'email', p.email,
        'is_admin', p.is_admin,
        'is_banned', p.is_banned,
        'created_at', p.created_at,
        'last_sign_in_at', p.last_sign_in_at
    ) INTO user_profile
    FROM profiles p
    WHERE p.id = user_id;

    RETURN user_profile;
END;
$$;
 5   DROP FUNCTION public.get_user_profile(user_id uuid);
       public          postgres    false            �           1255    41832    handle_new_user()    FUNCTION     `  CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'auth'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$;
 (   DROP FUNCTION public.handle_new_user();
       public          postgres    false            �           1255    51528    handle_user_sign_in()    FUNCTION     �   CREATE FUNCTION public.handle_user_sign_in() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE public.profiles
  SET last_sign_in_at = CURRENT_TIMESTAMP
  WHERE id = auth.uid();
  RETURN NEW;
END;
$$;
 ,   DROP FUNCTION public.handle_user_sign_in();
       public          postgres    false            �           1255    45584    log_prompt()    FUNCTION     C  CREATE FUNCTION public.log_prompt() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  RAISE LOG 'New prompt: %', NEW.prompt;
  RAISE LOG 'Parameters: ratio=%, strength=%, steps=%, guidance=%, outputs=%',
    NEW.aspect_ratio, NEW.prompt_strength, NEW.steps, NEW.guidance_scale, NEW.num_outputs;
  RETURN NEW;
END;
$$;
 #   DROP FUNCTION public.log_prompt();
       public          postgres    false            �           1255    52063    prevent_last_admin_removal()    FUNCTION     ]  CREATE FUNCTION public.prevent_last_admin_removal() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
    IF (TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND NEW.is_admin = false)) AND OLD.is_admin = true THEN
        IF NOT EXISTS (
            SELECT 1 
            FROM profiles 
            WHERE is_admin = true 
            AND id != OLD.id
        ) THEN
            RAISE EXCEPTION 'Cannot remove the last admin user';
        END IF;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$;
 3   DROP FUNCTION public.prevent_last_admin_removal();
       public          postgres    false            �           1255    44288 .   purchase_credits(uuid, integer, text, numeric)    FUNCTION     �  CREATE FUNCTION public.purchase_credits(profile_id uuid, amount integer, stripe_payment_id text, price_paid numeric) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
    -- Enregistrer la source
    INSERT INTO credit_sources (
        profile_id, type, amount, metadata
    ) VALUES (
        profile_id,
        'stripe_purchase',
        amount,
        jsonb_build_object(
            'stripe_payment_id', stripe_payment_id,
            'price_paid', price_paid
        )
    );

    -- Ajouter les crédits
    PERFORM update_credits_balance(
        profile_id,
        amount,
        'purchase',
        'Achat de crédits via Stripe'
    );
END;
$$;
 t   DROP FUNCTION public.purchase_credits(profile_id uuid, amount integer, stripe_payment_id text, price_paid numeric);
       public          postgres    false            �           1255    51801 <   record_ad_view(uuid, text, integer, boolean, integer, jsonb)    FUNCTION     �  CREATE FUNCTION public.record_ad_view(p_profile_id uuid, p_ad_id text, p_view_duration integer, p_completed boolean, p_credits_earned integer, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_ad_view_id uuid;
    v_daily_limit integer;
    v_ads_watched integer;
BEGIN
    -- Check and reset daily limits if needed
    PERFORM public.check_and_reset_daily_ad_limits(p_profile_id);

    -- Get daily limit and ads watched after potential reset
    SELECT 
        daily_ads_limit,
        ads_watched_today
    INTO
        v_daily_limit,
        v_ads_watched
    FROM profiles
    WHERE id = p_profile_id;

    -- Check daily limit
    IF v_ads_watched >= v_daily_limit THEN
        RAISE EXCEPTION 'Daily ad limit reached';
    END IF;

    -- Record ad view
    INSERT INTO ad_views (
        profile_id,
        ad_id,
        view_duration,
        completed,
        credits_earned,
        metadata
    )
    VALUES (
        p_profile_id,
        p_ad_id,
        p_view_duration,
        p_completed,
        p_credits_earned,
        p_metadata
    )
    RETURNING id INTO v_ad_view_id;

    -- Update profile
    UPDATE profiles
    SET 
        ads_watched_today = ads_watched_today + 1,
        ads_credits_earned = ads_credits_earned + p_credits_earned,
        ads_last_watched = now()
    WHERE id = p_profile_id;

    -- Add credits if view was completed
    IF p_completed THEN
        PERFORM public.record_credit_transaction(
            p_profile_id,
            p_credits_earned,
            'ad_reward',
            'Credits earned from watching ad',
            jsonb_build_object('ad_id', p_ad_id)
        );
    END IF;

    RETURN v_ad_view_id;
END;
$$;
 �   DROP FUNCTION public.record_ad_view(p_profile_id uuid, p_ad_id text, p_view_duration integer, p_completed boolean, p_credits_earned integer, p_metadata jsonb);
       public          postgres    false            �           1255    51800 ;   record_credit_transaction(uuid, integer, text, text, jsonb)    FUNCTION     �  CREATE FUNCTION public.record_credit_transaction(p_profile_id uuid, p_amount integer, p_type text, p_description text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_transaction_id uuid;
    v_current_balance integer;
BEGIN
    -- Get current balance
    SELECT credits_balance INTO v_current_balance
    FROM profiles
    WHERE id = p_profile_id;

    -- Check if balance would go negative
    IF v_current_balance + p_amount < 0 THEN
        RAISE EXCEPTION 'Insufficient credits';
    END IF;

    -- Update profile balance
    UPDATE profiles
    SET 
        credits_balance = credits_balance + p_amount,
        lifetime_credits = CASE 
            WHEN p_amount > 0 THEN lifetime_credits + p_amount
            ELSE lifetime_credits
        END,
        last_credit_update = now()
    WHERE id = p_profile_id;

    -- Record transaction
    INSERT INTO credit_transactions (
        profile_id,
        amount,
        type,
        description,
        metadata
    )
    VALUES (
        p_profile_id,
        p_amount,
        p_type,
        p_description,
        p_metadata
    )
    RETURNING id INTO v_transaction_id;

    RETURN v_transaction_id;
END;
$$;
 �   DROP FUNCTION public.record_credit_transaction(p_profile_id uuid, p_amount integer, p_type text, p_description text, p_metadata jsonb);
       public          postgres    false            �           1255    54298    reset_daily_ad_views()    FUNCTION     �   CREATE FUNCTION public.reset_daily_ad_views() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  update profiles
  set ads_watched_today = 0
  where ads_watched_today > 0;
end;
$$;
 -   DROP FUNCTION public.reset_daily_ad_views();
       public          postgres    false            �           1255    44390    reset_daily_ads()    FUNCTION     �   CREATE FUNCTION public.reset_daily_ads() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
    UPDATE profiles 
    SET ads_watched_today = 0 
    WHERE DATE(ads_last_watched) < CURRENT_DATE;
END;
$$;
 (   DROP FUNCTION public.reset_daily_ads();
       public          postgres    false            �           1255    44211 1   update_credits_balance(uuid, integer, text, text)    FUNCTION     5  CREATE FUNCTION public.update_credits_balance(profile_id uuid, amount integer, type text, description text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $_$
BEGIN
    INSERT INTO credits_transactions (profile_id, amount, type, description)
    VALUES ($1, $2, $3, $4);

    UPDATE profiles 
    SET credits_balance = credits_balance + $2,
        lifetime_credits = CASE WHEN $2 > 0 THEN lifetime_credits + $2 ELSE lifetime_credits END,
        last_credit_update = now()
    WHERE id = $1;
END;
$_$;
 k   DROP FUNCTION public.update_credits_balance(profile_id uuid, amount integer, type text, description text);
       public          postgres    false            �           1255    44078    update_profile_on_sign_in()    FUNCTION     G  CREATE FUNCTION public.update_profile_on_sign_in() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
    UPDATE public.profiles
    SET last_sign_in_at = NEW.last_sign_in_at,
        email = COALESCE(NEW.email, profiles.email)
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$;
 2   DROP FUNCTION public.update_profile_on_sign_in();
       public          postgres    false            �           1255    41821    update_reference_image_usage()    FUNCTION       CREATE FUNCTION public.update_reference_image_usage() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    update reference_images
    set 
        last_used_at = now(),
        usage_count = usage_count + 1
    where id = new.id;
    return new;
end;
$$;
 5   DROP FUNCTION public.update_reference_image_usage();
       public          postgres    false            �           1255    44212 B   update_subscription(uuid, text, text, timestamp without time zone)    FUNCTION     �  CREATE FUNCTION public.update_subscription(profile_id uuid, tier text, status text, end_date timestamp without time zone DEFAULT NULL::timestamp without time zone) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $_$
BEGIN
    INSERT INTO subscription_history (
        profile_id, tier, status, start_date, end_date
    )
    VALUES ($1, $2, $3, now(), $4);

    UPDATE profiles 
    SET subscription_tier = $2,
        subscription_status = $3,
        subscription_end_date = COALESCE($4, 
            CASE WHEN $2 = 'free' THEN NULL 
            ELSE now() + interval '1 month'
            END
        )
    WHERE id = $1;
END;
$_$;
 y   DROP FUNCTION public.update_subscription(profile_id uuid, tier text, status text, end_date timestamp without time zone);
       public          postgres    false            �           1255    41819    update_updated_at_column()    FUNCTION     �   CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    new.updated_at = now();
    return new;
end;
$$;
 1   DROP FUNCTION public.update_updated_at_column();
       public          postgres    false            �           1255    41823    update_user_stats()    FUNCTION     �   CREATE FUNCTION public.update_user_stats() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    update profiles
    set total_generations = total_generations + 1
    where id = new.user_id;
    return new;
end;
$$;
 *   DROP FUNCTION public.update_user_stats();
       public          postgres    false            �           1255    44389 #   watch_ad(uuid, text, integer, text)    FUNCTION     {  CREATE FUNCTION public.watch_ad(profile_id uuid, ad_id text, duration integer, platform text DEFAULT 'web'::text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
    credits_to_earn integer := 5; -- Crédits de base par pub
    user_limit integer;
BEGIN
    -- Récupérer la limite quotidienne de l'utilisateur
    SELECT daily_ads_limit INTO user_limit
    FROM profiles
    WHERE id = profile_id;

    -- Vérifier la limite quotidienne
    IF (SELECT ads_watched_today FROM profiles WHERE id = profile_id) >= user_limit THEN
        RETURN false;
    END IF;

    -- Bonus pour longue durée de visionnage
    IF duration >= 30 THEN
        credits_to_earn := credits_to_earn + 2;
    END IF;

    -- Enregistrer le visionnage
    INSERT INTO ads_history (
        profile_id,
        ad_id,
        credits_earned,
        watched_duration,
        completed,
        platform
    )
    VALUES (
        profile_id,
        ad_id,
        credits_to_earn,
        duration,
        duration >= 30,
        platform
    );

    -- Mettre à jour le profil
    UPDATE profiles 
    SET credits_balance = credits_balance + credits_to_earn,
        ads_credits_earned = ads_credits_earned + credits_to_earn,
        ads_watched_today = ads_watched_today + 1,
        ads_last_watched = now()
    WHERE id = profile_id;

    RETURN true;
END;
$$;
 ]   DROP FUNCTION public.watch_ad(profile_id uuid, ad_id text, duration integer, platform text);
       public          postgres    false                       1255    29113    apply_rls(jsonb, integer)    FUNCTION     �(  CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;
 G   DROP FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer);
       realtime          supabase_admin    false    31    1650                       1255    29191 E   broadcast_changes(text, text, text, text, text, record, record, text)    FUNCTION       CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;
 �   DROP FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text);
       realtime          supabase_admin    false    31                       1255    29125 C   build_prepared_statement_sql(text, regclass, realtime.wal_column[])    FUNCTION     �  CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;
 �   DROP FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]);
       realtime          supabase_admin    false    1653    31                        1255    29075    cast(text, regtype)    FUNCTION       CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;
 8   DROP FUNCTION realtime."cast"(val text, type_ regtype);
       realtime          supabase_admin    false    31            	           1255    29070 <   check_equality_op(realtime.equality_op, regtype, text, text)    FUNCTION     U  CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;
 j   DROP FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text);
       realtime          supabase_admin    false    1608    31                       1255    29121 Q   is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[])    FUNCTION     �  CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;
 z   DROP FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]);
       realtime          supabase_admin    false    1653    1611    31                       1255    29132 *   list_changes(name, name, integer, integer)    FUNCTION     �  CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;
 v   DROP FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer);
       realtime          supabase_admin    false    1650    31                       1255    29069    quote_wal2json(regclass)    FUNCTION     �  CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;
 8   DROP FUNCTION realtime.quote_wal2json(entity regclass);
       realtime          supabase_admin    false    31                       1255    29190     send(jsonb, text, text, boolean)    FUNCTION       CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      PERFORM pg_notify(
          'realtime:system',
          jsonb_build_object(
              'error', SQLERRM,
              'function', 'realtime.send',
              'event', event,
              'topic', topic,
              'private', private
          )::text
      );
  END;
END;
$$;
 U   DROP FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean);
       realtime          supabase_admin    false    31            
           1255    29067    subscription_check_filters()    FUNCTION     <
  CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;
 5   DROP FUNCTION realtime.subscription_check_filters();
       realtime          supabase_admin    false    31                       1255    29102    to_regrole(text)    FUNCTION     �   CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;
 3   DROP FUNCTION realtime.to_regrole(role_name text);
       realtime          supabase_admin    false    31                       1255    29184    topic()    FUNCTION     �   CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;
     DROP FUNCTION realtime.topic();
       realtime          supabase_realtime_admin    false    31            �           1255    28972 *   can_insert_object(text, text, uuid, jsonb)    FUNCTION     �  CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;
 _   DROP FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb);
       storage          supabase_storage_admin    false    25            �           1255    28946    extension(text)    FUNCTION     Z  CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;
 ,   DROP FUNCTION storage.extension(name text);
       storage          supabase_storage_admin    false    25            �           1255    28945    filename(text)    FUNCTION     �   CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;
 +   DROP FUNCTION storage.filename(name text);
       storage          supabase_storage_admin    false    25            �           1255    28944    foldername(text)    FUNCTION     �   CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;
 -   DROP FUNCTION storage.foldername(name text);
       storage          supabase_storage_admin    false    25            �           1255    28958    get_size_by_bucket()    FUNCTION        CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;
 ,   DROP FUNCTION storage.get_size_by_bucket();
       storage          supabase_storage_admin    false    25                       1255    29011 L   list_multipart_uploads_with_delimiter(text, text, text, integer, text, text)    FUNCTION     9  CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;
 �   DROP FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text);
       storage          supabase_storage_admin    false    25                       1255    28974 B   list_objects_with_delimiter(text, text, text, integer, text, text)    FUNCTION     �  CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;
 �   DROP FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text);
       storage          supabase_storage_admin    false    25                       1255    29027    operation()    FUNCTION     �   CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;
 #   DROP FUNCTION storage.operation();
       storage          supabase_storage_admin    false    25                       1255    28961 ?   search(text, text, integer, integer, integer, text, text, text)    FUNCTION       CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(objects.path_tokens, 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;
 �   DROP FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text);
       storage          supabase_storage_admin    false    25            �           1255    28962    update_updated_at_column()    FUNCTION     �   CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;
 2   DROP FUNCTION storage.update_updated_at_column();
       storage          supabase_storage_admin    false    25            V           1255    16974    secrets_encrypt_secret_secret()    FUNCTION     (  CREATE FUNCTION vault.secrets_encrypt_secret_secret() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
		BEGIN
		        new.secret = CASE WHEN new.secret IS NULL THEN NULL ELSE
			CASE WHEN new.key_id IS NULL THEN NULL ELSE pg_catalog.encode(
			  pgsodium.crypto_aead_det_encrypt(
				pg_catalog.convert_to(new.secret, 'utf8'),
				pg_catalog.convert_to((new.id::text || new.description::text || new.created_at::text || new.updated_at::text)::text, 'utf8'),
				new.key_id::uuid,
				new.nonce
			  ),
				'base64') END END;
		RETURN new;
		END;
		$$;
 5   DROP FUNCTION vault.secrets_encrypt_secret_secret();
       vault          supabase_admin    false    35                       1259    16519    audit_log_entries    TABLE     �   CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);
 #   DROP TABLE auth.audit_log_entries;
       auth         heap    postgres    false    24            Z           0    0    TABLE audit_log_entries    COMMENT     R   COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';
          auth          postgres    false    282            7           1259    28869 
   flow_state    TABLE     �  CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);
    DROP TABLE auth.flow_state;
       auth         heap    postgres    false    1590    24            [           0    0    TABLE flow_state    COMMENT     G   COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';
          auth          postgres    false    311            /           1259    28666 
   identities    TABLE     �  CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);
    DROP TABLE auth.identities;
       auth         heap    postgres    false    24            \           0    0    TABLE identities    COMMENT     U   COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';
          auth          postgres    false    303            ]           0    0    COLUMN identities.email    COMMENT     �   COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';
          auth          postgres    false    303            b           1259    59230 	   instances    TABLE     �   CREATE TABLE auth.instances (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
    DROP TABLE auth.instances;
       auth         heap    postgres    false    7    51    24            2           1259    28756    mfa_amr_claims    TABLE     �   CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);
     DROP TABLE auth.mfa_amr_claims;
       auth         heap    supabase_auth_admin    false    24            ^           0    0    TABLE mfa_amr_claims    COMMENT     ~   COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';
          auth          supabase_auth_admin    false    306            1           1259    28744    mfa_challenges    TABLE       CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);
     DROP TABLE auth.mfa_challenges;
       auth         heap    postgres    false    24            _           0    0    TABLE mfa_challenges    COMMENT     _   COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';
          auth          postgres    false    305            0           1259    28731    mfa_factors    TABLE     �  CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);
    DROP TABLE auth.mfa_factors;
       auth         heap    postgres    false    1572    1569    24            `           0    0    TABLE mfa_factors    COMMENT     L   COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';
          auth          postgres    false    304            8           1259    28919    one_time_tokens    TABLE     �  CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);
 !   DROP TABLE auth.one_time_tokens;
       auth         heap    supabase_auth_admin    false    24    1593            a           1259    59214    refresh_tokens    TABLE     �   CREATE TABLE auth.refresh_tokens (
    id bigint NOT NULL,
    token text NOT NULL,
    user_id uuid,
    revoked boolean,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    parent text
);
     DROP TABLE auth.refresh_tokens;
       auth         heap    postgres    false    24            5           1259    28798    saml_providers    TABLE     H  CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);
     DROP TABLE auth.saml_providers;
       auth         heap    supabase_auth_admin    false    24            a           0    0    TABLE saml_providers    COMMENT     ]   COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';
          auth          supabase_auth_admin    false    309            6           1259    28816    saml_relay_states    TABLE     `  CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);
 #   DROP TABLE auth.saml_relay_states;
       auth         heap    supabase_auth_admin    false    24            b           0    0    TABLE saml_relay_states    COMMENT     �   COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';
          auth          supabase_auth_admin    false    310                       1259    16527    schema_migrations    TABLE     U   CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);
 #   DROP TABLE auth.schema_migrations;
       auth         heap    postgres    false    24            c           0    0    TABLE schema_migrations    COMMENT     X   COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';
          auth          postgres    false    283            c           1259    59240    sessions    TABLE       CREATE TABLE auth.sessions (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    factor_id uuid,
    aal auth.aal_level
);
    DROP TABLE auth.sessions;
       auth         heap    postgres    false    7    51    1521    24            4           1259    28783    sso_domains    TABLE       CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);
    DROP TABLE auth.sso_domains;
       auth         heap    supabase_auth_admin    false    24            d           0    0    TABLE sso_domains    COMMENT     t   COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';
          auth          supabase_auth_admin    false    308            3           1259    28774    sso_providers    TABLE       CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);
    DROP TABLE auth.sso_providers;
       auth         heap    supabase_auth_admin    false    24            e           0    0    TABLE sso_providers    COMMENT     x   COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';
          auth          supabase_auth_admin    false    307            f           0    0     COLUMN sso_providers.resource_id    COMMENT     �   COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';
          auth          supabase_auth_admin    false    307            d           1259    61660    users    TABLE     �  CREATE TABLE auth.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    instance_id uuid,
    email character varying NOT NULL,
    encrypted_password character varying NOT NULL,
    email_confirmed_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb DEFAULT '{}'::jsonb,
    raw_user_meta_data jsonb DEFAULT '{}'::jsonb,
    is_super_admin boolean DEFAULT false,
    role character varying DEFAULT 'authenticated'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    phone text,
    phone_confirmed_at timestamp with time zone,
    confirmation_token text,
    confirmation_sent_at timestamp with time zone,
    recovery_token text,
    recovery_sent_at timestamp with time zone,
    email_change_token text,
    email_change text,
    email_change_sent_at timestamp with time zone,
    last_sign_in_ip text,
    is_sso_user boolean DEFAULT false,
    deleted_at timestamp with time zone,
    banned_until timestamp with time zone,
    reauthentication_token text,
    reauthentication_sent_at timestamp with time zone
);
    DROP TABLE auth.users;
       auth         heap    postgres    false    24            C           1259    32697    Amethyst    TABLE     {   CREATE TABLE public."Amethyst" (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
    DROP TABLE public."Amethyst";
       public         heap    postgres    false            D           1259    32700    Amethyst_id_seq    SEQUENCE     �   ALTER TABLE public."Amethyst" ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."Amethyst_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    323            I           1259    41746    reference_images    TABLE     
  CREATE TABLE public.reference_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    image_id uuid,
    original_filename text,
    purpose text DEFAULT 'reference'::text,
    preprocessing_applied jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_used_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    usage_count integer DEFAULT 0,
    public_url text,
    width integer,
    height integer
);
 $   DROP TABLE public.reference_images;
       public         heap    postgres    false            `           1259    54301    active_reference_images    VIEW     <  CREATE VIEW public.active_reference_images AS
 SELECT reference_images.id,
    reference_images.user_id,
    reference_images.image_id,
    reference_images.original_filename,
    reference_images.purpose,
    reference_images.preprocessing_applied,
    reference_images.created_at,
    reference_images.last_used_at,
    reference_images.usage_count,
    reference_images.public_url,
    reference_images.width,
    reference_images.height
   FROM public.reference_images
  WHERE (reference_images.last_used_at IS NOT NULL)
  ORDER BY reference_images.last_used_at DESC;
 *   DROP VIEW public.active_reference_images;
       public          postgres    false    329    329    329    329    329    329    329    329    329    329    329    329            Q           1259    44271    ad_views    TABLE     ?  CREATE TABLE public.ad_views (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    profile_id uuid,
    ad_id text NOT NULL,
    view_duration integer,
    completed boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    credits_earned integer DEFAULT 0,
    metadata jsonb
);
    DROP TABLE public.ad_views;
       public         heap    postgres    false    7    51            R           1259    44362    ads_history    TABLE     �  CREATE TABLE public.ads_history (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    profile_id uuid,
    ad_id text NOT NULL,
    credits_earned integer NOT NULL,
    watched_at timestamp without time zone DEFAULT now(),
    watched_duration integer,
    completed boolean DEFAULT false,
    platform text,
    metadata jsonb,
    CONSTRAINT valid_platform CHECK ((platform = ANY (ARRAY['web'::text, 'mobile'::text, 'desktop'::text])))
);
    DROP TABLE public.ads_history;
       public         heap    postgres    false    7    51            _           1259    53992    banned_emails    TABLE     �   CREATE TABLE public.banned_emails (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    reason text,
    banned_at timestamp with time zone DEFAULT now(),
    banned_by uuid
);
 !   DROP TABLE public.banned_emails;
       public         heap    postgres    false            ^           1259    53963    banned_users    TABLE     @  CREATE TABLE public.banned_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    reason text,
    banned_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    banned_by uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
     DROP TABLE public.banned_users;
       public         heap    postgres    false            K           1259    41785    collection_images    TABLE     �   CREATE TABLE public.collection_images (
    collection_id uuid NOT NULL,
    image_id uuid NOT NULL,
    added_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
 %   DROP TABLE public.collection_images;
       public         heap    postgres    false            P           1259    44256    credit_sources    TABLE     �  CREATE TABLE public.credit_sources (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    profile_id uuid,
    type text NOT NULL,
    amount integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    expires_at timestamp without time zone,
    metadata jsonb,
    CONSTRAINT valid_credit_source_type CHECK ((type = ANY (ARRAY['ad_view'::text, 'ad_click'::text, 'stripe_purchase'::text, 'reward'::text])))
);
 "   DROP TABLE public.credit_sources;
       public         heap    postgres    false    7    51            \           1259    51778    credit_transactions    TABLE     �  CREATE TABLE public.credit_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    profile_id uuid,
    amount integer NOT NULL,
    type text NOT NULL,
    description text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT credit_transactions_type_check CHECK ((type = ANY (ARRAY['purchase'::text, 'ad_reward'::text, 'generation'::text, 'refund'::text])))
);
 '   DROP TABLE public.credit_transactions;
       public         heap    postgres    false            N           1259    44175    credits_transactions    TABLE     �  CREATE TABLE public.credits_transactions (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    profile_id uuid,
    amount integer NOT NULL,
    type text NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    metadata jsonb,
    CONSTRAINT valid_transaction_type CHECK ((type = ANY (ARRAY['purchase'::text, 'reward'::text, 'usage'::text, 'refund'::text])))
);
 (   DROP TABLE public.credits_transactions;
       public         heap    postgres    false    7    51            H           1259    41702    generated_images    TABLE     �  CREATE TABLE public.generated_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    image_id uuid,
    prompt text NOT NULL,
    negative_prompt text DEFAULT ''::text,
    width integer DEFAULT 512 NOT NULL,
    height integer DEFAULT 512 NOT NULL,
    num_inference_steps integer DEFAULT 20 NOT NULL,
    guidance_scale double precision DEFAULT 7.5 NOT NULL,
    seed bigint,
    scheduler text DEFAULT 'DPMSolverMultistep'::text,
    strength double precision DEFAULT 1.0,
    num_outputs integer DEFAULT 1,
    aspect_ratio text DEFAULT '1:1'::text,
    output_format text DEFAULT 'png'::text NOT NULL,
    output_quality integer DEFAULT 100,
    prompt_strength double precision DEFAULT 0.8,
    hf_loras text[] DEFAULT ARRAY[]::text[],
    lora_scales double precision[] DEFAULT ARRAY[]::double precision[],
    disable_safety_checker boolean DEFAULT false,
    reference_image_id uuid,
    reference_image_strength double precision DEFAULT 0.75,
    model_version text DEFAULT 'SDXL 1.0'::text,
    generation_time double precision,
    status public.image_status DEFAULT 'pending'::public.image_status,
    error_message text,
    raw_parameters jsonb DEFAULT '{}'::jsonb,
    parameter_history jsonb[] DEFAULT ARRAY[]::jsonb[],
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    started_at timestamp with time zone,
    completed_at timestamp with time zone
);
 $   DROP TABLE public.generated_images;
       public         heap    postgres    false    1419    1419            J           1259    41769    image_collections    TABLE     m  CREATE TABLE public.image_collections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    name text NOT NULL,
    description text,
    is_public boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
 %   DROP TABLE public.image_collections;
       public         heap    postgres    false            G           1259    41685    image_metadata    TABLE     e  CREATE TABLE public.image_metadata (
    image_id uuid NOT NULL,
    vision_labels jsonb DEFAULT '{}'::jsonb,
    vision_objects jsonb DEFAULT '{}'::jsonb,
    vision_text text,
    vision_colors jsonb DEFAULT '{}'::jsonb,
    embedding public.vector(512),
    style_embedding public.vector(256),
    content_embedding public.vector(256),
    confidence_score double precision,
    nsfw_score double precision,
    processing_status public.image_status DEFAULT 'pending'::public.image_status,
    processed_at timestamp with time zone,
    error_message text,
    raw_analysis_result jsonb DEFAULT '{}'::jsonb
);
 "   DROP TABLE public.image_metadata;
       public         heap    postgres    false    1419    10    10    10    10    10    10    1419    10    10    10    10    10    10    10    10    10    10    10    10            F           1259    41672    images    TABLE     �  CREATE TABLE public.images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    hash text NOT NULL,
    storage_path text NOT NULL,
    public_url text,
    width integer NOT NULL,
    height integer NOT NULL,
    format text NOT NULL,
    file_size_bytes bigint NOT NULL,
    is_nsfw boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb
);
    DROP TABLE public.images;
       public         heap    postgres    false            S           1259    44378    oauth_tokens    TABLE     2  CREATE TABLE public.oauth_tokens (
    profile_id uuid,
    provider text NOT NULL,
    access_token text,
    refresh_token text,
    expires_at timestamp without time zone,
    scope text[],
    CONSTRAINT valid_provider CHECK ((provider = ANY (ARRAY['google'::text, 'apple'::text, 'github'::text])))
);
     DROP TABLE public.oauth_tokens;
       public         heap    postgres    false            M           1259    44060    profiles    TABLE       CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text,
    is_admin boolean DEFAULT false,
    is_banned boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_sign_in_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name text,
    phone_number text,
    avatar_url text,
    auth_provider text,
    provider_id text,
    subscription_tier text DEFAULT 'free'::text,
    subscription_status text DEFAULT 'active'::text,
    subscription_end_date timestamp without time zone,
    stripe_customer_id text,
    credits_balance integer DEFAULT 0,
    lifetime_credits integer DEFAULT 0,
    last_credit_update timestamp without time zone DEFAULT now(),
    language text DEFAULT 'fr'::text,
    theme text DEFAULT 'light'::text,
    notifications_enabled boolean DEFAULT true,
    marketing_emails_enabled boolean DEFAULT true,
    ads_enabled boolean DEFAULT true,
    ads_credits_earned integer DEFAULT 0,
    ads_watched_today integer DEFAULT 0,
    ads_last_watched timestamp without time zone,
    daily_ads_limit integer DEFAULT 10,
    google_id text,
    apple_id text,
    github_id text,
    email_verified boolean DEFAULT false,
    phone_verified boolean DEFAULT false,
    needs_attention boolean DEFAULT false,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT ads_credits_earned_non_negative CHECK ((ads_credits_earned >= 0)),
    CONSTRAINT ads_watched_today_non_negative CHECK ((ads_watched_today >= 0)),
    CONSTRAINT credits_balance_non_negative CHECK ((credits_balance >= 0)),
    CONSTRAINT daily_ads_limit_positive CHECK ((daily_ads_limit > 0)),
    CONSTRAINT lifetime_credits_non_negative CHECK ((lifetime_credits >= 0))
);
    DROP TABLE public.profiles;
       public         heap    postgres    false            T           1259    45550    prompts    TABLE     �  CREATE TABLE public.prompts (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid,
    prompt text NOT NULL,
    negative_prompt text DEFAULT ''::text,
    aspect_ratio text DEFAULT '1:1'::text NOT NULL,
    prompt_strength double precision DEFAULT 0.8 NOT NULL,
    steps integer DEFAULT 28 NOT NULL,
    guidance_scale double precision DEFAULT 7.5 NOT NULL,
    num_outputs integer DEFAULT 1 NOT NULL,
    seed integer DEFAULT '-1'::integer NOT NULL,
    output_format text DEFAULT 'webp'::text NOT NULL,
    output_quality integer DEFAULT 90 NOT NULL,
    safety_checker boolean DEFAULT true NOT NULL,
    hf_loras text[] DEFAULT ARRAY['AndyVampiro/fog'::text] NOT NULL,
    lora_scales double precision[] DEFAULT ARRAY[1.0] NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT guidance_scale_range CHECK (((guidance_scale >= (1.0)::double precision) AND (guidance_scale <= (20.0)::double precision))),
    CONSTRAINT num_outputs_range CHECK (((num_outputs >= 1) AND (num_outputs <= 4))),
    CONSTRAINT output_quality_range CHECK (((output_quality >= 1) AND (output_quality <= 100))),
    CONSTRAINT prompt_strength_range CHECK (((prompt_strength >= (0.1)::double precision) AND (prompt_strength <= (1.0)::double precision))),
    CONSTRAINT steps_range CHECK (((steps >= 1) AND (steps <= 100))),
    CONSTRAINT valid_aspect_ratio CHECK ((aspect_ratio = ANY (ARRAY['1:1'::text, '16:9'::text])))
);
    DROP TABLE public.prompts;
       public         heap    postgres    false    7    51            ]           1259    53955    public_profiles    VIEW        CREATE VIEW public.public_profiles AS
 SELECT profiles.id,
    profiles.full_name,
    profiles.avatar_url,
    profiles.created_at,
    profiles.is_banned,
    profiles.subscription_tier,
    profiles.language,
    profiles.theme
   FROM public.profiles;
 "   DROP VIEW public.public_profiles;
       public          postgres    false    333    333    333    333    333    333    333    333            O           1259    44190    subscription_history    TABLE     ]  CREATE TABLE public.subscription_history (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    profile_id uuid,
    tier text NOT NULL,
    status text NOT NULL,
    start_date timestamp without time zone DEFAULT now(),
    end_date timestamp without time zone,
    payment_method text,
    amount numeric,
    currency text DEFAULT 'EUR'::text,
    metadata jsonb,
    CONSTRAINT valid_subscription_status CHECK ((status = ANY (ARRAY['active'::text, 'cancelled'::text, 'expired'::text]))),
    CONSTRAINT valid_subscription_tier CHECK ((tier = ANY (ARRAY['free'::text, 'premium'::text])))
);
 (   DROP TABLE public.subscription_history;
       public         heap    postgres    false    7    51            L           1259    41814    user_generation_stats    VIEW     �  CREATE VIEW public.user_generation_stats AS
 SELECT generated_images.user_id,
    count(*) AS total_generations,
    count(DISTINCT date_trunc('day'::text, generated_images.created_at)) AS active_days,
    avg(generated_images.generation_time) AS avg_generation_time,
    count(
        CASE
            WHEN (generated_images.status = 'completed'::public.image_status) THEN 1
            ELSE NULL::integer
        END) AS successful_generations,
    count(
        CASE
            WHEN (generated_images.status = 'failed'::public.image_status) THEN 1
            ELSE NULL::integer
        END) AS failed_generations
   FROM public.generated_images
  GROUP BY generated_images.user_id;
 (   DROP VIEW public.user_generation_stats;
       public          postgres    false    328    328    328    1419    328            A           1259    29194    messages    TABLE     w  CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);
    DROP TABLE realtime.messages;
       realtime            supabase_realtime_admin    false    31            B           1259    31581    messages_2025_02_02    TABLE     a  CREATE TABLE realtime.messages_2025_02_02 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);
 )   DROP TABLE realtime.messages_2025_02_02;
       realtime         heap    supabase_admin    false    321    31            E           1259    32729    messages_2025_02_03    TABLE     a  CREATE TABLE realtime.messages_2025_02_03 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);
 )   DROP TABLE realtime.messages_2025_02_03;
       realtime         heap    supabase_admin    false    321    31            W           1259    49708    messages_2025_02_04    TABLE     a  CREATE TABLE realtime.messages_2025_02_04 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);
 )   DROP TABLE realtime.messages_2025_02_04;
       realtime         heap    supabase_admin    false    31    321            X           1259    49719    messages_2025_02_05    TABLE     a  CREATE TABLE realtime.messages_2025_02_05 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);
 )   DROP TABLE realtime.messages_2025_02_05;
       realtime         heap    supabase_admin    false    321    31            Y           1259    49730    messages_2025_02_06    TABLE     a  CREATE TABLE realtime.messages_2025_02_06 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);
 )   DROP TABLE realtime.messages_2025_02_06;
       realtime         heap    supabase_admin    false    31    321            Z           1259    49741    messages_2025_02_07    TABLE     a  CREATE TABLE realtime.messages_2025_02_07 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);
 )   DROP TABLE realtime.messages_2025_02_07;
       realtime         heap    supabase_admin    false    321    31            [           1259    49752    messages_2025_02_08    TABLE     a  CREATE TABLE realtime.messages_2025_02_08 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);
 )   DROP TABLE realtime.messages_2025_02_08;
       realtime         heap    supabase_admin    false    321    31            ;           1259    29033    schema_migrations    TABLE     y   CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);
 '   DROP TABLE realtime.schema_migrations;
       realtime         heap    supabase_admin    false    31            >           1259    29055    subscription    TABLE     �  CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
 "   DROP TABLE realtime.subscription;
       realtime         heap    supabase_admin    false    1611    773    31    1611            =           1259    29054    subscription_id_seq    SEQUENCE     �   ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            realtime          supabase_admin    false    318    31                       1259    16540    buckets    TABLE     k  CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text
);
    DROP TABLE storage.buckets;
       storage         heap    supabase_storage_admin    false    25            g           0    0    COLUMN buckets.owner    COMMENT     X   COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';
          storage          supabase_storage_admin    false    284                       1259    16582 
   migrations    TABLE     �   CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE storage.migrations;
       storage         heap    supabase_storage_admin    false    25                       1259    16555    objects    TABLE     �  CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);
    DROP TABLE storage.objects;
       storage         heap    supabase_storage_admin    false    25            h           0    0    COLUMN objects.owner    COMMENT     X   COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';
          storage          supabase_storage_admin    false    285            9           1259    28976    s3_multipart_uploads    TABLE     j  CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);
 )   DROP TABLE storage.s3_multipart_uploads;
       storage         heap    supabase_storage_admin    false    25            :           1259    28990    s3_multipart_uploads_parts    TABLE     �  CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
 /   DROP TABLE storage.s3_multipart_uploads_parts;
       storage         heap    supabase_storage_admin    false    25            U           1259    47179    schema_migrations    TABLE     x   CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);
 2   DROP TABLE supabase_migrations.schema_migrations;
       supabase_migrations         heap    postgres    false    29            V           1259    47186 
   seed_files    TABLE     `   CREATE TABLE supabase_migrations.seed_files (
    path text NOT NULL,
    hash text NOT NULL
);
 +   DROP TABLE supabase_migrations.seed_files;
       supabase_migrations         heap    postgres    false    29            -           1259    16970    decrypted_secrets    VIEW     �  CREATE VIEW vault.decrypted_secrets AS
 SELECT secrets.id,
    secrets.name,
    secrets.description,
    secrets.secret,
        CASE
            WHEN (secrets.secret IS NULL) THEN NULL::text
            ELSE
            CASE
                WHEN (secrets.key_id IS NULL) THEN NULL::text
                ELSE convert_from(pgsodium.crypto_aead_det_decrypt(decode(secrets.secret, 'base64'::text), convert_to(((((secrets.id)::text || secrets.description) || (secrets.created_at)::text) || (secrets.updated_at)::text), 'utf8'::name), secrets.key_id, secrets.nonce), 'utf8'::name)
            END
        END AS decrypted_secret,
    secrets.key_id,
    secrets.nonce,
    secrets.created_at,
    secrets.updated_at
   FROM vault.secrets;
 #   DROP VIEW vault.decrypted_secrets;
       vault          supabase_admin    false    3    2    2    2    32    32    2    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    32    2    32    32    2    32    2    2    2    32    32    2    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    32    2    32    32    2    32    2    32    2    32    35    3    2    2    2    32    32    2    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    32    2    32    32    2    32    2    2    2    32    32    2    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    32    2    32    32    2    32    2    32    2    32    35    3    2    2    2    32    32    2    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    32    2    32    32    2    32    2    2    2    32    32    2    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    32    2    32    32    2    32    2    32    2    32    35    2    32    3    2    2    2    32    32    2    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    32    2    32    32    2    32    2    2    2    32    32    2    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    32    2    32    32    2    32    2    32    2    32    35    3    2    2    2    32    32    2    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    32    2    32    32    2    32    2    2    2    32    32    2    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    32    2    32    32    2    32    2    32    2    32    35    3    2    2    2    32    32    2    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    32    2    32    32    2    32    2    2    2    32    32    2    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    32    2    32    32    2    32    2    32    2    32    35    3    2    2    2    32    32    2    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    32    2    32    32    2    32    2    2    2    32    32    2    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    32    2    32    32    2    32    2    32    2    32    35    3    2    2    2    32    32    2    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    32    2    32    32    2    32    2    2    2    32    32    2    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    2    32    32    2    32    2    32    2    32    2    32    32    2    32    2    32    2    32    35    35            b           0    0    messages_2025_02_02    TABLE ATTACH     �   ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_02_02 FOR VALUES FROM ('2025-02-02 00:00:00') TO ('2025-02-03 00:00:00');
          realtime          supabase_admin    false    322    321            c           0    0    messages_2025_02_03    TABLE ATTACH     �   ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_02_03 FOR VALUES FROM ('2025-02-03 00:00:00') TO ('2025-02-04 00:00:00');
          realtime          supabase_admin    false    325    321            d           0    0    messages_2025_02_04    TABLE ATTACH     �   ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_02_04 FOR VALUES FROM ('2025-02-04 00:00:00') TO ('2025-02-05 00:00:00');
          realtime          supabase_admin    false    343    321            e           0    0    messages_2025_02_05    TABLE ATTACH     �   ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_02_05 FOR VALUES FROM ('2025-02-05 00:00:00') TO ('2025-02-06 00:00:00');
          realtime          supabase_admin    false    344    321            f           0    0    messages_2025_02_06    TABLE ATTACH     �   ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_02_06 FOR VALUES FROM ('2025-02-06 00:00:00') TO ('2025-02-07 00:00:00');
          realtime          supabase_admin    false    345    321            g           0    0    messages_2025_02_07    TABLE ATTACH     �   ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_02_07 FOR VALUES FROM ('2025-02-07 00:00:00') TO ('2025-02-08 00:00:00');
          realtime          supabase_admin    false    346    321            h           0    0    messages_2025_02_08    TABLE ATTACH     �   ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_02_08 FOR VALUES FROM ('2025-02-08 00:00:00') TO ('2025-02-09 00:00:00');
          realtime          supabase_admin    false    347    321                      0    16519    audit_log_entries 
   TABLE DATA           [   COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
    auth          postgres    false    282   ң                0    28869 
   flow_state 
   TABLE DATA           �   COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
    auth          postgres    false    311   /�                0    28666 
   identities 
   TABLE DATA           ~   COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
    auth          postgres    false    303   Q�      ?          0    59230 	   instances 
   TABLE DATA           T   COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
    auth          postgres    false    354   ��                0    28756    mfa_amr_claims 
   TABLE DATA           e   COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
    auth          supabase_auth_admin    false    306   ��                0    28744    mfa_challenges 
   TABLE DATA           |   COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
    auth          postgres    false    305   �                0    28731    mfa_factors 
   TABLE DATA           �   COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
    auth          postgres    false    304   !�                0    28919    one_time_tokens 
   TABLE DATA           p   COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
    auth          supabase_auth_admin    false    312   >�      >          0    59214    refresh_tokens 
   TABLE DATA           c   COPY auth.refresh_tokens (id, token, user_id, revoked, created_at, updated_at, parent) FROM stdin;
    auth          postgres    false    353   [�                0    28798    saml_providers 
   TABLE DATA           �   COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
    auth          supabase_auth_admin    false    309   x�                0    28816    saml_relay_states 
   TABLE DATA           �   COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
    auth          supabase_auth_admin    false    310   ��                0    16527    schema_migrations 
   TABLE DATA           2   COPY auth.schema_migrations (version) FROM stdin;
    auth          postgres    false    283   ��      @          0    59240    sessions 
   TABLE DATA           U   COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal) FROM stdin;
    auth          postgres    false    355   �                0    28783    sso_domains 
   TABLE DATA           X   COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
    auth          supabase_auth_admin    false    308   +�                0    28774    sso_providers 
   TABLE DATA           N   COPY auth.sso_providers (id, resource_id, created_at, updated_at) FROM stdin;
    auth          supabase_auth_admin    false    307   H�      A          0    61660    users 
   TABLE DATA           �  COPY auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role, created_at, updated_at, phone, phone_confirmed_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token, email_change, email_change_sent_at, last_sign_in_ip, is_sso_user, deleted_at, banned_until, reauthentication_token, reauthentication_sent_at) FROM stdin;
    auth          postgres    false    356   e�      _          0    16790    key 
   TABLE DATA           �   COPY pgsodium.key (id, status, created, expires, key_type, key_id, key_context, name, associated_data, raw_key, raw_key_nonce, parent_key, comment, user_data) FROM stdin;
    pgsodium          supabase_admin    false    294   U�      #          0    32697    Amethyst 
   TABLE DATA           4   COPY public."Amethyst" (id, created_at) FROM stdin;
    public          postgres    false    323   r�      0          0    44271    ad_views 
   TABLE DATA           y   COPY public.ad_views (id, profile_id, ad_id, view_duration, completed, created_at, credits_earned, metadata) FROM stdin;
    public          postgres    false    337   ��      1          0    44362    ads_history 
   TABLE DATA           �   COPY public.ads_history (id, profile_id, ad_id, credits_earned, watched_at, watched_duration, completed, platform, metadata) FROM stdin;
    public          postgres    false    338   2�      =          0    53992    banned_emails 
   TABLE DATA           P   COPY public.banned_emails (id, email, reason, banned_at, banned_by) FROM stdin;
    public          postgres    false    351   O�      <          0    53963    banned_users 
   TABLE DATA           [   COPY public.banned_users (id, email, reason, banned_at, banned_by, created_at) FROM stdin;
    public          postgres    false    350   l�      +          0    41785    collection_images 
   TABLE DATA           N   COPY public.collection_images (collection_id, image_id, added_at) FROM stdin;
    public          postgres    false    331   ��      /          0    44256    credit_sources 
   TABLE DATA           h   COPY public.credit_sources (id, profile_id, type, amount, created_at, expires_at, metadata) FROM stdin;
    public          postgres    false    336   ��      ;          0    51778    credit_transactions 
   TABLE DATA           n   COPY public.credit_transactions (id, profile_id, amount, type, description, metadata, created_at) FROM stdin;
    public          postgres    false    348   ��      -          0    44175    credits_transactions 
   TABLE DATA           o   COPY public.credits_transactions (id, profile_id, amount, type, description, created_at, metadata) FROM stdin;
    public          postgres    false    334   ��      (          0    41702    generated_images 
   TABLE DATA           �  COPY public.generated_images (id, user_id, image_id, prompt, negative_prompt, width, height, num_inference_steps, guidance_scale, seed, scheduler, strength, num_outputs, aspect_ratio, output_format, output_quality, prompt_strength, hf_loras, lora_scales, disable_safety_checker, reference_image_id, reference_image_strength, model_version, generation_time, status, error_message, raw_parameters, parameter_history, created_at, started_at, completed_at) FROM stdin;
    public          postgres    false    328   ��      *          0    41769    image_collections 
   TABLE DATA           n   COPY public.image_collections (id, user_id, name, description, is_public, created_at, updated_at) FROM stdin;
    public          postgres    false    330   �      '          0    41685    image_metadata 
   TABLE DATA           �   COPY public.image_metadata (image_id, vision_labels, vision_objects, vision_text, vision_colors, embedding, style_embedding, content_embedding, confidence_score, nsfw_score, processing_status, processed_at, error_message, raw_analysis_result) FROM stdin;
    public          postgres    false    327   7�      &          0    41672    images 
   TABLE DATA           �   COPY public.images (id, hash, storage_path, public_url, width, height, format, file_size_bytes, is_nsfw, created_at, metadata) FROM stdin;
    public          postgres    false    326   T�      2          0    44378    oauth_tokens 
   TABLE DATA           l   COPY public.oauth_tokens (profile_id, provider, access_token, refresh_token, expires_at, scope) FROM stdin;
    public          postgres    false    339   q�      ,          0    44060    profiles 
   TABLE DATA              COPY public.profiles (id, email, is_admin, is_banned, created_at, last_sign_in_at, full_name, phone_number, avatar_url, auth_provider, provider_id, subscription_tier, subscription_status, subscription_end_date, stripe_customer_id, credits_balance, lifetime_credits, last_credit_update, language, theme, notifications_enabled, marketing_emails_enabled, ads_enabled, ads_credits_earned, ads_watched_today, ads_last_watched, daily_ads_limit, google_id, apple_id, github_id, email_verified, phone_verified, needs_attention, updated_at) FROM stdin;
    public          postgres    false    333   ��      3          0    45550    prompts 
   TABLE DATA           �   COPY public.prompts (id, user_id, prompt, negative_prompt, aspect_ratio, prompt_strength, steps, guidance_scale, num_outputs, seed, output_format, output_quality, safety_checker, hf_loras, lora_scales, created_at) FROM stdin;
    public          postgres    false    340   I�      )          0    41746    reference_images 
   TABLE DATA           �   COPY public.reference_images (id, user_id, image_id, original_filename, purpose, preprocessing_applied, created_at, last_used_at, usage_count, public_url, width, height) FROM stdin;
    public          postgres    false    329   f�      .          0    44190    subscription_history 
   TABLE DATA           �   COPY public.subscription_history (id, profile_id, tier, status, start_date, end_date, payment_method, amount, currency, metadata) FROM stdin;
    public          postgres    false    335   ��      "          0    31581    messages_2025_02_02 
   TABLE DATA           w   COPY realtime.messages_2025_02_02 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
    realtime          supabase_admin    false    322   ��      %          0    32729    messages_2025_02_03 
   TABLE DATA           w   COPY realtime.messages_2025_02_03 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
    realtime          supabase_admin    false    325   ��      6          0    49708    messages_2025_02_04 
   TABLE DATA           w   COPY realtime.messages_2025_02_04 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
    realtime          supabase_admin    false    343   ��      7          0    49719    messages_2025_02_05 
   TABLE DATA           w   COPY realtime.messages_2025_02_05 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
    realtime          supabase_admin    false    344   ��      8          0    49730    messages_2025_02_06 
   TABLE DATA           w   COPY realtime.messages_2025_02_06 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
    realtime          supabase_admin    false    345   �      9          0    49741    messages_2025_02_07 
   TABLE DATA           w   COPY realtime.messages_2025_02_07 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
    realtime          supabase_admin    false    346   1�      :          0    49752    messages_2025_02_08 
   TABLE DATA           w   COPY realtime.messages_2025_02_08 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
    realtime          supabase_admin    false    347   N�                0    29033    schema_migrations 
   TABLE DATA           C   COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
    realtime          supabase_admin    false    315   k�      !          0    29055    subscription 
   TABLE DATA           b   COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
    realtime          supabase_admin    false    318   2�                0    16540    buckets 
   TABLE DATA           �   COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) FROM stdin;
    storage          supabase_storage_admin    false    284   O�                0    16582 
   migrations 
   TABLE DATA           B   COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
    storage          supabase_storage_admin    false    286   ��                0    16555    objects 
   TABLE DATA           �   COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
    storage          supabase_storage_admin    false    285   r�                0    28976    s3_multipart_uploads 
   TABLE DATA           �   COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
    storage          supabase_storage_admin    false    313   �                0    28990    s3_multipart_uploads_parts 
   TABLE DATA           �   COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
    storage          supabase_storage_admin    false    314   �      4          0    47179    schema_migrations 
   TABLE DATA           S   COPY supabase_migrations.schema_migrations (version, statements, name) FROM stdin;
    supabase_migrations          postgres    false    341   �      5          0    47186 
   seed_files 
   TABLE DATA           =   COPY supabase_migrations.seed_files (path, hash) FROM stdin;
    supabase_migrations          postgres    false    342   �      a          0    16951    secrets 
   TABLE DATA           f   COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
    vault          supabase_admin    false    300   �      i           0    0    key_key_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('pgsodium.key_key_id_seq', 1, false);
          pgsodium          supabase_admin    false    293            j           0    0    Amethyst_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Amethyst_id_seq"', 1, false);
          public          postgres    false    324            k           0    0    subscription_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);
          realtime          supabase_admin    false    317            i           2606    28769    mfa_amr_claims amr_id_pk 
   CONSTRAINT     T   ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);
 @   ALTER TABLE ONLY auth.mfa_amr_claims DROP CONSTRAINT amr_id_pk;
       auth            supabase_auth_admin    false    306            <           2606    16525 (   audit_log_entries audit_log_entries_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY auth.audit_log_entries DROP CONSTRAINT audit_log_entries_pkey;
       auth            postgres    false    282                       2606    28875    flow_state flow_state_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY auth.flow_state DROP CONSTRAINT flow_state_pkey;
       auth            postgres    false    311            Y           2606    28893    identities identities_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY auth.identities DROP CONSTRAINT identities_pkey;
       auth            postgres    false    303            [           2606    28903 1   identities identities_provider_id_provider_unique 
   CONSTRAINT     {   ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);
 Y   ALTER TABLE ONLY auth.identities DROP CONSTRAINT identities_provider_id_provider_unique;
       auth            postgres    false    303    303            	           2606    59239    instances instances_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY auth.instances DROP CONSTRAINT instances_pkey;
       auth            postgres    false    354            k           2606    28762 C   mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);
 k   ALTER TABLE ONLY auth.mfa_amr_claims DROP CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey;
       auth            supabase_auth_admin    false    306    306            g           2606    28750 "   mfa_challenges mfa_challenges_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY auth.mfa_challenges DROP CONSTRAINT mfa_challenges_pkey;
       auth            postgres    false    305            _           2606    28943 .   mfa_factors mfa_factors_last_challenged_at_key 
   CONSTRAINT     u   ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);
 V   ALTER TABLE ONLY auth.mfa_factors DROP CONSTRAINT mfa_factors_last_challenged_at_key;
       auth            postgres    false    304            a           2606    28737    mfa_factors mfa_factors_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY auth.mfa_factors DROP CONSTRAINT mfa_factors_pkey;
       auth            postgres    false    304            �           2606    28928 $   one_time_tokens one_time_tokens_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY auth.one_time_tokens DROP CONSTRAINT one_time_tokens_pkey;
       auth            supabase_auth_admin    false    312                       2606    59222 "   refresh_tokens refresh_tokens_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY auth.refresh_tokens DROP CONSTRAINT refresh_tokens_pkey;
       auth            postgres    false    353                       2606    59224 '   refresh_tokens refresh_tokens_token_key 
   CONSTRAINT     a   ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_key UNIQUE (token);
 O   ALTER TABLE ONLY auth.refresh_tokens DROP CONSTRAINT refresh_tokens_token_key;
       auth            postgres    false    353            t           2606    28809 +   saml_providers saml_providers_entity_id_key 
   CONSTRAINT     i   ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);
 S   ALTER TABLE ONLY auth.saml_providers DROP CONSTRAINT saml_providers_entity_id_key;
       auth            supabase_auth_admin    false    309            v           2606    28807 "   saml_providers saml_providers_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY auth.saml_providers DROP CONSTRAINT saml_providers_pkey;
       auth            supabase_auth_admin    false    309            {           2606    28823 (   saml_relay_states saml_relay_states_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY auth.saml_relay_states DROP CONSTRAINT saml_relay_states_pkey;
       auth            supabase_auth_admin    false    310            @           2606    16531 (   schema_migrations schema_migrations_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);
 P   ALTER TABLE ONLY auth.schema_migrations DROP CONSTRAINT schema_migrations_pkey;
       auth            postgres    false    283                       2606    59247    sessions sessions_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY auth.sessions DROP CONSTRAINT sessions_pkey;
       auth            postgres    false    355            q           2606    28790    sso_domains sso_domains_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY auth.sso_domains DROP CONSTRAINT sso_domains_pkey;
       auth            supabase_auth_admin    false    308            m           2606    28781     sso_providers sso_providers_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY auth.sso_providers DROP CONSTRAINT sso_providers_pkey;
       auth            supabase_auth_admin    false    307                       2606    61676    users users_email_key 
   CONSTRAINT     O   ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 =   ALTER TABLE ONLY auth.users DROP CONSTRAINT users_email_key;
       auth            postgres    false    356                       2606    61674    users users_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY auth.users DROP CONSTRAINT users_pkey;
       auth            postgres    false    356            �           2606    32706    Amethyst Amethyst_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Amethyst"
    ADD CONSTRAINT "Amethyst_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Amethyst" DROP CONSTRAINT "Amethyst_pkey";
       public            postgres    false    323            �           2606    44281    ad_views ad_views_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.ad_views
    ADD CONSTRAINT ad_views_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.ad_views DROP CONSTRAINT ad_views_pkey;
       public            postgres    false    337            �           2606    44372    ads_history ads_history_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.ads_history
    ADD CONSTRAINT ads_history_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.ads_history DROP CONSTRAINT ads_history_pkey;
       public            postgres    false    338            �           2606    54002 %   banned_emails banned_emails_email_key 
   CONSTRAINT     a   ALTER TABLE ONLY public.banned_emails
    ADD CONSTRAINT banned_emails_email_key UNIQUE (email);
 O   ALTER TABLE ONLY public.banned_emails DROP CONSTRAINT banned_emails_email_key;
       public            postgres    false    351                       2606    54000     banned_emails banned_emails_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.banned_emails
    ADD CONSTRAINT banned_emails_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.banned_emails DROP CONSTRAINT banned_emails_pkey;
       public            postgres    false    351            �           2606    53974 #   banned_users banned_users_email_key 
   CONSTRAINT     _   ALTER TABLE ONLY public.banned_users
    ADD CONSTRAINT banned_users_email_key UNIQUE (email);
 M   ALTER TABLE ONLY public.banned_users DROP CONSTRAINT banned_users_email_key;
       public            postgres    false    350            �           2606    53972    banned_users banned_users_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.banned_users
    ADD CONSTRAINT banned_users_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.banned_users DROP CONSTRAINT banned_users_pkey;
       public            postgres    false    350            �           2606    41790 (   collection_images collection_images_pkey 
   CONSTRAINT     {   ALTER TABLE ONLY public.collection_images
    ADD CONSTRAINT collection_images_pkey PRIMARY KEY (collection_id, image_id);
 R   ALTER TABLE ONLY public.collection_images DROP CONSTRAINT collection_images_pkey;
       public            postgres    false    331    331            �           2606    44265 "   credit_sources credit_sources_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.credit_sources
    ADD CONSTRAINT credit_sources_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.credit_sources DROP CONSTRAINT credit_sources_pkey;
       public            postgres    false    336            �           2606    51788 ,   credit_transactions credit_transactions_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.credit_transactions
    ADD CONSTRAINT credit_transactions_pkey PRIMARY KEY (id);
 V   ALTER TABLE ONLY public.credit_transactions DROP CONSTRAINT credit_transactions_pkey;
       public            postgres    false    348            �           2606    44184 .   credits_transactions credits_transactions_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.credits_transactions
    ADD CONSTRAINT credits_transactions_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.credits_transactions DROP CONSTRAINT credits_transactions_pkey;
       public            postgres    false    334            �           2606    41730 &   generated_images generated_images_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.generated_images
    ADD CONSTRAINT generated_images_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.generated_images DROP CONSTRAINT generated_images_pkey;
       public            postgres    false    328            �           2606    41779 (   image_collections image_collections_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.image_collections
    ADD CONSTRAINT image_collections_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.image_collections DROP CONSTRAINT image_collections_pkey;
       public            postgres    false    330            �           2606    41696 "   image_metadata image_metadata_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.image_metadata
    ADD CONSTRAINT image_metadata_pkey PRIMARY KEY (image_id);
 L   ALTER TABLE ONLY public.image_metadata DROP CONSTRAINT image_metadata_pkey;
       public            postgres    false    327            �           2606    41684    images images_hash_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_hash_key UNIQUE (hash);
 @   ALTER TABLE ONLY public.images DROP CONSTRAINT images_hash_key;
       public            postgres    false    326            �           2606    41682    images images_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.images DROP CONSTRAINT images_pkey;
       public            postgres    false    326            �           2606    44070    profiles profiles_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.profiles DROP CONSTRAINT profiles_pkey;
       public            postgres    false    333            �           2606    45576    prompts prompts_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.prompts
    ADD CONSTRAINT prompts_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.prompts DROP CONSTRAINT prompts_pkey;
       public            postgres    false    340            �           2606    41758 &   reference_images reference_images_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.reference_images
    ADD CONSTRAINT reference_images_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.reference_images DROP CONSTRAINT reference_images_pkey;
       public            postgres    false    329            �           2606    44201 .   subscription_history subscription_history_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.subscription_history
    ADD CONSTRAINT subscription_history_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.subscription_history DROP CONSTRAINT subscription_history_pkey;
       public            postgres    false    335            �           2606    29208    messages messages_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);
 B   ALTER TABLE ONLY realtime.messages DROP CONSTRAINT messages_pkey;
       realtime            supabase_realtime_admin    false    321    321            �           2606    31589 ,   messages_2025_02_02 messages_2025_02_02_pkey 
   CONSTRAINT     y   ALTER TABLE ONLY realtime.messages_2025_02_02
    ADD CONSTRAINT messages_2025_02_02_pkey PRIMARY KEY (id, inserted_at);
 X   ALTER TABLE ONLY realtime.messages_2025_02_02 DROP CONSTRAINT messages_2025_02_02_pkey;
       realtime            supabase_admin    false    322    322    4499    322            �           2606    32737 ,   messages_2025_02_03 messages_2025_02_03_pkey 
   CONSTRAINT     y   ALTER TABLE ONLY realtime.messages_2025_02_03
    ADD CONSTRAINT messages_2025_02_03_pkey PRIMARY KEY (id, inserted_at);
 X   ALTER TABLE ONLY realtime.messages_2025_02_03 DROP CONSTRAINT messages_2025_02_03_pkey;
       realtime            supabase_admin    false    4499    325    325    325            �           2606    49716 ,   messages_2025_02_04 messages_2025_02_04_pkey 
   CONSTRAINT     y   ALTER TABLE ONLY realtime.messages_2025_02_04
    ADD CONSTRAINT messages_2025_02_04_pkey PRIMARY KEY (id, inserted_at);
 X   ALTER TABLE ONLY realtime.messages_2025_02_04 DROP CONSTRAINT messages_2025_02_04_pkey;
       realtime            supabase_admin    false    343    343    4499    343            �           2606    49727 ,   messages_2025_02_05 messages_2025_02_05_pkey 
   CONSTRAINT     y   ALTER TABLE ONLY realtime.messages_2025_02_05
    ADD CONSTRAINT messages_2025_02_05_pkey PRIMARY KEY (id, inserted_at);
 X   ALTER TABLE ONLY realtime.messages_2025_02_05 DROP CONSTRAINT messages_2025_02_05_pkey;
       realtime            supabase_admin    false    4499    344    344    344            �           2606    49738 ,   messages_2025_02_06 messages_2025_02_06_pkey 
   CONSTRAINT     y   ALTER TABLE ONLY realtime.messages_2025_02_06
    ADD CONSTRAINT messages_2025_02_06_pkey PRIMARY KEY (id, inserted_at);
 X   ALTER TABLE ONLY realtime.messages_2025_02_06 DROP CONSTRAINT messages_2025_02_06_pkey;
       realtime            supabase_admin    false    345    345    4499    345            �           2606    49749 ,   messages_2025_02_07 messages_2025_02_07_pkey 
   CONSTRAINT     y   ALTER TABLE ONLY realtime.messages_2025_02_07
    ADD CONSTRAINT messages_2025_02_07_pkey PRIMARY KEY (id, inserted_at);
 X   ALTER TABLE ONLY realtime.messages_2025_02_07 DROP CONSTRAINT messages_2025_02_07_pkey;
       realtime            supabase_admin    false    346    346    4499    346            �           2606    49760 ,   messages_2025_02_08 messages_2025_02_08_pkey 
   CONSTRAINT     y   ALTER TABLE ONLY realtime.messages_2025_02_08
    ADD CONSTRAINT messages_2025_02_08_pkey PRIMARY KEY (id, inserted_at);
 X   ALTER TABLE ONLY realtime.messages_2025_02_08 DROP CONSTRAINT messages_2025_02_08_pkey;
       realtime            supabase_admin    false    347    347    347    4499            �           2606    29063    subscription pk_subscription 
   CONSTRAINT     \   ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);
 H   ALTER TABLE ONLY realtime.subscription DROP CONSTRAINT pk_subscription;
       realtime            supabase_admin    false    318            �           2606    29037 (   schema_migrations schema_migrations_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);
 T   ALTER TABLE ONLY realtime.schema_migrations DROP CONSTRAINT schema_migrations_pkey;
       realtime            supabase_admin    false    315            C           2606    16548    buckets buckets_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);
 ?   ALTER TABLE ONLY storage.buckets DROP CONSTRAINT buckets_pkey;
       storage            supabase_storage_admin    false    284            J           2606    16589    migrations migrations_name_key 
   CONSTRAINT     Z   ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);
 I   ALTER TABLE ONLY storage.migrations DROP CONSTRAINT migrations_name_key;
       storage            supabase_storage_admin    false    286            L           2606    16587    migrations migrations_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);
 E   ALTER TABLE ONLY storage.migrations DROP CONSTRAINT migrations_pkey;
       storage            supabase_storage_admin    false    286            H           2606    16565    objects objects_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);
 ?   ALTER TABLE ONLY storage.objects DROP CONSTRAINT objects_pkey;
       storage            supabase_storage_admin    false    285            �           2606    28999 :   s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey 
   CONSTRAINT     y   ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);
 e   ALTER TABLE ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT s3_multipart_uploads_parts_pkey;
       storage            supabase_storage_admin    false    314            �           2606    28984 .   s3_multipart_uploads s3_multipart_uploads_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);
 Y   ALTER TABLE ONLY storage.s3_multipart_uploads DROP CONSTRAINT s3_multipart_uploads_pkey;
       storage            supabase_storage_admin    false    313            �           2606    47185 (   schema_migrations schema_migrations_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);
 _   ALTER TABLE ONLY supabase_migrations.schema_migrations DROP CONSTRAINT schema_migrations_pkey;
       supabase_migrations            postgres    false    341            �           2606    47192    seed_files seed_files_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY supabase_migrations.seed_files
    ADD CONSTRAINT seed_files_pkey PRIMARY KEY (path);
 Q   ALTER TABLE ONLY supabase_migrations.seed_files DROP CONSTRAINT seed_files_pkey;
       supabase_migrations            postgres    false    342            =           1259    58258    audit_logs_created_at_idx    INDEX     [   CREATE INDEX audit_logs_created_at_idx ON auth.audit_log_entries USING btree (created_at);
 +   DROP INDEX auth.audit_logs_created_at_idx;
       auth            postgres    false    282            >           1259    16526    audit_logs_instance_id_idx    INDEX     ]   CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);
 ,   DROP INDEX auth.audit_logs_instance_id_idx;
       auth            postgres    false    282            ]           1259    28771    factor_id_created_at_idx    INDEX     ]   CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);
 *   DROP INDEX auth.factor_id_created_at_idx;
       auth            postgres    false    304    304            }           1259    28879    flow_state_created_at_idx    INDEX     Y   CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);
 +   DROP INDEX auth.flow_state_created_at_idx;
       auth            postgres    false    311            W           1259    28859    identities_email_idx    INDEX     [   CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);
 &   DROP INDEX auth.identities_email_idx;
       auth            postgres    false    303            l           0    0    INDEX identities_email_idx    COMMENT     c   COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';
          auth          postgres    false    4439            \           1259    28686    identities_user_id_idx    INDEX     N   CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);
 (   DROP INDEX auth.identities_user_id_idx;
       auth            postgres    false    303            �           1259    28876    idx_auth_code    INDEX     G   CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);
    DROP INDEX auth.idx_auth_code;
       auth            postgres    false    311            �           1259    28877    idx_user_id_auth_method    INDEX     f   CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);
 )   DROP INDEX auth.idx_user_id_auth_method;
       auth            postgres    false    311    311            e           1259    28882    mfa_challenge_created_at_idx    INDEX     `   CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);
 .   DROP INDEX auth.mfa_challenge_created_at_idx;
       auth            postgres    false    305            b           1259    28743 %   mfa_factors_user_friendly_name_unique    INDEX     �   CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);
 7   DROP INDEX auth.mfa_factors_user_friendly_name_unique;
       auth            postgres    false    304    304    304            c           1259    28888    mfa_factors_user_id_idx    INDEX     P   CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);
 )   DROP INDEX auth.mfa_factors_user_id_idx;
       auth            postgres    false    304            �           1259    28935 #   one_time_tokens_relates_to_hash_idx    INDEX     b   CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);
 5   DROP INDEX auth.one_time_tokens_relates_to_hash_idx;
       auth            supabase_auth_admin    false    312            �           1259    28934 #   one_time_tokens_token_hash_hash_idx    INDEX     b   CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);
 5   DROP INDEX auth.one_time_tokens_token_hash_hash_idx;
       auth            supabase_auth_admin    false    312            �           1259    28936 &   one_time_tokens_user_id_token_type_key    INDEX     v   CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);
 8   DROP INDEX auth.one_time_tokens_user_id_token_type_key;
       auth            supabase_auth_admin    false    312    312                       1259    59255    refresh_tokens_token_idx    INDEX     R   CREATE INDEX refresh_tokens_token_idx ON auth.refresh_tokens USING btree (token);
 *   DROP INDEX auth.refresh_tokens_token_idx;
       auth            postgres    false    353                       1259    59256    refresh_tokens_user_id_idx    INDEX     V   CREATE INDEX refresh_tokens_user_id_idx ON auth.refresh_tokens USING btree (user_id);
 ,   DROP INDEX auth.refresh_tokens_user_id_idx;
       auth            postgres    false    353            w           1259    28815 "   saml_providers_sso_provider_id_idx    INDEX     f   CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);
 4   DROP INDEX auth.saml_providers_sso_provider_id_idx;
       auth            supabase_auth_admin    false    309            x           1259    28880     saml_relay_states_created_at_idx    INDEX     g   CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);
 2   DROP INDEX auth.saml_relay_states_created_at_idx;
       auth            supabase_auth_admin    false    310            y           1259    28830    saml_relay_states_for_email_idx    INDEX     `   CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);
 1   DROP INDEX auth.saml_relay_states_for_email_idx;
       auth            supabase_auth_admin    false    310            |           1259    28829 %   saml_relay_states_sso_provider_id_idx    INDEX     l   CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);
 7   DROP INDEX auth.saml_relay_states_sso_provider_id_idx;
       auth            supabase_auth_admin    false    310                       1259    59257    sessions_user_id_idx    INDEX     J   CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);
 &   DROP INDEX auth.sessions_user_id_idx;
       auth            postgres    false    355            o           1259    28797    sso_domains_domain_idx    INDEX     \   CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));
 (   DROP INDEX auth.sso_domains_domain_idx;
       auth            supabase_auth_admin    false    308    308            r           1259    28796    sso_domains_sso_provider_id_idx    INDEX     `   CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);
 1   DROP INDEX auth.sso_domains_sso_provider_id_idx;
       auth            supabase_auth_admin    false    308            n           1259    28782    sso_providers_resource_id_idx    INDEX     j   CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));
 /   DROP INDEX auth.sso_providers_resource_id_idx;
       auth            supabase_auth_admin    false    307    307            d           1259    28941    unique_phone_factor_per_user    INDEX     c   CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);
 .   DROP INDEX auth.unique_phone_factor_per_user;
       auth            postgres    false    304    304                       1259    61677    users_instance_id_email_idx    INDEX     L   CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (email);
 -   DROP INDEX auth.users_instance_id_email_idx;
       auth            postgres    false    356                       1259    61678    users_instance_id_idx    INDEX     L   CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);
 '   DROP INDEX auth.users_instance_id_idx;
       auth            postgres    false    356            �           1259    53980    banned_users_email_idx    INDEX     P   CREATE INDEX banned_users_email_idx ON public.banned_users USING btree (email);
 *   DROP INDEX public.banned_users_email_idx;
       public            postgres    false    350            �           1259    51806    idx_ad_views_created_at    INDEX     R   CREATE INDEX idx_ad_views_created_at ON public.ad_views USING btree (created_at);
 +   DROP INDEX public.idx_ad_views_created_at;
       public            postgres    false    337            �           1259    44292    idx_ad_views_date    INDEX     L   CREATE INDEX idx_ad_views_date ON public.ad_views USING btree (created_at);
 %   DROP INDEX public.idx_ad_views_date;
       public            postgres    false    337            �           1259    44291    idx_ad_views_profile    INDEX     O   CREATE INDEX idx_ad_views_profile ON public.ad_views USING btree (profile_id);
 (   DROP INDEX public.idx_ad_views_profile;
       public            postgres    false    337            �           1259    51805    idx_ad_views_profile_id    INDEX     R   CREATE INDEX idx_ad_views_profile_id ON public.ad_views USING btree (profile_id);
 +   DROP INDEX public.idx_ad_views_profile_id;
       public            postgres    false    337            �           1259    44393    idx_ads_history_date    INDEX     R   CREATE INDEX idx_ads_history_date ON public.ads_history USING btree (watched_at);
 (   DROP INDEX public.idx_ads_history_date;
       public            postgres    false    338            �           1259    44392    idx_ads_history_profile    INDEX     U   CREATE INDEX idx_ads_history_profile ON public.ads_history USING btree (profile_id);
 +   DROP INDEX public.idx_ads_history_profile;
       public            postgres    false    338            �           1259    41973    idx_collection_images_added    INDEX     ]   CREATE INDEX idx_collection_images_added ON public.collection_images USING btree (added_at);
 /   DROP INDEX public.idx_collection_images_added;
       public            postgres    false    331            �           1259    41972    idx_collections_public    INDEX     r   CREATE INDEX idx_collections_public ON public.image_collections USING btree (is_public) WHERE (is_public = true);
 *   DROP INDEX public.idx_collections_public;
       public            postgres    false    330    330            �           1259    44290    idx_credit_sources_profile    INDEX     [   CREATE INDEX idx_credit_sources_profile ON public.credit_sources USING btree (profile_id);
 .   DROP INDEX public.idx_credit_sources_profile;
       public            postgres    false    336            �           1259    51804 "   idx_credit_transactions_created_at    INDEX     h   CREATE INDEX idx_credit_transactions_created_at ON public.credit_transactions USING btree (created_at);
 6   DROP INDEX public.idx_credit_transactions_created_at;
       public            postgres    false    348            �           1259    51802 "   idx_credit_transactions_profile_id    INDEX     h   CREATE INDEX idx_credit_transactions_profile_id ON public.credit_transactions USING btree (profile_id);
 6   DROP INDEX public.idx_credit_transactions_profile_id;
       public            postgres    false    348            �           1259    51803    idx_credit_transactions_type    INDEX     \   CREATE INDEX idx_credit_transactions_type ON public.credit_transactions USING btree (type);
 0   DROP INDEX public.idx_credit_transactions_type;
       public            postgres    false    348            �           1259    44209     idx_credits_transactions_profile    INDEX     g   CREATE INDEX idx_credits_transactions_profile ON public.credits_transactions USING btree (profile_id);
 4   DROP INDEX public.idx_credits_transactions_profile;
       public            postgres    false    334            �           1259    41968    idx_generated_images_completed    INDEX     �   CREATE INDEX idx_generated_images_completed ON public.generated_images USING btree (completed_at) WHERE (status = 'completed'::public.image_status);
 2   DROP INDEX public.idx_generated_images_completed;
       public            postgres    false    328    1419    328            �           1259    41803    idx_generated_images_created    INDEX     _   CREATE INDEX idx_generated_images_created ON public.generated_images USING btree (created_at);
 0   DROP INDEX public.idx_generated_images_created;
       public            postgres    false    328            �           1259    41970 $   idx_generated_images_generation_time    INDEX     l   CREATE INDEX idx_generated_images_generation_time ON public.generated_images USING btree (generation_time);
 8   DROP INDEX public.idx_generated_images_generation_time;
       public            postgres    false    328            �           1259    41961    idx_generated_images_model    INDEX     l   CREATE INDEX idx_generated_images_model ON public.generated_images USING btree (model_version, created_at);
 .   DROP INDEX public.idx_generated_images_model;
       public            postgres    false    328    328            �           1259    41964 ,   idx_generated_images_negative_prompt_trigram    INDEX     �   CREATE INDEX idx_generated_images_negative_prompt_trigram ON public.generated_images USING gist (negative_prompt public.gist_trgm_ops);
 @   DROP INDEX public.idx_generated_images_negative_prompt_trigram;
       public            postgres    false    328    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9            �           1259    41969    idx_generated_images_processing    INDEX     �   CREATE INDEX idx_generated_images_processing ON public.generated_images USING btree (started_at) WHERE (status = 'processing'::public.image_status);
 3   DROP INDEX public.idx_generated_images_processing;
       public            postgres    false    1419    328    328            �           1259    41963 #   idx_generated_images_prompt_trigram    INDEX     v   CREATE INDEX idx_generated_images_prompt_trigram ON public.generated_images USING gist (prompt public.gist_trgm_ops);
 7   DROP INDEX public.idx_generated_images_prompt_trigram;
       public            postgres    false    328    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9    9            �           1259    41802    idx_generated_images_user    INDEX     Y   CREATE INDEX idx_generated_images_user ON public.generated_images USING btree (user_id);
 -   DROP INDEX public.idx_generated_images_user;
       public            postgres    false    328            �           1259    41960     idx_generated_images_user_status    INDEX     h   CREATE INDEX idx_generated_images_user_status ON public.generated_images USING btree (user_id, status);
 4   DROP INDEX public.idx_generated_images_user_status;
       public            postgres    false    328    328            �           1259    41808    idx_image_metadata_content    INDEX     }   CREATE INDEX idx_image_metadata_content ON public.image_metadata USING ivfflat (content_embedding public.vector_cosine_ops);
 .   DROP INDEX public.idx_image_metadata_content;
       public            postgres    false    327    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10            �           1259    41806    idx_image_metadata_embedding    INDEX     w   CREATE INDEX idx_image_metadata_embedding ON public.image_metadata USING ivfflat (embedding public.vector_cosine_ops);
 0   DROP INDEX public.idx_image_metadata_embedding;
       public            postgres    false    327    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10            �           1259    41975    idx_image_metadata_nsfw_score    INDEX     �   CREATE INDEX idx_image_metadata_nsfw_score ON public.image_metadata USING btree (nsfw_score) WHERE (nsfw_score > (0.5)::double precision);
 1   DROP INDEX public.idx_image_metadata_nsfw_score;
       public            postgres    false    327    327            �           1259    41807    idx_image_metadata_style    INDEX     y   CREATE INDEX idx_image_metadata_style ON public.image_metadata USING ivfflat (style_embedding public.vector_cosine_ops);
 ,   DROP INDEX public.idx_image_metadata_style;
       public            postgres    false    327    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10    10            �           1259    41966     idx_image_metadata_vision_labels    INDEX     q   CREATE INDEX idx_image_metadata_vision_labels ON public.image_metadata USING gin (vision_labels jsonb_path_ops);
 4   DROP INDEX public.idx_image_metadata_vision_labels;
       public            postgres    false    327            �           1259    41967 !   idx_image_metadata_vision_objects    INDEX     s   CREATE INDEX idx_image_metadata_vision_objects ON public.image_metadata USING gin (vision_objects jsonb_path_ops);
 5   DROP INDEX public.idx_image_metadata_vision_objects;
       public            postgres    false    327            �           1259    41962    idx_images_format_size    INDEX     \   CREATE INDEX idx_images_format_size ON public.images USING btree (format, file_size_bytes);
 *   DROP INDEX public.idx_images_format_size;
       public            postgres    false    326    326            �           1259    41801    idx_images_hash    INDEX     B   CREATE INDEX idx_images_hash ON public.images USING btree (hash);
 #   DROP INDEX public.idx_images_hash;
       public            postgres    false    326            �           1259    41965    idx_images_metadata    INDEX     W   CREATE INDEX idx_images_metadata ON public.images USING gin (metadata jsonb_path_ops);
 '   DROP INDEX public.idx_images_metadata;
       public            postgres    false    326            �           1259    41974    idx_images_nsfw    INDEX     \   CREATE INDEX idx_images_nsfw ON public.images USING btree (is_nsfw) WHERE (is_nsfw = true);
 #   DROP INDEX public.idx_images_nsfw;
       public            postgres    false    326    326            �           1259    44394    idx_oauth_tokens_profile    INDEX     a   CREATE INDEX idx_oauth_tokens_profile ON public.oauth_tokens USING btree (profile_id, provider);
 ,   DROP INDEX public.idx_oauth_tokens_profile;
       public            postgres    false    339    339            �           1259    44207    idx_profiles_email    INDEX     H   CREATE INDEX idx_profiles_email ON public.profiles USING btree (email);
 &   DROP INDEX public.idx_profiles_email;
       public            postgres    false    333            �           1259    51704    idx_profiles_id    INDEX     B   CREATE INDEX idx_profiles_id ON public.profiles USING btree (id);
 #   DROP INDEX public.idx_profiles_id;
       public            postgres    false    333            �           1259    51705    idx_profiles_is_admin    INDEX     N   CREATE INDEX idx_profiles_is_admin ON public.profiles USING btree (is_admin);
 )   DROP INDEX public.idx_profiles_is_admin;
       public            postgres    false    333            �           1259    52019    idx_profiles_is_banned    INDEX     P   CREATE INDEX idx_profiles_is_banned ON public.profiles USING btree (is_banned);
 *   DROP INDEX public.idx_profiles_is_banned;
       public            postgres    false    333            �           1259    52998    idx_profiles_stripe_customer_id    INDEX     b   CREATE INDEX idx_profiles_stripe_customer_id ON public.profiles USING btree (stripe_customer_id);
 3   DROP INDEX public.idx_profiles_stripe_customer_id;
       public            postgres    false    333            �           1259    44208    idx_profiles_subscription    INDEX     p   CREATE INDEX idx_profiles_subscription ON public.profiles USING btree (subscription_tier, subscription_status);
 -   DROP INDEX public.idx_profiles_subscription;
       public            postgres    false    333    333            �           1259    52021     idx_profiles_subscription_status    INDEX     d   CREATE INDEX idx_profiles_subscription_status ON public.profiles USING btree (subscription_status);
 4   DROP INDEX public.idx_profiles_subscription_status;
       public            postgres    false    333            �           1259    52020    idx_profiles_subscription_tier    INDEX     `   CREATE INDEX idx_profiles_subscription_tier ON public.profiles USING btree (subscription_tier);
 2   DROP INDEX public.idx_profiles_subscription_tier;
       public            postgres    false    333            �           1259    41805    idx_reference_images_last_used    INDEX     c   CREATE INDEX idx_reference_images_last_used ON public.reference_images USING btree (last_used_at);
 2   DROP INDEX public.idx_reference_images_last_used;
       public            postgres    false    329            �           1259    41971     idx_reference_images_usage_count    INDEX     d   CREATE INDEX idx_reference_images_usage_count ON public.reference_images USING btree (usage_count);
 4   DROP INDEX public.idx_reference_images_usage_count;
       public            postgres    false    329            �           1259    41804    idx_reference_images_user    INDEX     Y   CREATE INDEX idx_reference_images_user ON public.reference_images USING btree (user_id);
 -   DROP INDEX public.idx_reference_images_user;
       public            postgres    false    329            �           1259    44210     idx_subscription_history_profile    INDEX     g   CREATE INDEX idx_subscription_history_profile ON public.subscription_history USING btree (profile_id);
 4   DROP INDEX public.idx_subscription_history_profile;
       public            postgres    false    335            �           1259    54294    profiles_credits_balance_idx    INDEX     \   CREATE INDEX profiles_credits_balance_idx ON public.profiles USING btree (credits_balance);
 0   DROP INDEX public.profiles_credits_balance_idx;
       public            postgres    false    333            �           1259    54291    profiles_email_idx    INDEX     H   CREATE INDEX profiles_email_idx ON public.profiles USING btree (email);
 &   DROP INDEX public.profiles_email_idx;
       public            postgres    false    333            �           1259    56727    profiles_id_idx    INDEX     B   CREATE INDEX profiles_id_idx ON public.profiles USING btree (id);
 #   DROP INDEX public.profiles_id_idx;
       public            postgres    false    333            �           1259    54292    profiles_stripe_customer_id_idx    INDEX     b   CREATE INDEX profiles_stripe_customer_id_idx ON public.profiles USING btree (stripe_customer_id);
 3   DROP INDEX public.profiles_stripe_customer_id_idx;
       public            postgres    false    333            �           1259    54293     profiles_subscription_status_idx    INDEX     d   CREATE INDEX profiles_subscription_status_idx ON public.profiles USING btree (subscription_status);
 4   DROP INDEX public.profiles_subscription_status_idx;
       public            postgres    false    333            �           1259    55427    profiles_user_id_idx    INDEX     G   CREATE INDEX profiles_user_id_idx ON public.profiles USING btree (id);
 (   DROP INDEX public.profiles_user_id_idx;
       public            postgres    false    333            �           1259    29209    ix_realtime_subscription_entity    INDEX     \   CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);
 5   DROP INDEX realtime.ix_realtime_subscription_entity;
       realtime            supabase_admin    false    318            �           1259    29112 /   subscription_subscription_id_entity_filters_key    INDEX     �   CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);
 E   DROP INDEX realtime.subscription_subscription_id_entity_filters_key;
       realtime            supabase_admin    false    318    318    318            A           1259    16554    bname    INDEX     A   CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);
    DROP INDEX storage.bname;
       storage            supabase_storage_admin    false    284            D           1259    16576    bucketid_objname    INDEX     W   CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);
 %   DROP INDEX storage.bucketid_objname;
       storage            supabase_storage_admin    false    285    285            �           1259    29010    idx_multipart_uploads_list    INDEX     r   CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);
 /   DROP INDEX storage.idx_multipart_uploads_list;
       storage            supabase_storage_admin    false    313    313    313            E           1259    28975    idx_objects_bucket_id_name    INDEX     f   CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");
 /   DROP INDEX storage.idx_objects_bucket_id_name;
       storage            supabase_storage_admin    false    285    285            F           1259    16577    name_prefix_search    INDEX     X   CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);
 '   DROP INDEX storage.name_prefix_search;
       storage            supabase_storage_admin    false    285                       0    0    messages_2025_02_02_pkey    INDEX ATTACH     W   ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_02_02_pkey;
          realtime          supabase_realtime_admin    false    322    4499    4501    4499    322    321                       0    0    messages_2025_02_03_pkey    INDEX ATTACH     W   ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_02_03_pkey;
          realtime          supabase_realtime_admin    false    4505    4499    325    4499    325    321                       0    0    messages_2025_02_04_pkey    INDEX ATTACH     W   ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_02_04_pkey;
          realtime          supabase_realtime_admin    false    4587    343    4499    4499    343    321                       0    0    messages_2025_02_05_pkey    INDEX ATTACH     W   ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_02_05_pkey;
          realtime          supabase_realtime_admin    false    4589    344    4499    4499    344    321                       0    0    messages_2025_02_06_pkey    INDEX ATTACH     W   ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_02_06_pkey;
          realtime          supabase_realtime_admin    false    4591    345    4499    4499    345    321                       0    0    messages_2025_02_07_pkey    INDEX ATTACH     W   ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_02_07_pkey;
          realtime          supabase_realtime_admin    false    4593    346    4499    4499    346    321                       0    0    messages_2025_02_08_pkey    INDEX ATTACH     W   ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_02_08_pkey;
          realtime          supabase_realtime_admin    false    347    4499    4595    4499    347    321            7           2620    61681 "   users update_auth_users_timestamps    TRIGGER     �   CREATE TRIGGER update_auth_users_timestamps BEFORE UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION auth.update_timestamps();
 9   DROP TRIGGER update_auth_users_timestamps ON auth.users;
       auth          postgres    false    356    707            4           2620    54300 %   profiles check_profile_update_trigger    TRIGGER     �   CREATE TRIGGER check_profile_update_trigger BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.check_profile_update();
 >   DROP TRIGGER check_profile_update_trigger ON public.profiles;
       public          postgres    false    333    754            5           2620    52064    profiles ensure_admin_exists    TRIGGER     �   CREATE TRIGGER ensure_admin_exists BEFORE DELETE OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.prevent_last_admin_removal();
 5   DROP TRIGGER ensure_admin_exists ON public.profiles;
       public          postgres    false    753    333            6           2620    45585    prompts log_prompt_trigger    TRIGGER     t   CREATE TRIGGER log_prompt_trigger AFTER INSERT ON public.prompts FOR EACH ROW EXECUTE FUNCTION public.log_prompt();
 3   DROP TRIGGER log_prompt_trigger ON public.prompts;
       public          postgres    false    665    340            2           2620    41824 #   generated_images on_image_generated    TRIGGER     �   CREATE TRIGGER on_image_generated AFTER INSERT ON public.generated_images FOR EACH ROW EXECUTE FUNCTION public.update_user_stats();
 <   DROP TRIGGER on_image_generated ON public.generated_images;
       public          postgres    false    328    722            3           2620    41822 (   reference_images on_reference_image_used    TRIGGER     �   CREATE TRIGGER on_reference_image_used AFTER UPDATE OF last_used_at ON public.reference_images FOR EACH ROW EXECUTE FUNCTION public.update_reference_image_usage();
 A   DROP TRIGGER on_reference_image_used ON public.reference_images;
       public          postgres    false    329    656    329            1           2620    29068    subscription tr_check_filters    TRIGGER     �   CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();
 8   DROP TRIGGER tr_check_filters ON realtime.subscription;
       realtime          supabase_admin    false    318    778            0           2620    28963 !   objects update_objects_updated_at    TRIGGER     �   CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();
 ;   DROP TRIGGER update_objects_updated_at ON storage.objects;
       storage          supabase_storage_admin    false    285    766                       2606    28751 1   mfa_challenges mfa_challenges_auth_factor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;
 Y   ALTER TABLE ONLY auth.mfa_challenges DROP CONSTRAINT mfa_challenges_auth_factor_id_fkey;
       auth          postgres    false    305    304    4449                       2606    28810 2   saml_providers saml_providers_sso_provider_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;
 Z   ALTER TABLE ONLY auth.saml_providers DROP CONSTRAINT saml_providers_sso_provider_id_fkey;
       auth          supabase_auth_admin    false    307    4461    309                       2606    28883 6   saml_relay_states saml_relay_states_flow_state_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;
 ^   ALTER TABLE ONLY auth.saml_relay_states DROP CONSTRAINT saml_relay_states_flow_state_id_fkey;
       auth          supabase_auth_admin    false    4479    311    310                       2606    28824 8   saml_relay_states saml_relay_states_sso_provider_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;
 `   ALTER TABLE ONLY auth.saml_relay_states DROP CONSTRAINT saml_relay_states_sso_provider_id_fkey;
       auth          supabase_auth_admin    false    307    310    4461                       2606    28791 ,   sso_domains sso_domains_sso_provider_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;
 T   ALTER TABLE ONLY auth.sso_domains DROP CONSTRAINT sso_domains_sso_provider_id_fkey;
       auth          supabase_auth_admin    false    308    307    4461            ,           2606    44282 !   ad_views ad_views_profile_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ad_views
    ADD CONSTRAINT ad_views_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
 K   ALTER TABLE ONLY public.ad_views DROP CONSTRAINT ad_views_profile_id_fkey;
       public          postgres    false    337    4556    333            -           2606    44373 '   ads_history ads_history_profile_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ads_history
    ADD CONSTRAINT ads_history_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
 Q   ALTER TABLE ONLY public.ads_history DROP CONSTRAINT ads_history_profile_id_fkey;
       public          postgres    false    4556    333    338            '           2606    41791 6   collection_images collection_images_collection_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.collection_images
    ADD CONSTRAINT collection_images_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.image_collections(id) ON DELETE CASCADE;
 `   ALTER TABLE ONLY public.collection_images DROP CONSTRAINT collection_images_collection_id_fkey;
       public          postgres    false    330    331    4540            (           2606    41796 1   collection_images collection_images_image_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.collection_images
    ADD CONSTRAINT collection_images_image_id_fkey FOREIGN KEY (image_id) REFERENCES public.images(id) ON DELETE CASCADE;
 [   ALTER TABLE ONLY public.collection_images DROP CONSTRAINT collection_images_image_id_fkey;
       public          postgres    false    4513    331    326            +           2606    44266 -   credit_sources credit_sources_profile_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.credit_sources
    ADD CONSTRAINT credit_sources_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
 W   ALTER TABLE ONLY public.credit_sources DROP CONSTRAINT credit_sources_profile_id_fkey;
       public          postgres    false    333    4556    336            /           2606    51789 7   credit_transactions credit_transactions_profile_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.credit_transactions
    ADD CONSTRAINT credit_transactions_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
 a   ALTER TABLE ONLY public.credit_transactions DROP CONSTRAINT credit_transactions_profile_id_fkey;
       public          postgres    false    4556    348    333            )           2606    44185 9   credits_transactions credits_transactions_profile_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.credits_transactions
    ADD CONSTRAINT credits_transactions_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
 c   ALTER TABLE ONLY public.credits_transactions DROP CONSTRAINT credits_transactions_profile_id_fkey;
       public          postgres    false    334    333    4556            $           2606    41736 /   generated_images generated_images_image_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.generated_images
    ADD CONSTRAINT generated_images_image_id_fkey FOREIGN KEY (image_id) REFERENCES public.images(id) ON DELETE RESTRICT;
 Y   ALTER TABLE ONLY public.generated_images DROP CONSTRAINT generated_images_image_id_fkey;
       public          postgres    false    4513    326    328            %           2606    41741 9   generated_images generated_images_reference_image_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.generated_images
    ADD CONSTRAINT generated_images_reference_image_id_fkey FOREIGN KEY (reference_image_id) REFERENCES public.images(id);
 c   ALTER TABLE ONLY public.generated_images DROP CONSTRAINT generated_images_reference_image_id_fkey;
       public          postgres    false    328    326    4513            #           2606    41697 +   image_metadata image_metadata_image_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.image_metadata
    ADD CONSTRAINT image_metadata_image_id_fkey FOREIGN KEY (image_id) REFERENCES public.images(id) ON DELETE CASCADE;
 U   ALTER TABLE ONLY public.image_metadata DROP CONSTRAINT image_metadata_image_id_fkey;
       public          postgres    false    327    326    4513            .           2606    44384 )   oauth_tokens oauth_tokens_profile_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.oauth_tokens
    ADD CONSTRAINT oauth_tokens_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
 S   ALTER TABLE ONLY public.oauth_tokens DROP CONSTRAINT oauth_tokens_profile_id_fkey;
       public          postgres    false    4556    333    339            &           2606    41764 /   reference_images reference_images_image_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reference_images
    ADD CONSTRAINT reference_images_image_id_fkey FOREIGN KEY (image_id) REFERENCES public.images(id) ON DELETE RESTRICT;
 Y   ALTER TABLE ONLY public.reference_images DROP CONSTRAINT reference_images_image_id_fkey;
       public          postgres    false    4513    329    326            *           2606    44202 9   subscription_history subscription_history_profile_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.subscription_history
    ADD CONSTRAINT subscription_history_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
 c   ALTER TABLE ONLY public.subscription_history DROP CONSTRAINT subscription_history_profile_id_fkey;
       public          postgres    false    335    333    4556                       2606    16566    objects objects_bucketId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);
 J   ALTER TABLE ONLY storage.objects DROP CONSTRAINT "objects_bucketId_fkey";
       storage          supabase_storage_admin    false    285    284    4419                        2606    28985 8   s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);
 c   ALTER TABLE ONLY storage.s3_multipart_uploads DROP CONSTRAINT s3_multipart_uploads_bucket_id_fkey;
       storage          supabase_storage_admin    false    313    284    4419            !           2606    29005 D   s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);
 o   ALTER TABLE ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey;
       storage          supabase_storage_admin    false    284    314    4419            "           2606    29000 D   s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;
 o   ALTER TABLE ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey;
       storage          supabase_storage_admin    false    4489    313    314            �           3256    61679    users Public read access    POLICY     J   CREATE POLICY "Public read access" ON auth.users FOR SELECT USING (true);
 0   DROP POLICY "Public read access" ON auth.users;
       auth          postgres    false    356            �           3256    61680 !   users Users can update own record    POLICY        CREATE POLICY "Users can update own record" ON auth.users FOR UPDATE USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));
 9   DROP POLICY "Users can update own record" ON auth.users;
       auth          postgres    false    356    708    356    708    356            �           0    16519    audit_log_entries    ROW SECURITY     =   ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;          auth          postgres    false    282            �           0    28869 
   flow_state    ROW SECURITY     6   ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;          auth          postgres    false    311            �           0    28666 
   identities    ROW SECURITY     6   ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;          auth          postgres    false    303            �           0    28756    mfa_amr_claims    ROW SECURITY     :   ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    306            �           0    28744    mfa_challenges    ROW SECURITY     :   ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;          auth          postgres    false    305            �           0    28731    mfa_factors    ROW SECURITY     7   ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;          auth          postgres    false    304            �           0    28919    one_time_tokens    ROW SECURITY     ;   ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    312            �           0    59214    refresh_tokens    ROW SECURITY     :   ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;          auth          postgres    false    353            �           0    28798    saml_providers    ROW SECURITY     :   ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    309            �           0    28816    saml_relay_states    ROW SECURITY     =   ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    310            �           0    16527    schema_migrations    ROW SECURITY     =   ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;          auth          postgres    false    283            �           0    59240    sessions    ROW SECURITY     4   ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;          auth          postgres    false    355            �           0    28783    sso_domains    ROW SECURITY     7   ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    308            �           0    28774    sso_providers    ROW SECURITY     9   ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;          auth          supabase_auth_admin    false    307            �           0    61660    users    ROW SECURITY     1   ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;          auth          postgres    false    356            	           3256    61071 '   profiles Admins can update all profiles    POLICY     �   CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.profiles profiles_1
  WHERE ((profiles_1.id = auth.uid()) AND (profiles_1.is_admin = true)))));
 A   DROP POLICY "Admins can update all profiles" ON public.profiles;
       public          postgres    false    708    333    333    333                       3256    61070 %   profiles Admins can view all profiles    POLICY     �   CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.profiles profiles_1
  WHERE ((profiles_1.id = auth.uid()) AND (profiles_1.is_admin = true)))));
 ?   DROP POLICY "Admins can view all profiles" ON public.profiles;
       public          postgres    false    333    708    333    333            �           0    32697    Amethyst    ROW SECURITY     8   ALTER TABLE public."Amethyst" ENABLE ROW LEVEL SECURITY;          public          postgres    false    323            �           3256    61342 1   profiles Public profiles are viewable by everyone    POLICY     e   CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
 K   DROP POLICY "Public profiles are viewable by everyone" ON public.profiles;
       public          postgres    false    333            �           3256    61344 %   profiles Users can insert own profile    POLICY     k   CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));
 ?   DROP POLICY "Users can insert own profile" ON public.profiles;
       public          postgres    false    333    708    333                       3256    61069 +   profiles Users can insert their own profile    POLICY     �   CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (((auth.uid() IS NOT NULL) AND (id = auth.uid())));
 E   DROP POLICY "Users can insert their own profile" ON public.profiles;
       public          postgres    false    333    708    333            �           3256    61343 %   profiles Users can update own profile    POLICY     �   CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));
 ?   DROP POLICY "Users can update own profile" ON public.profiles;
       public          postgres    false    333    333    333    708    708                       3256    61068 +   profiles Users can update their own profile    POLICY     �   CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));
 E   DROP POLICY "Users can update their own profile" ON public.profiles;
       public          postgres    false    333    333    333    708    708                       3256    61067 )   profiles Users can view their own profile    POLICY     j   CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));
 C   DROP POLICY "Users can view their own profile" ON public.profiles;
       public          postgres    false    708    333    333            �           0    44271    ad_views    ROW SECURITY     6   ALTER TABLE public.ad_views ENABLE ROW LEVEL SECURITY;          public          postgres    false    337            �           0    44362    ads_history    ROW SECURITY     9   ALTER TABLE public.ads_history ENABLE ROW LEVEL SECURITY;          public          postgres    false    338                       3256    60281 "   profiles allow_all_profiles_access    POLICY     [   CREATE POLICY allow_all_profiles_access ON public.profiles USING (true) WITH CHECK (true);
 :   DROP POLICY allow_all_profiles_access ON public.profiles;
       public          postgres    false    333            �           0    53992    banned_emails    ROW SECURITY     ;   ALTER TABLE public.banned_emails ENABLE ROW LEVEL SECURITY;          public          postgres    false    351            �           0    53963    banned_users    ROW SECURITY     :   ALTER TABLE public.banned_users ENABLE ROW LEVEL SECURITY;          public          postgres    false    350            �           0    41785    collection_images    ROW SECURITY     ?   ALTER TABLE public.collection_images ENABLE ROW LEVEL SECURITY;          public          postgres    false    331            �           0    44256    credit_sources    ROW SECURITY     <   ALTER TABLE public.credit_sources ENABLE ROW LEVEL SECURITY;          public          postgres    false    336            �           0    51778    credit_transactions    ROW SECURITY     A   ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;          public          postgres    false    348            �           0    44175    credits_transactions    ROW SECURITY     B   ALTER TABLE public.credits_transactions ENABLE ROW LEVEL SECURITY;          public          postgres    false    334            �           0    41702    generated_images    ROW SECURITY     >   ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;          public          postgres    false    328            �           0    41769    image_collections    ROW SECURITY     ?   ALTER TABLE public.image_collections ENABLE ROW LEVEL SECURITY;          public          postgres    false    330            �           0    41685    image_metadata    ROW SECURITY     <   ALTER TABLE public.image_metadata ENABLE ROW LEVEL SECURITY;          public          postgres    false    327            �           0    41672    images    ROW SECURITY     4   ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;          public          postgres    false    326            �           0    44378    oauth_tokens    ROW SECURITY     :   ALTER TABLE public.oauth_tokens ENABLE ROW LEVEL SECURITY;          public          postgres    false    339            �           0    44060    profiles    ROW SECURITY     6   ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;          public          postgres    false    333            �           0    45550    prompts    ROW SECURITY     5   ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;          public          postgres    false    340            �           0    41746    reference_images    ROW SECURITY     >   ALTER TABLE public.reference_images ENABLE ROW LEVEL SECURITY;          public          postgres    false    329            �           0    44190    subscription_history    ROW SECURITY     B   ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;          public          postgres    false    335            �           0    29194    messages    ROW SECURITY     8   ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;          realtime          supabase_realtime_admin    false    321                       3256    30436    objects Allow public deletes    POLICY     s   CREATE POLICY "Allow public deletes" ON storage.objects FOR DELETE USING ((bucket_id = 'reference-images'::text));
 7   DROP POLICY "Allow public deletes" ON storage.objects;
       storage          supabase_storage_admin    false    285    285                       3256    30434    objects Allow public downloads    POLICY     u   CREATE POLICY "Allow public downloads" ON storage.objects FOR SELECT USING ((bucket_id = 'reference-images'::text));
 9   DROP POLICY "Allow public downloads" ON storage.objects;
       storage          supabase_storage_admin    false    285    285                       3256    30435    objects Allow public updates    POLICY     s   CREATE POLICY "Allow public updates" ON storage.objects FOR UPDATE USING ((bucket_id = 'reference-images'::text));
 7   DROP POLICY "Allow public updates" ON storage.objects;
       storage          supabase_storage_admin    false    285    285                        3256    30433    objects Allow public uploads    POLICY     x   CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT WITH CHECK ((bucket_id = 'reference-images'::text));
 7   DROP POLICY "Allow public uploads" ON storage.objects;
       storage          supabase_storage_admin    false    285    285            �           3256    30431 0   objects Enable delete for users based on user_id    POLICY     �   CREATE POLICY "Enable delete for users based on user_id" ON storage.objects FOR DELETE TO authenticated USING ((bucket_id = 'reference-images'::text));
 K   DROP POLICY "Enable delete for users based on user_id" ON storage.objects;
       storage          supabase_storage_admin    false    285    285            �           3256    30429 (   objects Enable read access for all users    POLICY        CREATE POLICY "Enable read access for all users" ON storage.objects FOR SELECT USING ((bucket_id = 'reference-images'::text));
 C   DROP POLICY "Enable read access for all users" ON storage.objects;
       storage          supabase_storage_admin    false    285    285            �           3256    30430 0   objects Enable update for users based on user_id    POLICY     �   CREATE POLICY "Enable update for users based on user_id" ON storage.objects FOR UPDATE TO authenticated USING ((bucket_id = 'reference-images'::text)) WITH CHECK ((bucket_id = 'reference-images'::text));
 K   DROP POLICY "Enable update for users based on user_id" ON storage.objects;
       storage          supabase_storage_admin    false    285    285    285            �           3256    30428 -   objects Enable upload for authenticated users    POLICY     �   CREATE POLICY "Enable upload for authenticated users" ON storage.objects FOR INSERT TO authenticated WITH CHECK ((bucket_id = 'reference-images'::text));
 H   DROP POLICY "Enable upload for authenticated users" ON storage.objects;
       storage          supabase_storage_admin    false    285    285            �           0    16540    buckets    ROW SECURITY     6   ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;          storage          supabase_storage_admin    false    284            �           0    16582 
   migrations    ROW SECURITY     9   ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;          storage          supabase_storage_admin    false    286            �           0    16555    objects    ROW SECURITY     6   ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;          storage          supabase_storage_admin    false    285            �           0    28976    s3_multipart_uploads    ROW SECURITY     C   ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;          storage          supabase_storage_admin    false    313            �           0    28990    s3_multipart_uploads_parts    ROW SECURITY     I   ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;          storage          supabase_storage_admin    false    314                       6104    16420    supabase_realtime    PUBLICATION     Z   CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');
 $   DROP PUBLICATION supabase_realtime;
                postgres    false            
           6104    29296 &   supabase_realtime_messages_publication    PUBLICATION     o   CREATE PUBLICATION supabase_realtime_messages_publication WITH (publish = 'insert, update, delete, truncate');
 9   DROP PUBLICATION supabase_realtime_messages_publication;
                supabase_admin    false                       6106    32707    supabase_realtime Amethyst    PUBLICATION TABLE     F   ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public."Amethyst";
          public          postgres    false    323    4875                       6106    29297 /   supabase_realtime_messages_publication messages    PUBLICATION TABLE     [   ALTER PUBLICATION supabase_realtime_messages_publication ADD TABLE ONLY realtime.messages;
          realtime          supabase_admin    false    4874    321            X           3466    16615    issue_graphql_placeholder    EVENT TRIGGER     �   CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();
 .   DROP EVENT TRIGGER issue_graphql_placeholder;
                supabase_admin    false    633            ^           3466    16993    issue_pg_cron_access    EVENT TRIGGER     �   CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();
 )   DROP EVENT TRIGGER issue_pg_cron_access;
                supabase_admin    false    645            W           3466    16613    issue_pg_graphql_access    EVENT TRIGGER     �   CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();
 ,   DROP EVENT TRIGGER issue_pg_graphql_access;
                supabase_admin    false    403            V           3466    16594    issue_pg_net_access    EVENT TRIGGER     �   CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();
 (   DROP EVENT TRIGGER issue_pg_net_access;
                postgres    false    632            Y           3466    16616    pgrst_ddl_watch    EVENT TRIGGER     j   CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();
 $   DROP EVENT TRIGGER pgrst_ddl_watch;
                supabase_admin    false    631            Z           3466    16617    pgrst_drop_watch    EVENT TRIGGER     e   CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();
 %   DROP EVENT TRIGGER pgrst_drop_watch;
                supabase_admin    false    399                  x��}[��7r��+&���
$�D���FL��a�9�(��:���d5G��n8�R}�Ѵ��f�éD�9@^b|�^���_�P���{��Bn#��R
[ӌ܆̴��߾k��O�{������>�����k�~�ˏ��k~�?��>}��?�W��$	fVC�-kJAJY;����O���c���������	/����_�������_?�?��ç�v���~��O��������h���߷����߾�������ċO߭�������R�#E
����I�S�[�$1����-�������b��k3�0�ʩ��{��`�Ç�����Q���_��{Jrc�%ַ�Њ?>kh���=��Z�a�=-&�E��<Ň������~����P �ފ&1z;@Ue�j��+�V��R���D�i����S�'�[�&���3���,q�F]CII�ʜ�;�����t�2���0F�eҒ:������j�S��������Ǔ�����>����-J�`I��]���Z�&C[6�k�c	=wsf.m��ϟ��r���_?���������k(�zc����\�X=ێ�Bs��^�(
��5D,%����W����0F4y;��6e��Q3vN�`�b �X���f^q-���yų��i�)��h7�G�'�w�n�R!��j�Ǜk��9s5}�����"O=
q�'Ah�4SG���ٻ���ʀ��I��-�`0��r�V�,�Y��p�B�L#��(��S��6��a~;@$iJ6��Cf2����X�s_kǔ�T�(�b�J[F�N��>��%�خ*W��1f�Җ�)�ߎ�R�T�������'ᕇ�1j�w�e��Ȓ��2v/���)�(<C�{�mŜ�ں֖1g�7�����usp�2��5�^j"]�~1�>��*E\1,����G6�#t�Sj�i/����?D����|c�|�R��y������&ML+�ui��r�����]49i��@NC�āj�1�J4�;(���^K'�uf�ɡB�\�:r���L���'���R�$jg5��nwh��:�:���\�Vy/ ��R��N��׼4��"w��:S�dx����rWHoј���e�n�u*>�j@�,��9�X��(ۍ8�� [��P�d��34�-И�e�0��� ���Za�ޠ���F����3�������>��>��[�ӧO���é%0�΄2ߪh98�"T��ؖ�l|i:Z(}�,P���W��7��dB���^�K���k�n�<)u� ��b�x���|�=_�V�@G��*Ǔ���t�zHD�@�i�)�0fѼj껼梯 ��*=E�%D#:P[��@VQ�-�X*m���Jɥ��v�vx�����I�Ib���8��&�J�l1/j���:��I,�BX��閵�WBܒ����`TZ���J�{y��'b?����u�����@kȫE�-X�l85���G��$���3����Jmz��� ׳�~��J�	�C9����(���!G�ԠN{�w��6���'?!���+�gm�)2l���A��Q�0w���>]�_����bz�#&�80�h�l.�n� �o�� �{�Pt�k�_�`�����թ)�\������FVtV��ED%?	���AZ�I�M����[C-�B�rJ)�|!����O��\J���_�
ښF�R�֔W�F\�%%Q�&��\?��u4(ҡ�Q�P��s:���O	B;�JR99΢�f߭�&�h?��ږ�r�Ɣ�x��"�U*��=�T�����Გ�T&,�R(�#nU`~%���k?Ͳ�	N7��(,�^g�Ȟ��([�Ă��g݂���r����)�����bot&����g.�&��;��2���������2���n��^��k!-�(�a���+�
�v~�t�'�X��m��g/��N�'sW ���R5×��,9��	��a�	P,�'r}�f����O	�����h?-\ـKښ�F��:.%�y���8"O·�J��Ĉ٨/�J�1��$[��(k��+�}����ߘ���z�)�UȾ�Oj&���v��gG�a~��¦	h{U*oA��q>�?���ZALB���-���i���E��NZ+�E<��Mb] [5bK�*���e4G���b�؃���AЬ �U�
W�~��J]Q�P�R�.eq�o5F9�c��&h���U�xrM!�����
/d!q<���Q�A�K<9���G��9q�;��!��:�Hl�$��r$��q�
�4�6���:�X����M@�F�	�Dg_�7��*+��J}Qmt-�
�D.�S�d'�a�lul�	� �p�l��w�}�ͷ�Ã�@z�CW��d����K��?a��t۾~j�O e�E� -e�����
xu���H��sI����?�o�RN,(��Y��jo�Z�1�X�����M<�膐��@�gf3�N�D���۶�(�m�Ӛ���>>8��o��ҁ���u��Pl-�r�G��.�A��^���r?K��)�p��%�ZC�Í���V7�\�{bBd�3��'�W��@���Jr
�Y�,A�6k���D��Qr}�rK��������ۼ��Ep���MO9�Tz����/e@%��\� �x-���=�j5��g'*���H��A���vs�����Y<E��4)���O�/�����:J����4רL9�{5mu��;�Knӕl�\O��wDJ��va0��Ô�Zp�b��#�B�7|�I(cOhj�� T�����~�T���ב�� �Nh��Xٵ{��x�[L3r.*��������'�f2>���<lR�#��/H��z6h�J�]#�x-������L�^8�*�D�m3=�)~Hv��J�bC����Yp*K9"�m����xU̻!��`!�ݵXվ�_��=P���%���E���E�l�[K��-x�	�����q��2Y*� ��J&�9(ty�B?�-<�P@ N�>��
�؂g��E~$�E+t�+	����g����T�K�I�Ɔ��.3�C�3�녮�~!�!���p�yN��-t��2"��x]�/�=�Oo1�5�d��ȕgţ��1b��nB��Һ�5c��@�'g��r������'�ZJ3�ִ�k�ߋkIb�|�F�y 2����O�jT��c�!4�s�3)��/��o������:?U�XH���v!������1l{aP�ր)Dp��a@^t�h\FF��,G�ڹNp�┋a�"Bf��[���*�����)T��ON_����$����i�0Ls5�L����/ H:I�U�g�
�tt]��W����6�C{���Am���������V�+z�ּ�׆ۈ���2笳��Ѕ_����t�Z'�!Kj^e�B�FAg�����A�����[��M��e�y��>[U=�V�:��Xh���W}k��G�% ��FБ�1��Pf
��{Ν��y��m"�I7K ��B����z6h5���RYc�<x�{ �3�8�/x�9��P�U�b�I����,�������?��-������%�ƈ�:<-�@d�#�]%u�� �(r�Er�FA��Yޓ�n�b���5��Swpҽ��׿�A6��m�w!��ޣ~��k������!�#���'����Tx̍��rJ-F�c��~X���Nj�������B��Bǒ\��Sܣ���N����dC*�'%3�2-����J��7�7�]ǯ����e�>IMK��-,>�S	�o�6���l����O^�oQ)�ڴ�xʬë
R0��RS��}������߇:�蓭N�4ZqE��3<�y�Tp�����٘^pxʭ�Qwﵫn�c����uwA�&�����Zn�u�1�������ը�{�o��f�
�r�r-�x��s��p�C{|�RMO�߰�R�-��z@W����ݫr^2k{�Gw�� ��'ho�]�:>��~�-��&j��-하h�r�|�_��QK�Dt�ڢ    �fx�
|��b{�`�i�z���;��}P��䊥���ְ� ��
Fw:�{~��� ~dt=��#'��<���yC�$�/O(֫�#�	��ma�
c=�CU���r��J0��)p����^Yb�V����	8[���3�bjT}2�T�=7� �>�a��p:iE@~$*�P�,1�v���J$U$�k��"���b1t2J.p��ނ�6o��㠦B_漨���fԗ ��k����fˤ5�Y�4� ��1,���d���4@ӝ�A��I��G��h�ћ���F�����7�{$j=i��<`~Q��Ef��%�gO�m�>�n��_]������oC���@%И�Z[��v`-Rd(������Z{�8�H�ΏxK�K٩ֱ	v�-�hu���mD��ԝyq{	�����o��x�e�������A���^��cS�<�|���-.[�~����	�G%��Ѝv� ���m>��d�M�l��ۮ�����d��T�r��g����;Ǩw�L(�&4���z��{�t3��8�������c '����>1yh�u]���'|^�M���k�Y���� ���P�]���1��z[W���=�,��O���������'��i���٢/��o�K_���p5�z�w��&Ё�#����ނ�XW]���%^��G��h�������J��9��
������tЌ���!��&L'dl�t�D�z�w�o��U�T�U����	�A23g�,�h����sɸ-�M;_����0H~�P0J���x�'��x]:�d1��-L]m+d�+��B:iv�(m��?>�͠S���U毓1>����ԯ�/#�����$����fP�����D��v�6Q?����T$5r�4�Q�+��\�Z�G!�;T�]�γxT�PO%��ds,N3Ӟx����Ĉ�^��Ki\�0�>Z,�M���D���Scr��
�UoiҺ���x��ٯ�z�D��J3�ڠ�����ߪF��>P�5�~��;@Yn�HN�?dz�i�R}&h����Lb�h6Ϣx�''�f�-����k����<{�x+�VZ\ə�ף�r��/S)DJ9�A�X�bMAw���s�ޖ0q�,t�<�/M���O���z�r����`^��uF�M�}3��Q�����bٽ,�`:�#��3�
i)�Z���^q閲�t�!�U���ĺW}R��;�������G����aG�Ӧw^Z�O��S|$eK1l����fٯ�n^#�­z�'o�QCq��\2�^z�	���PL��m�֕��~'Àn�&�s�vk�Ѽ��
=1p�f��HE�7��t�dq�H5Փ��H;��R�	��!h���"����h߁qHz����ɤ�5z̹HX��A���fAR���}MX�8���A��I-}��ro��C���Q�k�4�q�yO� G�.�G�4g ��{�ǝ��s�fV����R�ڭ>�q����oZ#N�;�P������b�%��c�um��j��
R�I-'�Lz�
�h�a�X��PfO�����IɃ�gV1:)w�xPQɁW'�Y�~*T�y�-OnM�]���;_&�����ox�أwo��Ů��:���{�= �S��0�1�;[X����|� Yd�6�%�B��B�C��L�V����0a�p��#{�φ�ݤ_�K��q<�����ԵǠ�;��I����Y��%H���M�!2Njbb�o�*�Z����WR��� ������Ƣ�D��sV��5鞏��o,H��3ۚ�M��Gf�xBUO�~��ϑ�w�#���$�B�ZY����N��ȕ��s�jü��V�6}��C�ftlYrϑ�>��0��E��P��E��"�jR��|�X.i�$���Q�m�P���?+ae i�IWa�B��[}T��m��~J�ύy_���F���h�V��D7�Y�Bl�Y�в'�m��J�'��������ԧ8{�G)�$)�OR�?6�F�3��hц6}k�#�`x�����۱��JK�|�|1��ƨ��~���}R�_X�\�Q%�l��;�{��i@z�&�3Rm�A� oV.F'��ͨ�lR�2Ǉ��J���P�T��e�E|��7�ĉX�����䓯���g�bc��S�����wp�nf�rE��������ޝ�3a�6�j]�V^���8����V��vޣ�e��6oP�]ݽ�w��ߵTY��c�K�b"9��/��9J	
�g+�k`�����O:��{����ܫ$-'�
{2l�`P�Чpq�ig*�W-�~��7��xR�>���Mz��3'a������3
��7���<0V����]�օ���p�@ȭ����VM��j��_�=���Z�h�
<�IE|1w$���5�z����W�>�So���\�HI�4����7��.��H�����C����?>i��@�P.�=��;�@�+UV,^A_�{�c�|��O�Wl|�*K<��̀ ��q�J�%r��Ot��Hxr����V�o�}�S�C�ԇP��� �qI{H��,�IG�]�{�ԗ����'e8H�]R���������$x���_o��+-���
���z��%N�����k&A�r�9	g��}��P}2|�eSŦ~}I}Ÿp@J��ΰ�Y[H4=�VmD��>�L�����a�s��V��������b�E����C��V4�=�߬!7>�܊ԣ�1V�!Z$+ުY��ZZX���Mq]����~PR-'�l�ٸ���>M�G���}|��J9��:y_�42�-�O�A:z-�1��il	�o>�� s;��Ko�4���޸F9��
�Zu����<���΄�XG\%�vw�H��6ד���~&{VC�α�M�9�6R�=����c�I�7(���ۖ�[I�){�#�uR^��;�v�{�\�	��D�<������F�CeoQMk��K��۽>.�J�Gw�k�`T�JC�7�������b��_UrW0�L�a������d6�l���`���{7�\*[-s�%����g�Ib>j V��m�˛>�wG�st��ݪ%����FJrR�c�Q�R<��Wf�K��R,��Vs���=G�v'Q�R�}H
K}���j#�R�q�7*�rƑ|b���F��z�8Fg%%D�{���.ka��a W_�*`_�o7a��#tN�����zz� ��Ny��~J�38�o��XN��25�����i@�G���ca�Դ��3m1�|Y�ݴrJ'�ڠ�-h�ޯ�0�,yB��>�:/�� p(z�$D�ٴ�΅�M��`�ǌ]/-�ِ�U���N�a�~�����Ѽ;����!�f��4(̞���"���
����I�ʫ�]g��S�k��a7�k�F��f�V�}N$�Z<�t�9"~x�K�Y[���v�cO�y}���%<��({��'��3M\��]}o��9�c���`0��"����h��_G�<*+l�G{��E�	��(Ju6~a%e��bŲ���"�<).�5m�>���p?�z��QWȃz^?yvmᓺ�6���q5����U|�^�^3�#�a����9J=����Zf�6��c�P=gnƈx[�ǋ��ߕ|�r�zݡ��"+2֟y[k
�Q�G�y�	?���P��T��}q今�^7i�`��32�=D��E<���(�zr��ʹ$HÎ��Q��v�����/�8�綤�qR�F���:�_���g��8���l{�6�q��A����q�<6�ʨ�{��.7�Gad>2l��G���r��S~�*z�N���}JU	�Z����"B֗/7x:�g����}�h5�>x;w�ʔ�l��*኎#g����z@ǔK��J`�jO.�P-�Ȥ@Z���+�����3y����Ѿ�5i��,��r�;?)$y�m��d�\2�@|K$v2���EmF���������][��D����g-O\o"�U���S� !���5�P���Gu�����"K�̶��S]�C��
:�a��dsb���]�H�|��p�-G��$5[W�1-�H��͛�L6!�x�kI�_�gB%��v`�J�	�l��컯�<�x��5� C  _m�z��l�,O�0�CtP1������"��ɇ��^��
�AO^g]�-%���4$�(�zۯެ�wԱ|LI��喾��^X8��ۯ����������ɲb��q���.q-Iw1[�|I'��Mw�ⓜ�wg(~����b;���\�q����T��d5h�Ǒ�oj3��y?[�ݽg���_��#Uo�T���Uz[6@��K%}Vo�>�*י�K���	^a��̥n��lf�`	���n�5$���$]�扜r=O'�'�砡�� v�}����X�>�b�D�_����#�!��qx�����kUDi��@��:��^j���ij��M���y�ߧOx����$��e�i�*�s%hZ��cN�t��/�Cy���rt�r��������"��+u8�2�e&I�{�u��<ۓ=2Ǫk�@c�2b͡˒�y�Em��K0<^w�_�P��T�����F5D����mԁ�(�y����C,�����|Kx��>���+s`�d��i��� ۀ<ne.z�#���o����8��X�+���"U�ja?O����g����@N��F�K��(^�R��?R�����ů���do�{��]�ӌ�@:H:���z�!ع�2�]|�b�O��^�_9��Y�4c�^|c��1���AEru] ��y��Ĉ;x�M���ש�N�%�¡��C쵗5Iw������%�J������m��'o|��t��ڑk͏����t��.���(�@�x�������K~�oܬy���Z�X*X�6o�����)��m��:�xi����������Ok��鶿��:)���[���u���Y�p��p
�4s�s)�u׀��S���'u�����Դ���.B
��)���M�����ez��5Bv�����A�yS��'�V���4%-г�Mq�㹖��ߏAB�$֍5S����cR��do����_q�Z����A>v�Y��D'M-���Ef�#³����1���,�y��{�V��N�@���P1P1+ơEA���MDy\|����7Ư�2�1Q��-��S����+��|j����́	` '�D7�||�ARe(a��o"�Ϟ��Y ��w�o<5z$J>95kRW����n3���H�Q��]b|���?���r�"��B.M�,�M���o���p �Xs�q����ฺ�|��u��U<e{y1adV���PT��<���;��'�����!� ���%T��9K��T��~�'דk�d���@���`4Ͻ�⣟k�޷��-~�VA@ͤZ��)���zX%���`���n�y��Wz�}�ݗ�^��$�H$Yӧ���u@94���
�*-����Q~�Of�v�eWOJ�pY���5lC��ؿ�'O�S�i�#�	ރg���q�0�м��;ڒ�j�x�1���H�>m'S|V)>󆃮��	AD@@���b���O������ �H'�PK�^	�c��EO�G	�7M�:F��-�?�ǧ����i��ſ��~�����t'�Xmz�xa���3j���ӟ���q�i���z	����s��M�l�<��ܲ�IyP�^��'����8;B�ʁjoE
-�o��������׽����c���O~��]�/�B��HϘ����>��o?|���O�4�:krf�2��yR��I������>}���[�}F
ݪ� <ъ�#�0��'`��N����΄w%�_LW��7fA��O�����=�C����4|�ġ��v���"WB�?����7^���|Sbѓ�������AR�]��\a�)������hĘ}�V�>4��̆p�[S��#�����#����#�SL~��O��J���a�,kn�y�M�kf�����?\�ǿ>*zw���j_�~"!}vt�^?��{���	�)R�>}��+��qp���Fu�����'�Ɩ�,B����J�b������^������ؤ{Os�)��	����P 0�fy�pa�GUM/�Y^KMy<hΌ�^E|3�x�(l˨����m��}8s,��Y[m�7�<���Q��Z=ij��J�c^�b2��-pU���7���Ψ�D��|2�w{�za��}�OuN��}Nl��������|���%э�ɢP�sj[.~��X���e�z-��93*ov@���tR;�C�6(�������)9�ys�p�&�=r/a#^ p4
G�m���)����!��/��sJ|#�|�3�9'�yn�y�b��&��:�	?�>�-�m���_K�T��[N�F�h�tѢ3N�������*�l��2 R{z5{���54��~�vQ<�0�sQi˞�������P�%�W��������1����4����]'�S����8����\�{��[.b'S��qZQ@����S��9 �FX\���Ρ��nd�������cL�f�J����\&�`�4؋�Z���AsfT������7'Qs�����ļ �yip�=ʽ{����JĻ��d������x!���\�}֎�VK�'�뽻x G|�ur���*^�Z]�$��cMs�#Q�}�2/�A<�/���'�v�٘O�C-K�ŀ���⫪ݯ��XT��X��$G�" I<Jk��O	�7%��v3l�T4�ڢ$->��]�d ������ul��M��H�3��o_����,o�|����ܾ	�=#Z�G͵ԙ��}ʡv�mU�ϊ�gO"���w�J9���ީ�La�n?S�Py�V�QM����Ć��7k�d�(y>�u�at�B�5Co�|S�F!��mv9�	����FfS�-�8���3��,VJα����ǆ��:�|.��|2�28��N���b٫�^X �ޅ���<;��u��������$           x��Y�R�Ͳ���bߟ(O̓wʠ�L�Ď jd�|�����#�񢣻� jUf��d�*$E�z�8w)"Xic�R���.5Jz����8j��ňr���S�.��M�rkYo�GԵ�*C�\Y���������hU�K�v�E���f�uS�0E����+L����FS���Tv����>�U@<�t��d��DcMS��Ei�U�9�#�d���1��b1�h߱����'��>����l_nv��~yS.ͯi9��d6Xns?c�WB\qɉ�\}����XR�J0���IegtȨD�Ҩ��dX"��b"�s^)dB���@U�D�їbsҭ�P��Ey۩����ɴR�����'#|[���۷�bQWB_���?`�V��b�,9�|rq�(�1Y-ӂ`�R��}`"ă��9pdQH�%�+�ޱ`Tͣ�σֺ����y~���ܻV�z�^�������y�(�"�J�K!�V����Xxb�*X��3��n��	l�1�"pL$*� ��/�PI�|�>�*�w,�8G�����-��������iVe<}ޒ�)�n����Ē0q˩�����Qk`�=t���6�ˠ�Ng,:�,q
0G�1�`�`��Tx�Ҩ܎
��hs���֫��
��}�F~V�z~�#�,J��9,��'�r�9����#HB�[K�0�x}�aJCg�+5p��i���d2I��;��X,v�Ac��n=�-��Ί5j���V?7I�F�֣���V����C��T�d8��ą���P��g8�gX���ǀ��V �����	% e����w,w�QS�6��b9Io���ѩ9��6���}���:����oX�%Ƃ�33����EI͘
Ј�3~�i�4�E	��h����&��/
Pe�A��L��{u�R��|M����ܶ�w%qЍ��MM���v=m�����gN�<-!0��y��'���e}�0c<yd�(PM��Zi<g�i�p��<x�`4#.��0�Xj�:m=V�lN*浦Hw��3K�{ܭ��U�/TС��Pf��簜��}�j�#���� G$ZJ?⼴����� �	A�W@�~����ݳR���2*�7O�m:�C����zy��7��&���u���'i@�H0�&�`#�#��t$^�#���2:C �ѕ���"%��)wFQ����	���=�ol��x�$�Ћ��_/l�<��ٴq}Wn�����r�ř��R<)��`�̕���`H���!�A�\�\��R��@F-G�H�0C-�� ��22��~Grx����+��ߎ=�n��ũh��=�e�����Tu;�22���jrv�O�O,D��-$`��ƂBDI-����a�
{��F��]�`�S(bf��,w��X��b��[�Z��c������S%�^���.tc�V�c����S;m=H����MW���c����qS`#��!�`�W��ĕY�(>��$.M��xg��m��zV�^Se9tk��ړհVt�g�.-�4gT�k���Xq~H�/h�B4��D(�pNf�X$W{� J�ƀs@Q�eT��eg�굎v���=��t��1x>���b�&�����q���1��XNՓJ
��D\f�+
[�rS�|M;�WbX[�+5e���eD�3<	"ޱt���WR�La:��kA�t,Kr%�a+q�'�u7}��$L�	�Z=1�!&8�b(�\�3�(Y�*�Ȏ&!�e������H����?)�=�k�5��
����b��A�U��jb0�>���P��J���
B����zr��R�^�L%5�3I0�9K!�x��M�fg�舡�Q#f$�b�X�Q��N�)r�ڠ=���in���W�r��t�7�_9�_�"kC�a9U�$8h�9��0�}.�^̍�P���F�5���O�b��!�9�������n��"���l���c{��������n�6҇�_w�_½�#�/�S6�4��sh,l>���=�I����,��z/�")Xp���4#��8�[ܤv�*���0Q�ɾU���S��iSݭ[woV��f˿#���,�S�z'���Sb2BC8�ɨ�1�YH��I��&8��A��U�ʤ >��B�9�/�s��l�nn�xn���z�a^����m�w���/���g���ð���(�m���K��',����l>�hg�a�{�H@��|�ʵ�v_��sc��6+�S|YL�|�n�X���^�n���[
�ߑ�ڑ3t��xz�01��'b��,��%���!*�#�3ɮC�[ ����󳌠������m1-_�֨����X�W��j�㭨�4;;�ok���������|}��2�K�2e�7��)PI(�*�DxϒQc		�?˜`�,������X��|d�E�����;S��F,��\e7���Ѥ�������yg����֋K�g�k���4$�\ /�0�z��%�p��.��2h�2�Ax�����ة 2����!���A�!����_X�������l���fs�}{�`��<c��VO�Bt���R���j�+Q!{�!L~��=��јKD����F�&U}��C��v����)��(.�V�Y�R���_�Kyr=)�g�;� B��r��\�b�B��2��2�����3>���d�&�;$
`�qҒ����졵���6����0}�������~5'������lǋ������/�	�I�U�`Q,�) �_@`�� �&n��<��[%��N)�3��Ť�(��M~8��M�6�n��(�z8m�W�g�`��Kuҫu�����]����_�\a��W�߹����}O3�9�N�Pr��1{�p��N(��pS�M���ftL��\.��B 1�Tr$�J��E�9P�G' ��!)��.7u^Z��2W�4{������2�nr���NU7U4���D;n������^{��%���C�H����ٺ����u{z�n��笩z��p ����P+?��alz��6Wn�k��Y��b�]̥�v�'^�x��Z��y*/��[O�_�h���������-�WťaL}}�:�ɳo�����<�X`��C���4Tc���_@���Bʊ��|�։"*�w�
e�y�)<�� N�V����Ҹuf6�Ψ|�4�bn�#��et�}m� �%�Dg5?�=��juS��p��wNL��_��o�׏a�l,�/����rI�������{�c�Y�D�q뾴-������֨���A���1���Y������
��f���gU]b�������#8S�?	�=�LS�xE]|����&�r
�b�!�_78�n�]��Pʠ��2	�(�1�YLJ��fC,���1�h,G��z~���o���k���Q|?����RI��O(�U�<>�9�)�`8�%p~�����:>ps��~@0$�L/�,p�Y�WJZl>&e���Pگ�[���Q2�xs�{���Ow��}9/U'g��+B!�c��[?VO�=%˂��겇T�]�"0�����FO��H�.{��
��D��)��<U$p�h*�W��Jh8��a$87�%̙�.��:���~q'�n9oL\59,�:�U�W���*&��E����X�m7��L��,�^��R*ő=�����`�}9�Q��?ڂI���5JfZ�X}�Li���>��l�� �ت�ŃG�O��R�����Su���3���m\��.���0��u���Cӭ{��ɮ(���RE�y�������?��
�X         i  x��Uۊ�@}N�"�Gs�1��S���MlH��K`)�=���X���4�h�ft�H�IV� e�6�3�udH�1!� $��3u�ǲ�e�X��^~^,i��vz�;��~�멣66�þ��Dj���m6�0E��nFܜ��:l�Ħ��4n����' �8`���V�Yϥ�G��P��)�����x�mO�&@h��^p[�(��R��{���c�R"o���0�I�
�eJqk\2
���6	����UTFBF8�jv�l�-�+��j�{�wV=g�V���t��0F�4���}��D�k�>OwH�0�fBA�FS�E�[L\*n�U�.0�	��R�f7��V�¾ު6޿��o��L�R�RAar�^��
�����R��d���y�#���.�qν4�:�g�T��%��
:9�%rE僤d#��Y����0�r��CSl���"�w�O��_)�l	[l�������M���<��Ӿ�?eO�����<�ہ�a�b5��տ������M�U��vw7wJ�OJ�Q\O����a����!��J���i�/ۥ/Q{�Jj!D)�[�p��n��=g�J�TE���$�<��ߋ�|�{�{      ?      x������ � �            x������ � �            x������ � �            x������ � �            x������ � �      >      x������ � �            x������ � �            x������ � �         L  x�U�ɕ1�{�G�%��?�)Z��}��,�F�����7=��`N�����ML"Zb��)�e�_S<��䋮[N��i�v�Nv8�M�Dn����~�X�[ܡ�F�Ɠ�H���S� �v^Zp�_�W��͆��/*�Z�;rUk��d�9^�æ��#��`���i;/��p�����[�S��5�C�qf�D��͹���Վ�TsF},:�./������7�p�9�U�"QSP�C홆M�D�&hZ��w7�������Î��w^�AŏZu���"�sS��ܻZ��TS|Q��{_;�EЪ<8{>�4�Cծ����������      @      x������ � �            x������ � �            x������ � �      A   �   x����J�@Eד�Cv:�ef2i�j�VЊ� �"��%�d���Z������p7�pថ�R�2���3�E&�j�C�)M6�D�j�{l��Z� ��@y�2�*�����/�����������Y�^����ez����(�hG8�g��@$�}�"�3���v}�^���ĥhtU�s��#]���q]�������dХ��-~����?)�6g�;��b�Z�      _      x������ � �      #      x������ � �      0   �   x��Q
! �o=��w��3:�%�Yu!(6J����Ϸ��F�AW�4�8��p���	1W� �
�h�
"��J����1@��9�B�2�a4�R$�8�_ϳGI�D�q�N�}�n��������]tl����W_��gk���+(      1      x������ � �      =      x������ � �      <      x������ � �      +      x������ � �      /      x������ � �      ;      x������ � �      -      x������ � �      (      x������ � �      *      x������ � �      '      x������ � �      &      x������ � �      2      x������ � �      ,   �  x���Mn1�ךSdH )�w�"h����H�z��1<�9QҋUc;h<uR4! �H~x��@�dȩHF�}��t��ɦ¢|ϛ:M��TuW���Qm��! #�$��C�آp��ј�Z! aX�ϲ���u�Ƈ�1j)���x���|H�_?�8����f���Z��Ȣ���t4!�W���e�Υ5����A2H�S�6�@��bڕ�����>�KZ[KzM�D��YYCGW$W\���K,!��`Z�"A��F�L��;�����X
��)2U���\8�N�9��u�<M�?<�"P�� X���� ʁ���Tβkw��^�@@`a.V��u���W<b^� ����TOC#�)�d�{� �DD
��g׋T���-��ԑ\4��n��t����E�Ϭ-�]��J8]����#]��W]���C      3      x������ � �      )      x������ � �      .      x������ � �      "      x������ � �      %      x������ � �      6      x������ � �      7      x������ � �      8      x������ � �      9      x������ � �      :      x������ � �         �  x���in�0���)�@�7������ύM�"!����(T�)P��>��O�7�{����A<}M]���뒨��,"!��t�⡶ �(�^W�Q!�=	
���07"|jKWi��oa�U~�2Ъ#�ى&�*|4�sb�<��$�&@��W�잞�Db�ȳƜ�2�nfY&�hR����'a3�yz�_b�l:�a4D��!,�9Q����4�A�4��UzCSƲ$\���D �D�6�I��w���g�65oYꞄ�����Je�%�>�1�����X!�G����"� �.�:��L�*�%DwR�*l�rNx/����I��]5��a�
�K� �CR̲�'籰��Hݒp���I.2���_8E�et^2��{���肰}M\�,6�q{�Ћ�b�;�S�p��ɉ��C��~�G�C��m�~ ����      !      x������ � �         J   x�+JMK-J�KN���MLO-�,B���4202�50�5�P0��22�25Գ443�4�60  [2��b���� {��         �  x�uVI��6]S������gI�/����T��CN��e#/l=�o0�vSYu>-�����|�W�Gu���P|m]I��0��`D�UK��P�gJ����c �M��-�e]���ٛ�pTȵ^MH��!�RC=��������M:�ۻ�ą�J̣C��� C�f�#R𭤄�@���M�]e}_/��<���q:;j+ p͘*�*HI(c��ڕk��[��0���g�v�;��B�~(6#*�YZ��Q��IB����T������o���ܞ�.���6�c�_�0��ҹ�FI#�>0{��]{����ba>�I��<t}�s�x#VF1�7hҌ�z�@���?CB�Sz�޸���\퓮wg8v�(��` ex�>4wo@v�M0����	���>�qi�c�mS��1�bR���B�qCo
�R�>v�y*n,_�ʭ��$�yT�� f�F��m	I���La���eBp?`����3#�ސ3Q�0�4M� D�爙tDݝA����f�-���6n�a�ǵo�}�7Y�?1�ګ�"Ǝɗ!Y0��-L\=qo"�?A���3�A'����2殫>�5��\�B������[��f#�w�U���8&��A�m��aq���i�շ�Ŗ���^Ă�r�f��M7�L��6��Ȗd�w��ն3.��$__n(���z��d�ʈ��%�y.1w�h�b��e�&g3�]o�|�E�`i�k�Y7�0XoY��Y�ǘJ�}�yd�i����Yo�2Ůuxs�g�m�ĩ	(�C2�V$ºI!�<ar�v�Η/g�����<�on`��röNԚ��a�R+��7�죛'�\�4���m�o/a�u�޴�Z_߸-/�E|*�M�� �9P�u[A��� f�	���jw�:�q\��r|��5��; :"I9��-)���8+.���� >2ĉ�����˲����L��G�jMv��U2�HV� Mo�n}��$o��D��~>�������E�ݙm�;K�J`h��U�_���>�����a�.�\���֌V�7Qȝ|Ie�^{�Rs,5W��5�Sd��8��r]���`�I#p�Fzl��bn��b�`�=�}�,c&b��W�B�L��N�(/�b5�0���%g;{��M���a�}���{�tKSq��uۘU[+�hV�iiɚ��H�R��>!��F���i��eɚ�            x��\Ɏ$Gr=�_A�U򔙛�b�4WI�$��+��p��-��w=��j��"��9�@��,2�2�-�l�'���Tc�3�l+��Z��W^{�y�4V��������9�N-Y�>-�D
��]t6�Q��闟����*RL�8���C�ͧ�+��D��/ַ���|��,��*�W5�S4�I3j��#���͇_���OpI���?��Ï������p�v�������~�����l�`�g�Dn�S����<�?����|�����DD�q�n�~��/��?��������/���}��_���t'"�_�Z�R_:Ü�M"��Z�� ������_��6 �c ��34�&�tIm���5��l5Y���9�e�G�s�6��!��N��H^Ct�����J7Xc�1�ڢ�����|�x��ʟ �-OIAr֠<j�5����g�d`U�4{H�ˡ.� 1ɢ.�F� �<P=YL�����>�
�i@*�͹���6}�&;��
@��|A ᫽���#�H�M;�\5T-X���N��' ��ih�;��`�r�j�uX�����=y��.�,z*�\DnI�� ����#��0�u��U�9��c��z��x��8�f=��M`9�-�����s��)�O*�De�����!
�.e��bD~�:���)�C�/4@)��8eI� ���w���[t��x:d���V��1���lp��� �n��jh��O+�g��e 7�R| Q7�0;ǛJh�� Bh��Ζ�\ �R9E$h�����5���v Q�h2�0,"�"ZU�a�$�JY� ,۔<�\�5�a��Hg���Z?`0���f�PJD��B�5tQ6ڋpG|�@�I'+�V}�u�{�}�7�i�5g��TjarD3T�*O �Mb.(z�����$�ɵ�z`o}1@x�h��4zcD���U�H9Q���DWY��G_op�����6��(ࡖ@h��QV��r��������B	���" �,Is�t�V8K	�"���»�s#B��:7ŋ �B0J=�r�Y�����nnu& ��P���W��#J�v�9>��=Q�~3�r� ��VXv?��yY���t�S�3����S�֔�� ��XN�2�� ���w��כU<$\��Qdt�Z�(�;RG��G 4q�(�AE���Md�d��5��q;A\���8��xmH�B���RI���\g�k �C�]��܆��SE	�� *�� ���^�U|ۥ��*�#X+P�u��ϡӺ��z�VFQ�ҡS��F�R{[�֎LP�tb��8�r�Y��G_oP�$"ȴ5
Ҫv���V�U3#A��S	��j�����OȺ�&Tc��T|N�M��\��:�7�Vj�6َd���'4�_�:���-��|����p��$q!�B�*U�N��8��U� $�[��Xv�D�
"�%��Z^X��i��a��`kMV˶�h�G ��ɩZ���H^m�_ }�}����%�<`�D�=��S� �m}� �=��Ag��!�Ї��c�����Mvۂ�����/e��E��� Q]��R��Y��ֻ���[30�F���+U/�$f��w)/�vM�3p��MB����UHƥ���!8dD-�⮞�	�����!�Ah62��P~��3+���Ϋ�����n��M*���"*�.�m(�hv����~��R� P�MФ��<d�b�Bi�y��A���/Z�O+�	�Y��,� `|��䣢���x��=�zk��Z�O'ϳ5dGM;�`rK�?�OZ�jE~n�s1�^!�d�)����ә҈�6��V����)\ {b4����S4����0�5zp��U�7ыi�Q�d.���"�M�Qf�~��{50:T��ҬHӝBo=��rc:�Y߹n_��Xz��S�*�6[Uڮ����(�r�y�����C��XGD	L�B�io�6�U��>4�S�+5E����N�*���9,�l�RH3��y油��-#�=35�1���UN���:B0?H=�f���g�
R�߮�l�fׄVo��w��s ����1�����Go/ ���/ �jk�Q}�A�jZ��
]QYd?)�"]����|���][�@]��j�5�M�XAXz�8T܎z�;jw�9Z��p3>�i-/�W[�9��xs
B=�XX
�>��@%�TWXR-�m����4O)=����nm�d	8,�ZG �(\i����o$��d�����<P��Nq`?]e}`�����#�d�fi��Jɬ=�@��L@w�r	}z��	�X�����m�ܠV��&6"�G�P	�&�+9�ߏ�P{Ì�7Zi�id��(n�-v3|��d���|=)��r�c|���7zo�ϷћےpkȽ���4+�n�k�h{��♬�4d\�u�wT�jHE�[&Ӭ���Ut؉�P�_��R$��ܴo��˾�F=`(�Y����"����JO%�LT�L�B�
u�"�U$�zM����q d�������;9Xl����Z+}���++hDǼ��yAs�v�ܮ��3zo.?��^w����u��;��x�PgoVk-�>���	���!vz�Р��9�@S\=���Ӡ�l�B(���T�R !�t���|YL�� ��w���zk�D�Zq������!�F_�f$l��S���n�	A�Kh@┖!+Q�c�2}�a��$��.az͜F��Kg�V2�#by����Ko
���{+�g!ɉ$^hhK�bQ�	ow=�Ԗ�E��t>}�0��\de���5zi�ؗ���Mk����謁��5e�����|�'��9�Z]���>l���[��Y5���|�yy���9����_zs������Gߌ�i��@��J� L:EyJ?� 5�t�9�_����V 0/ׁ��%yɅ��"%"Y�U�އ F?��		d�����@� e4����y@�_3�T�=0��/࣯�7O|~�����f�l{ s���(�	�bB���T?�����y*~��я�,����{*q���h	y�Rm��-V��)@G�3>�>nM��j�r��n��o��R<[Bsc��ԡ�D�\7CF	-z��>��GZ�.��nI�G�V�����
��N����0�ه�>�yl�,��'�𿓖t0T���|��-�AqƸ������=%�M����K�GW/����_ȼ�}���oE�(�H��s�y����N��jt��r�Zސ�(�QS�(B�E������mł1�0�Jڨ���"�Y��)F�����=D�f1�*MwU�^"��5^]�wK�������7f����uK~�<3��7�i�M���9��	�j���Og\8�d�g��
}���t��� �%;�r>��	�}�=1�ț(.	T���h�_��k�����ƾ���{�E����	:�pAXڠn�ڬOT:�� ���_t�� ���D�lz��P��]��=�gǦ���Y��X@Q�f��jfދg�~��C�y�XV�}=�I�\&�?��_�x��y�l�	�7:e��}6���N۬�,���+����Ub�~AJ�+M�t��rlA@�V*�c�5���}�""�:z`GTA�T߼]Q��x���!�J�ō3m����r�z����q��"@�+��药(���]�x���u�j!HB_�@�/ �[n	��2�?�;P�Z����|�XGh64��G\�j���L��Y��~�����VN�����|}� q�e�F�\�a[ϓW�s�3 }ߴMĉ^u�k�w{�����3���&W?��2d˵d*4bF�3���}_@���>��1p]���x4�����Ŝ��\�o�oyj؛S�E�ƭA����E�UG��z�A���A�B�
\�~�f���v�E�E���A����"��������!�L �0A`�rL�ϳ"tv[a���\��n����Kՙв_�k���kN�v�9�Ĕ%	-?2s3Y/� ��/F�}}k�����A�:�/Y8� �i4Jc�5���J��c������x"϶��V�"� 9  ^����c22��D|3���_2 ����9|U<�=I�a����B�z�����@`7�Q��{�����Y5~1N�����??��tC�F�� �A ����sNT�\�~w�[c
��GZ��Z��Z��9�v�*��x��^m�AEVDd�Sɭ��nO��@¯��\m��v��������&8_b��oEP����byw�X��pd�J�e��:=�|%���TT��&ҍ-�x�'!��y8zK�$'C:�W+�Z���<!�FA�*�T��@yTA�u�Ep�z�b#�G_�87�����Qs�Fƶbx����.�r)�K*��n�PD���}�} �P\%C��}̃y�s�dߚ~��ð�����װ��AAt�r5�O�(Q��5K�]6��Q�U��_F��5�-�g1�Q���$�,t�od�IuTǗ����|�R ��'o��~���S,}^P��;��8����G{��wy@�Ese	�
����$���=�`�P�Q�4(�v��dȭF��*�ma�<E|su�w�/���z�a���� �=�	��Rs�f5Vܾt����� sX�ο��B�n3.��L�~��lF-�����A��h���Cp���=���:��A)��Pb��``�w���QR�j��
 �Jh�S"!?�<��I��ӆT��_Aoj�^�&��.ҩ�	�kl���7���;P~yn���1��;�6|`�#1_�~7���F�Y�泺TˍW⧛>��ݙ9qY)�`͗����b���4�
�� ����'P�����0��7�y�Dh2�8Sw���^�@e=�RA���S�Ϗ?��Mz]�x��/<��VP��|�lH�ߟ��?m��y��'}?ha\�	FG�A|�@/��|�����d�7��2�~S@*���2���_m�� ���� q�Ժ�h��V���~ b������p��r���q���T�㲃�K�bF2+x�y4����lϺu��"�r~��TK���$n��mC�o��7��^C [Tv��P�5�6��{�6�k���a���믿��W            x������ � �            x������ � �      4      x��k�����+�I��p>��ց�iS�"E>�bE�$�IsI�����?��3�^���=j�Χ�����w����������|u������^� K�2a�`﫸`aJ��8K�u����xEҬ�����\_?۱��
���ٳ��UG/2�s� v�^�	+^f[R�s�Fy��:]�u�^��g�Y���dU��|�2r�aC)�2���,e-������lA�	QȊ����r��jK�r2!���Q��ggv��Bƹ?f�<a%������_�� ��_'�n?D^c�����<���r�e�
��X�C^-�8<4V �K\㈠����) HhUn�+�
N@�"�葐�FHz��Ş�c{�0���%U���]UI��1�F�8%�,KE�+Z%%Yф3=eI�T�{��/
hI�xˀ�ۜ���F|$�g)3�p泪g�_\�#7��B0&4Ԅ�2��:���Lw��EP��y gwq�
;�G��Ւ�E��(c5�`=[�͚3���s㔆e�k��DB<b�����KX�i1j�����sI(�Ӓ�c���d_�b3Pӻ�!�唠�G���+�f5�(h���ИK�AK��)I�ޔ�1u��Ca�8�u�)ce������-�{�
�����h�b��&�xC�pb^f���,U��5�@,��q� {%f��l�0O
h��FְA����+�׽*�o �1S� WZ��ãk�y�.���1{ҲҮy��1i4>�\��/ڭ�oF 	x��=�k���a�k~G����y.���a�X� �u?<�/�7�6� �ANˍ�Ć�˺�#��l���fzC���"'�"���XQ��"J��S���w߽e%_B�o ˱��쌂[���%��RF�]����뷹s )[St�A����"�%D,���5�Dţ�碬B�c�?��14���9��*q��(X�tZ ����7�<�0=y��%guAT��+���ރ#9�#�Y	h���~�U0 )�EjJs���S�x���ʕ�+{��;���	�f����u�6�J�~�2�lfi&z�VY��r�I|�����}�P?y z0��h���b��X S@���|�o�$4o�kH`'Nb�%K\~��l��G��̱��0qv'��Ex�D��W//�w{���a�b�?cy��Y�!v���7���H���y#οG�iJ�=7V0�[L�'*�)!1ᘒA�q�KQ>c�W�۬JmD渚(Y�#frE�ߙ>l�H�`����c�s�Y�HU�Zz���C/G3����7_l�luhU�RMm(+�yBC��H1�3Y�Q
7w��lVVȶ"�:5z��k�N���*�)�1��u
n�+?J �>']�J'?�R�J��Fot�%�)��t��Ȼ��B��(����f�!!��
$9��T�v�1A���t+�A�_�e4�\���ʝN5OrN��8D-D��C��)?�3"z�=&/��:�� w��)�U69rA�a�/�${]��ۘ��ZU�?�T`x��
Rf$�x�q�K0!���P�b���3�!��$Aõ)�\�∬قV�m2�Q���$MX�@� Υ��C����u<HOo��v��w5?��oP���$F�k�L��d7$a;����
`Z�y�p�Z%��dv�F2|Ȯ6���-t�
}�O��م��se"�x���8�\9��r\��&�L)h��R�\a�J����|
d�z��-ua|ڦrUϦ�D nI��8��C�t!M����x���[����,���抟�qo��q�g��	�l!/Y3U�!O� �� 4I+Ұu���ރ��i��l����_��^��+
���
���R��wCŽ�aUo�JN�)�-Q��`EY7ȣ�i;�#��a����j��ِ������<9�2���{QN�7�k�����oҊ�"�X8L#1Ҥ�����e���{����qH���M*�c���.baB&���Ŵ���V"X�U��oQO�ٷ�� �q�ɭ���3Z��r,�Fq�g�[6f�J�������:]p���oZJ�_˙���E���ȴ���R�=:cm�	R�}��:���dEmb �!�����G�+��;�A���.���<;���D��|dK�fH&ސBP��e�XZ�`C�5k���4I�t�kG��9<��̬�]�/Z~�NSb��8�ñ�gb����fg���l��-f�-m}��z������hda���qr����g�_�δ%jx������}��f�#��6�l+�!�.gd�af�J}���AY���nVt �U�����*W�곶h�`a���/Hmb�#3�[��t�)^�=���R %�[��f��b���؏O`%�!�L�ǧ��#���BvdE�m�Š���
��ʂj�HF��!�ݱɾ����[j/���"^��)o�1k�$hQ��U�c�t�vD�t�l����wr�1�$8�E���Eo��ű�aQ������n+�k�ܶ�ˢ���m|�(�]f�ZرUcc[C��^�y��}��Z�f�z������a�M-!�ユ{��73�~��<O &�iQ�-$2��4��4��ϩ{g{���\��T}����^iRo�&�z��_o&^��g��K�ׅ�V7p�c�6�E��+3�<�&CX�m�	q��H����v��Ql�0&hj���_l#��Uɴ9���S4U��Q7�W,��"�
�iI���rC��%ۺ�����I`խ�Q��pн����d��[�v��`W1�V�
.������ו�}�V���QƝ �����sI �"/�B#(�Mj�U[�4���_6�����@#��ew��y��|��@h�R����'j]�pȅ��Hi��c�g���cm�h t�&T.��0����t/��"��-5�񰾜[�ս���M���m�?"G�y'rp���^�V��<c�-����dt��7�}'$��<]���<G�K�'	<�+[�7b���(���1�G��m����
��M<���:3�O��a�a��?�������R�F�!boW�7��^!s%��C�W#Š���C�8%G<�-ѕq�����������9����WZώ����^l�pp�\����ɴē���=m0a����ۡ:/�gۼ`Ԥ3�Y��!R�:�S���Zq�^��'LRZ���l�#$���.s��#OYͧ�՜�	?��ޯ��gw^9��S��T:?��?����@�|��m.�C[b��|����'����a��%d]_=���y�b�j�F�m䈎��Q=��q(gw��i�c<����H#�	��h�>�ۓ��|�����f��tOa��i�5"���Na�=�]W��)��î{��j�́7*}ٲ��n 6c�����b׾=��V�om��K���T���0��\Kx�02�𶮘���Ӷ3��1��kZ[���V���Z�ǘ������	�,��	����zE9h�`\ ������-����_}������ǁ����6���i��'���x*��N��)�>%ߧ���|j�wW��Ȍ��Mg�^������F��u̦�Z�1J��	��gWa�q=ė��Wx��5@'V_�web�#���I�C-3��jBo/�ErX�d�D�*�L��a����3n�3���|&$U~��u��V��O�[4`�'["37�@V��O���%��N]�8�s_�є7�1?��ݍ ]�l��N��$$ɲ\�@��b�g�	�o��/ޞ���\Y���9��	M���}��m�c5h*cx�y\g��f�d��{��2�/cI۶��)_y����$!��W`@DZ���|r*�<��I�u�C2��D(M�3�Pаt��z7���IZ0u",lO
������v�H�"Q��5L�~�^��?� ��m�����"�S_5�����K��/Ch��oCt��;	!�? �   &����h�ơ�Yg������?v]R��^��SSh�*��(2�bm ?��Jw�Ⱥ�\��oS�����.q�X[��9U
O��S���T
k�|����W�׼��uc5�����b\�?}���      5      x������ � �      a      x������ � �     