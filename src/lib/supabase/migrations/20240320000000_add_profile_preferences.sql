-- Ajout des colonnes manquantes à la table profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS language text DEFAULT 'Français',
ADD COLUMN IF NOT EXISTS notifications_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS newsletter_subscribed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'free',
ADD COLUMN IF NOT EXISTS total_generations integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS credits integer DEFAULT 100;

-- Mise à jour des contraintes et index
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_total_generations ON profiles(total_generations);
CREATE INDEX IF NOT EXISTS idx_profiles_credits ON profiles(credits); 