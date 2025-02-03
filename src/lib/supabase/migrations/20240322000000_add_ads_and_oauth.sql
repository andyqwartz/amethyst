-- Ajout des colonnes pour la gestion des publicités
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS ads_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS ads_credits_earned integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS ads_watched_today integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS ads_last_watched timestamp,
ADD COLUMN IF NOT EXISTS daily_ads_limit integer DEFAULT 10,
ADD COLUMN IF NOT EXISTS google_id text,
ADD COLUMN IF NOT EXISTS apple_id text,
ADD COLUMN IF NOT EXISTS github_id text,
ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false;

-- Création de la table historique des publicités
CREATE TABLE IF NOT EXISTS ads_history (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    ad_id text NOT NULL,
    credits_earned integer NOT NULL,
    watched_at timestamp DEFAULT now(),
    watched_duration integer,
    completed boolean DEFAULT false,
    platform text,
    metadata jsonb,
    CONSTRAINT valid_platform CHECK (platform IN ('web', 'mobile', 'desktop'))
);

-- Table pour les tokens OAuth
CREATE TABLE IF NOT EXISTS oauth_tokens (
    profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    provider text NOT NULL,
    access_token text,
    refresh_token text,
    expires_at timestamp,
    scope text[],
    CONSTRAINT valid_provider CHECK (provider IN ('google', 'apple', 'github'))
);

-- Fonction pour gérer le visionnage des publicités
CREATE OR REPLACE FUNCTION watch_ad(
    profile_id uuid,
    ad_id text,
    duration integer,
    platform text DEFAULT 'web'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Fonction pour réinitialiser les compteurs quotidiens
CREATE OR REPLACE FUNCTION reset_daily_ads()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE profiles 
    SET ads_watched_today = 0 
    WHERE DATE(ads_last_watched) < CURRENT_DATE;
END;
$$;

-- Tâche de maintenance quotidienne
CREATE OR REPLACE FUNCTION daily_maintenance()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_ads_history_profile ON ads_history(profile_id);
CREATE INDEX IF NOT EXISTS idx_ads_history_date ON ads_history(watched_at);
CREATE INDEX IF NOT EXISTS idx_oauth_tokens_profile ON oauth_tokens(profile_id, provider);

-- Politiques de sécurité
ALTER TABLE ads_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_tokens ENABLE ROW LEVEL SECURITY;

-- Politiques pour l'historique des pubs
CREATE POLICY "Lecture de son historique de pubs"
ON ads_history FOR SELECT
TO authenticated
USING (profile_id = auth.uid() OR 
       (SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- Politiques pour les tokens OAuth
CREATE POLICY "Lecture de ses tokens OAuth"
ON oauth_tokens FOR SELECT
TO authenticated
USING (profile_id = auth.uid() OR 
       (SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- Permissions
GRANT SELECT ON ads_history TO authenticated;
GRANT SELECT ON oauth_tokens TO authenticated;
GRANT EXECUTE ON FUNCTION watch_ad(uuid, text, integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION reset_daily_ads() TO service_role;
GRANT EXECUTE ON FUNCTION daily_maintenance() TO service_role; 