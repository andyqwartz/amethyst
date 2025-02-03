-- Suppression de l'ancienne fonction si elle existe
DROP FUNCTION IF EXISTS check_admin_status(uuid);

-- Création de la fonction check_admin_status
CREATE OR REPLACE FUNCTION check_admin_status(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM profiles 
        WHERE id = user_id 
        AND is_admin = true
    );
END;
$$;

-- Accorder les permissions d'exécution
GRANT EXECUTE ON FUNCTION check_admin_status(uuid) TO authenticated;