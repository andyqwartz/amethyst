-- Mise à jour de la table profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS auth_provider text,
ADD COLUMN IF NOT EXISTS provider_id text,
ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS subscription_end_date timestamp,
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS credits_balance integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS lifetime_credits integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_credit_update timestamp DEFAULT now(),
ADD COLUMN IF NOT EXISTS language text DEFAULT 'fr',
ADD COLUMN IF NOT EXISTS theme text DEFAULT 'light',
ADD COLUMN IF NOT EXISTS notifications_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS marketing_emails_enabled boolean DEFAULT true;

-- Création des tables de support
CREATE TABLE IF NOT EXISTS credits_transactions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    amount integer NOT NULL,
    type text NOT NULL,
    description text,
    created_at timestamp DEFAULT now(),
    metadata jsonb,
    CONSTRAINT valid_transaction_type CHECK (type IN ('purchase', 'reward', 'usage', 'refund'))
);

CREATE TABLE IF NOT EXISTS subscription_history (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    tier text NOT NULL,
    status text NOT NULL,
    start_date timestamp DEFAULT now(),
    end_date timestamp,
    payment_method text,
    amount decimal,
    currency text DEFAULT 'EUR',
    metadata jsonb,
    CONSTRAINT valid_subscription_tier CHECK (tier IN ('free', 'premium')),
    CONSTRAINT valid_subscription_status CHECK (status IN ('active', 'cancelled', 'expired'))
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON profiles(subscription_tier, subscription_status);
CREATE INDEX IF NOT EXISTS idx_credits_transactions_profile ON credits_transactions(profile_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_profile ON subscription_history(profile_id);

-- Fonction pour mettre à jour les crédits
CREATE OR REPLACE FUNCTION update_credits_balance(
    profile_id uuid,
    amount integer,
    type text,
    description text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO credits_transactions (profile_id, amount, type, description)
    VALUES ($1, $2, $3, $4);

    UPDATE profiles 
    SET credits_balance = credits_balance + $2,
        lifetime_credits = CASE WHEN $2 > 0 THEN lifetime_credits + $2 ELSE lifetime_credits END,
        last_credit_update = now()
    WHERE id = $1;
END;
$$;

-- Fonction pour mettre à jour l'abonnement
CREATE OR REPLACE FUNCTION update_subscription(
    profile_id uuid,
    tier text,
    status text,
    end_date timestamp DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Fonction pour vérifier les abonnements expirés
CREATE OR REPLACE FUNCTION check_expired_subscriptions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE profiles
    SET subscription_status = 'expired',
        subscription_tier = 'free'
    WHERE subscription_end_date < now()
    AND subscription_tier != 'free';
END;
$$;

-- Politiques de sécurité pour les nouvelles tables
ALTER TABLE credits_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture de ses propres transactions"
ON credits_transactions FOR SELECT
TO authenticated
USING (profile_id = auth.uid() OR 
       (SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Lecture de son historique d'abonnement"
ON subscription_history FOR SELECT
TO authenticated
USING (profile_id = auth.uid() OR 
       (SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- Permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON credits_transactions TO authenticated;
GRANT SELECT ON subscription_history TO authenticated;
GRANT EXECUTE ON FUNCTION update_credits_balance(uuid, integer, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION update_subscription(uuid, text, text, timestamp) TO authenticated;
GRANT EXECUTE ON FUNCTION check_expired_subscriptions() TO service_role; 