# Guide de Référence SQL - Amethyst

## Structure de la Base de Données

### Table `profiles`
```sql
CREATE TABLE profiles (
    id uuid PRIMARY KEY,           -- ID unique lié à auth.users
    email text,                    -- Email de l'utilisateur
    is_admin boolean DEFAULT false,-- Statut administrateur
    is_banned boolean DEFAULT false,-- Statut de bannissement
    created_at timestamp,          -- Date de création
    last_sign_in_at timestamp,     -- Dernière connexion
    
    -- Informations personnelles
    full_name text,               -- Nom complet
    phone_number text,            -- Numéro de téléphone
    avatar_url text,              -- URL de l'avatar
    
    -- Authentification
    auth_provider text,           -- 'email', 'github', 'google', 'apple'
    provider_id text,             -- ID externe du provider
    email_verified boolean DEFAULT false, -- Email vérifié
    phone_verified boolean DEFAULT false, -- Téléphone vérifié
    
    -- Abonnement et paiement
    subscription_tier text DEFAULT 'free',  -- 'free', 'premium'
    subscription_status text DEFAULT 'active',     -- 'active', 'cancelled', 'expired'
    subscription_end_date timestamp,
    stripe_customer_id text,       -- ID client Stripe
    
    -- Système de crédits et publicités
    credits_balance integer DEFAULT 100,   -- Solde actuel de crédits
    lifetime_credits integer DEFAULT 0,   -- Total des crédits gagnés
    last_credit_update timestamp,         -- Dernière mise à jour des crédits
    ads_enabled boolean DEFAULT true,     -- Si l'utilisateur accepte les pubs
    ads_credits_earned integer DEFAULT 0, -- Crédits gagnés via les pubs
    ads_watched_today integer DEFAULT 0,  -- Nombre de pubs vues aujourd'hui
    ads_last_watched timestamp,          -- Dernière pub vue
    daily_ads_limit integer DEFAULT 10,   -- Limite de pubs par jour
    
    -- Préférences
    language text DEFAULT 'Français',
    theme text DEFAULT 'light',
    notifications_enabled boolean DEFAULT true,
    marketing_emails_enabled boolean DEFAULT true
);

-- Index pour les recherches fréquentes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_subscription ON profiles(subscription_tier, subscription_status);
```

### Table `credits_transactions`
```sql
CREATE TABLE credits_transactions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id uuid REFERENCES profiles(id),
    amount integer NOT NULL,
    type text NOT NULL,           -- 'purchase', 'reward', 'usage', 'refund'
    description text,
    created_at timestamp DEFAULT now(),
    metadata jsonb
);
```

### Table `subscription_history`
```sql
CREATE TABLE subscription_history (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id uuid REFERENCES profiles(id),
    tier text NOT NULL,
    status text NOT NULL,
    start_date timestamp,
    end_date timestamp,
    payment_method text,
    amount decimal,
    currency text,
    metadata jsonb
);
```

### Table `ads_history`
```sql
CREATE TABLE ads_history (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id uuid REFERENCES profiles(id),
    ad_id text NOT NULL,              -- ID de la publicité
    credits_earned integer NOT NULL,   -- Crédits gagnés
    watched_at timestamp DEFAULT now(),
    watched_duration integer,          -- Durée de visionnage en secondes
    completed boolean DEFAULT false,   -- Si la pub a été vue entièrement
    platform text,                     -- 'web', 'mobile', etc.
    metadata jsonb                     -- Données additionnelles
);
```

## Fonctions

### `check_admin_status(user_id uuid)`
```sql
CREATE OR REPLACE FUNCTION check_admin_status(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN COALESCE(
        (SELECT is_admin 
         FROM profiles 
         WHERE id = user_id),
        false
    );
END;
$$;
```

### `create_profile_for_user()`
```sql
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        created_at,
        last_sign_in_at,
        auth_provider,
        subscription_tier,
        subscription_status,
        credits_balance,
        lifetime_credits,
        ads_enabled,
        ads_credits_earned,
        ads_watched_today,
        daily_ads_limit,
        language,
        theme,
        notifications_enabled,
        marketing_emails_enabled
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.created_at,
        NEW.last_sign_in_at,
        COALESCE(NEW.app_metadata->>'provider', 'email'),
        'free',
        'active',
        100,
        0,
        true,
        0,
        0,
        10,
        'Français',
        'light',
        true,
        true
    );
    RETURN NEW;
END;
$$;
```

