-- Extract all tables
SELECT json_agg(row_to_json(t))
FROM (
  SELECT table_name
  FROM information_schema.tables 
  WHERE table_schema = 'public'
  ORDER BY table_name
) t;

-- Extract all columns with their properties
SELECT json_agg(row_to_json(t))
FROM (
  SELECT table_name, column_name, data_type, is_nullable, column_default
  FROM information_schema.columns
  WHERE table_schema = 'public'
  ORDER BY table_name, ordinal_position
) t;

-- Extract all indexes
SELECT json_agg(row_to_json(t))
FROM (
  SELECT *
  FROM pg_indexes
  WHERE schemaname = 'public'
  ORDER BY tablename, indexname
) t;

-- Extract all triggers
SELECT json_agg(row_to_json(t))
FROM (
  SELECT event_object_table, trigger_name, action_timing, event_manipulation
  FROM information_schema.triggers
  WHERE trigger_schema = 'public'
  ORDER BY trigger_name
) t;

-- Extract all foreign keys
SELECT json_agg(row_to_json(t))
FROM (
  SELECT 
    conname AS constraint_name,
    conrelid::regclass AS table_name,
    a.attname AS column_name,
    confrelid::regclass AS foreign_table_name,
    af.attname AS foreign_column_name
  FROM pg_constraint
  JOIN pg_attribute a ON a.attnum = ANY(conkey) AND a.attrelid = conrelid
  JOIN pg_attribute af ON af.attnum = ANY(confkey) AND af.attrelid = confrelid
  WHERE contype = 'f'
  ORDER BY conname
) t;

-- Extract all row-level security policies
SELECT json_agg(row_to_json(t))
FROM (
  SELECT *
  FROM pg_policy
  ORDER BY polname
) t;

-- Extract all roles
SELECT json_agg(row_to_json(t))
FROM (
  SELECT rolname, rolsuper
  FROM pg_roles
  ORDER BY rolname
) t;

-- Extract permissions for auth.users table
SELECT json_agg(row_to_json(t))
FROM (
  SELECT grantee, privilege_type
  FROM information_schema.role_table_grants
  WHERE table_name = 'users'
  AND table_schema = 'auth'
  ORDER BY grantee, privilege_type
) t;
