-- Ajout de la colonne is_admin à la table profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Ajout de la colonne is_banned à la table profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_banned boolean DEFAULT false;

-- Suppression des politiques existantes
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leur propre profil" ON profiles;
DROP POLICY IF EXISTS "Les admins peuvent tout voir" ON profiles;

-- Mise à jour des permissions RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Recréation des politiques
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Les admins peuvent tout voir"
ON profiles FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  )
); 