### `update_profile_on_sign_in()`
- **Description** : Met à jour le profil à la connexion
- **Déclencheur** : AFTER UPDATE OF last_sign_in_at ON auth.users
- **Accès** : service_role
```sql
UPDATE profiles SET last_sign_in_at, email;
```

### `get_user_profile(user_id uuid)`
- **Description** : Récupère les informations du profil
- **Retour** : json
- **Accès** : anon, authenticated
```sql
RETURN json_build_object(id, email, is_admin, is_banned, created_at, last_sign_in_at);
```

### `update_credits_balance(profile_id uuid, amount integer, type text, description text)`
```sql
-- Met à jour le solde de crédits et enregistre la transaction
INSERT INTO credits_transactions (profile_id, amount, type, description)
VALUES ($1, $2, $3, $4);

UPDATE profiles 
SET credits_balance = credits_balance + $2,
    lifetime_credits = CASE WHEN $2 > 0 THEN lifetime_credits + $2 ELSE lifetime_credits END,
    last_credit_update = now()
WHERE id = $1;
```

### `update_subscription(profile_id uuid, tier text, status text)`
```sql
-- Met à jour l'abonnement et enregistre l'historique
INSERT INTO subscription_history (
    profile_id, tier, status, start_date
)
VALUES ($1, $2, $3, now());

UPDATE profiles 
SET subscription_tier = $2,
    subscription_status = $3,
    subscription_end_date = CASE 
        WHEN $2 = 'free' THEN NULL 
        ELSE now() + interval '1 month'
    END
WHERE id = $1;
```

### `watch_ad(profile_id uuid, ad_id text, duration integer)`
```sql
-- Enregistre le visionnage d'une pub et attribue des crédits
BEGIN
    -- Vérifier la limite quotidienne
    IF (SELECT ads_watched_today FROM profiles WHERE id = profile_id) >= 
       (SELECT daily_ads_limit FROM profiles WHERE id = profile_id) THEN
        RETURN false;
    END IF;

    -- Calculer les crédits (exemple: 5 crédits par pub)
    INSERT INTO ads_history (profile_id, ad_id, credits_earned, watched_duration)
    VALUES (profile_id, ad_id, 5, duration);

    -- Mettre à jour le profil
    UPDATE profiles 
    SET credits_balance = credits_balance + 5,
        ads_credits_earned = ads_credits_earned + 5,
        ads_watched_today = ads_watched_today + 1,
        ads_last_watched = now()
    WHERE id = profile_id;

    RETURN true;
END;
```

### `reset_daily_ads()`
```sql
-- Réinitialise les compteurs de pubs quotidiens
UPDATE profiles 
SET ads_watched_today = 0 
WHERE DATE(ads_last_watched) < CURRENT_DATE;
```

## Politiques de Sécurité (RLS)

### Lecture
```sql
CREATE POLICY "Lecture des profils"
ON profiles FOR SELECT
TO authenticated
USING (
    auth.uid() = id 
    OR EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    )
);
```

### Insertion
```sql
CREATE POLICY "Insertion par service_role"
ON profiles FOR INSERT
TO service_role
WITH CHECK (true);
```

### Mise à jour
```sql
CREATE POLICY "Mise à jour des profils"
ON profiles FOR UPDATE
TO authenticated
USING (
    auth.uid() = id 
    OR EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    )
)
WITH CHECK (
    auth.uid() = id 
    OR EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    )
);
```

### Suppression
```sql
CREATE POLICY "Suppression par admin"
ON profiles FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    )
);
```

## Permissions

### Rôles
- `service_role` : Accès complet à profiles
- `authenticated` : SELECT, UPDATE sur profiles
- `anon` : Aucun accès direct à profiles

### Fonctions
- `check_admin_status` : authenticated
- `create_profile_for_user` : service_role

## Utilisateur Admin par Défaut
```sql
INSERT INTO profiles (id, email, is_admin)
VALUES ('7af13416-82bf-4400-8caa-6c79298fc110', 'admin@example.com', true);
```

