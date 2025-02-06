-- Create or replace function for password verification
CREATE OR REPLACE FUNCTION auth.verify_user_password(
  email text,
  password text
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = auth, public
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

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION auth.verify_user_password(text, text) TO anon, authenticated;

-- Create or replace function to get user by email
CREATE OR REPLACE FUNCTION auth.get_user_by_email(
  lookup_email text
)
RETURNS auth.users
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = auth, public
AS $$
DECLARE
  user_record auth.users;
BEGIN
  SELECT * INTO user_record
  FROM auth.users
  WHERE 
    email = lookup_email 
    AND deleted_at IS NULL;
  
  RETURN user_record;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION auth.get_user_by_email(text) TO anon, authenticated;

-- Commit changes
COMMIT;
