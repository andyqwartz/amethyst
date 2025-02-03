-- Mise à jour des profils existants avec les valeurs par défaut
UPDATE profiles
SET
    -- Informations de base
    full_name = COALESCE(full_name, email),
    auth_provider = COALESCE(auth_provider, 'email'),
    email_verified = COALESCE(email_verified, false),
    phone_verified = COALESCE(phone_verified, false),
    
    -- Abonnement et crédits
    subscription_tier = COALESCE(subscription_tier, 'free'),
    subscription_status = COALESCE(subscription_status, 'active'),
    credits_balance = COALESCE(credits_balance, 100),
    lifetime_credits = COALESCE(lifetime_credits, 0),
    
    -- Publicités
    ads_enabled = COALESCE(ads_enabled, true),
    ads_credits_earned = COALESCE(ads_credits_earned, 0),
    ads_watched_today = COALESCE(ads_watched_today, 0),
    daily_ads_limit = COALESCE(daily_ads_limit, 10),
    
    -- Préférences
    language = COALESCE(language, 'Français'),
    theme = COALESCE(theme, 'light'),
    notifications_enabled = COALESCE(notifications_enabled, true),
    marketing_emails_enabled = COALESCE(marketing_emails_enabled, true)
WHERE 
    -- Ne mettre à jour que les profils qui n'ont pas ces valeurs définies
    (full_name IS NULL OR
    auth_provider IS NULL OR
    email_verified IS NULL OR
    phone_verified IS NULL OR
    subscription_tier IS NULL OR
    subscription_status IS NULL OR
    credits_balance IS NULL OR
    lifetime_credits IS NULL OR
    ads_enabled IS NULL OR
    ads_credits_earned IS NULL OR
    ads_watched_today IS NULL OR
    daily_ads_limit IS NULL OR
    language IS NULL OR
    theme IS NULL OR
    notifications_enabled IS NULL OR
    marketing_emails_enabled IS NULL);

-- Accorder les permissions nécessaires pour les nouvelles colonnes
GRANT SELECT, UPDATE (
    full_name,
    auth_provider,
    email_verified,
    phone_verified,
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
) ON profiles TO authenticated; 