## Notes d'Implémentation

1. La table `profiles` est liée à `auth.users` via la clé primaire
2. Les triggers sont automatiquement déclenchés lors de l'inscription/connexion
3. RLS est activé pour la sécurité avec des politiques spécifiques
4. Les fonctions utilisent `SECURITY DEFINER` pour les permissions
5. Le schéma est défini sur `public` pour la sécurité
6. Les nouveaux utilisateurs reçoivent 100 crédits de départ
7. Les publicités sont limitées à 10 par jour par défaut
8. Les préférences par défaut sont en français et en thème clair

## Sécurité

1. RLS est activé sur toutes les tables
2. Les politiques sont basées sur l'ID de l'utilisateur authentifié
3. Les admins ont accès à tous les profils
4. Les utilisateurs normaux ne peuvent voir et modifier que leur propre profil
5. Seul le service_role peut créer des profils
6. Les fonctions utilisent SECURITY DEFINER pour éviter les contournements
7. Les permissions sont accordées de manière granulaire

## Maintenance

Pour réinitialiser la base de données :
1. Supprimer toutes les politiques
2. Supprimer tous les triggers
3. Supprimer toutes les fonctions
4. Supprimer toutes les tables
5. Réappliquer les migrations dans l'ordre

## Migration des Données

Pour migrer une base existante :
1. Sauvegarder les données actuelles
2. Ajouter les nouvelles colonnes avec des valeurs par défaut
3. Créer les nouvelles tables
4. Migrer les données existantes
5. Ajouter les contraintes et index

## Webhooks et Automatisations

### Stripe Webhook
- Endpoint pour gérer les événements Stripe
- Met à jour subscription_status et credits_balance
- Enregistre les transactions

### Tâches Planifiées
```sql
-- Vérification quotidienne des abonnements expirés
CREATE OR REPLACE FUNCTION check_expired_subscriptions()
RETURNS void AS $$
BEGIN
    UPDATE profiles
    SET subscription_status = 'expired',
        subscription_tier = 'free'
    WHERE subscription_end_date < now()
    AND subscription_tier != 'free';
END;
$$ LANGUAGE plpgsql;
```

### Nettoyage quotidien
```sql
-- Nettoyage quotidien
CREATE OR REPLACE FUNCTION daily_maintenance()
RETURNS void AS $$
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
$$ LANGUAGE plpgsql;
```

## Authentification Externe

### Configuration OAuth
1. Google OAuth:
   ```sql
   -- Table pour les tokens OAuth
   CREATE TABLE oauth_tokens (
       profile_id uuid REFERENCES profiles(id),
       provider text NOT NULL,
       access_token text,
       refresh_token text,
       expires_at timestamp,
       scope text[]
   );
   ```

2. Apple Sign In:
   - Nécessite une configuration spéciale pour iOS
   - Stockage sécurisé des tokens JWT

3. GitHub OAuth:
   - Déjà configuré dans Supabase

## Système de Crédits

### Obtention de Crédits
1. Via Publicités:
   - Limite quotidienne configurable
   - Crédits fixes par pub (ex: 5 crédits)
   - Bonus pour séries de visionnages

2. Via Paiement:
   - Intégration Stripe
   - Packs de crédits prédéfinis
   - Bonus sur les gros packs

### Utilisation des Crédits
- Génération d'images: X crédits
- Fonctionnalités premium: Y crédits
- Bonus quotidiens de connexion

## Webhooks

### Stripe Webhooks
```sql
CREATE OR REPLACE FUNCTION handle_stripe_webhook()
RETURNS void AS $$
BEGIN
    -- Gérer les événements de paiement
    -- Attribuer les crédits achetés
    -- Mettre à jour les abonnements
END;
$$ LANGUAGE plpgsql;
```

### Webhook Publicitaire
```sql
CREATE OR REPLACE FUNCTION handle_ad_completion()
RETURNS void AS $$
BEGIN
    -- Vérifier la validité du visionnage
    -- Attribuer les crédits
    -- Mettre à jour les statistiques
END;
$$ LANGUAGE plpgsql;
```

## Dépendances
- Supabase Auth
- PostgreSQL 14+
- Stripe API
- AWS S3 (pour les avatars) 