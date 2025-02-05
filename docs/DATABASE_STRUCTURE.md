# Structure Détaillée de la Base de Données Amethyst

## 1. Tables Principales

### `auth.users` (Géré par Supabase Auth)
```sql
-- Table gérée automatiquement par Supabase Auth
CREATE TABLE auth.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  encrypted_password TEXT,
  email_confirmed_at TIMESTAMP WITH TIME ZONE,
  invited_at TIMESTAMP WITH TIME ZONE,
  confirmation_token TEXT,
  confirmation_sent_at TIMESTAMP WITH TIME ZONE,
  recovery_token TEXT,
  recovery_sent_at TIMESTAMP WITH TIME ZONE,
  email_change_token TEXT,
  email_change TEXT,
  email_change_sent_at TIMESTAMP WITH TIME ZONE,
  last_sign_in_at TIMESTAMP WITH TIME ZONE,
  raw_app_meta_data JSONB,
  raw_user_meta_data JSONB,
  is_super_admin BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  phone TEXT UNIQUE,
  phone_confirmed_at TIMESTAMP WITH TIME ZONE,
  phone_change TEXT,
  phone_change_token TEXT,
  phone_change_sent_at TIMESTAMP WITH TIME ZONE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  email_change_confirm_status SMALLINT,
  banned_until TIMESTAMP WITH TIME ZONE,
  reauthentication_token TEXT,
  reauthentication_sent_at TIMESTAMP WITH TIME ZONE,
  is_sso_user BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP WITH TIME ZONE
);
```

### `public.profiles`
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  credits_balance INTEGER DEFAULT 100,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  lifetime_credits INTEGER DEFAULT 0,
  total_generations INTEGER DEFAULT 0,
  language TEXT DEFAULT 'fr',
  theme TEXT DEFAULT 'dark',
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  last_sign_in_at TIMESTAMP WITH TIME ZONE,
  auth_provider TEXT DEFAULT 'email',
  notifications_enabled BOOLEAN DEFAULT true,
  marketing_emails_enabled BOOLEAN DEFAULT true,
  ads_enabled BOOLEAN DEFAULT true,
  ads_watched_today INTEGER DEFAULT 0,
  daily_ads_limit INTEGER DEFAULT 5,
  ads_credits_earned INTEGER DEFAULT 0,
  prompt_suggestions_enabled BOOLEAN DEFAULT true,
  ai_safety_level TEXT DEFAULT 'standard',

  CONSTRAINT valid_subscription_tier CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  CONSTRAINT valid_subscription_status CHECK (subscription_status IN ('active', 'cancelled', 'suspended')),
  CONSTRAINT valid_language CHECK (language IN ('fr', 'en')),
  CONSTRAINT valid_theme CHECK (theme IN ('light', 'dark', 'system')),
  CONSTRAINT valid_credits CHECK (credits_balance >= 0),
  CONSTRAINT valid_ads_watched CHECK (ads_watched_today >= 0 AND ads_watched_today <= daily_ads_limit),
  CONSTRAINT valid_safety_level CHECK (ai_safety_level IN ('standard', 'strict', 'relaxed'))
);
```

### `public.prompts`
```sql
CREATE TABLE public.prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  negative_prompt TEXT DEFAULT '',
  model_id TEXT NOT NULL,
  model_version TEXT NOT NULL,
  aspect_ratio TEXT NOT NULL DEFAULT '1:1',
  prompt_strength FLOAT NOT NULL DEFAULT 0.8,
  steps INTEGER NOT NULL DEFAULT 28,
  guidance_scale FLOAT NOT NULL DEFAULT 7.5,
  num_outputs INTEGER NOT NULL DEFAULT 1,
  seed INTEGER NOT NULL DEFAULT -1,
  output_format TEXT NOT NULL DEFAULT 'webp',
  output_quality INTEGER NOT NULL DEFAULT 90,
  safety_checker BOOLEAN NOT NULL DEFAULT true,
  hf_loras TEXT[] NOT NULL DEFAULT ARRAY['AndyVampiro/fog'],
  lora_scales FLOAT[] NOT NULL DEFAULT ARRAY[1.0],
  width INTEGER NOT NULL DEFAULT 1024,
  height INTEGER NOT NULL DEFAULT 1024,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  credits_cost INTEGER NOT NULL DEFAULT 1,
  
  CONSTRAINT prompt_strength_range CHECK (prompt_strength BETWEEN 0.1 AND 1.0),
  CONSTRAINT steps_range CHECK (steps BETWEEN 1 AND 100),
  CONSTRAINT guidance_scale_range CHECK (guidance_scale BETWEEN 1.0 AND 20.0),
  CONSTRAINT num_outputs_range CHECK (num_outputs BETWEEN 1 AND 4),
  CONSTRAINT output_quality_range CHECK (output_quality BETWEEN 1 AND 100),
  CONSTRAINT valid_aspect_ratio CHECK (aspect_ratio IN ('1:1', '16:9')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  CONSTRAINT valid_dimensions CHECK (width > 0 AND height > 0)
);
```

### `public.generated_images`
```sql
CREATE TABLE public.generated_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id UUID REFERENCES prompts(id) ON DELETE SET NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  thumbnail_url TEXT,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  format TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  access_count INTEGER DEFAULT 0,
  is_favorite BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  vision_labels TEXT[],
  vision_description TEXT,
  vision_embedding vector(1536),
  nsfw_score FLOAT,
  style_tags TEXT[],
  color_palette TEXT[],
  dominant_colors TEXT[],
  technical_metadata JSONB DEFAULT '{}'::jsonb,
  
  CONSTRAINT valid_format CHECK (format IN ('webp', 'png', 'jpg')),
  CONSTRAINT valid_dimensions CHECK (width > 0 AND height > 0),
  CONSTRAINT valid_size CHECK (size_bytes > 0),
  CONSTRAINT valid_nsfw_score CHECK (nsfw_score >= 0 AND nsfw_score <= 1)
);

-- Index pour la recherche par similarité
CREATE INDEX generated_images_embedding_idx ON generated_images 
USING ivfflat (vision_embedding vector_cosine_ops)
WITH (lists = 100);
```

### `public.image_analysis`
```sql
CREATE TABLE public.image_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_id UUID REFERENCES generated_images(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  analysis_version TEXT NOT NULL,
  raw_response JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT valid_analysis_type CHECK (analysis_type IN ('vision', 'safety', 'style', 'color'))
);
```

### `public.prompt_suggestions`
```sql
CREATE TABLE public.prompt_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  base_prompt TEXT NOT NULL,
  suggested_prompt TEXT NOT NULL,
  source_type TEXT NOT NULL,
  confidence_score FLOAT NOT NULL,
  used_count INTEGER DEFAULT 0,
  success_rate FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  last_used_at TIMESTAMP WITH TIME ZONE,
  embedding vector(1536),
  metadata JSONB DEFAULT '{}'::jsonb,
  
  CONSTRAINT valid_source_type CHECK (source_type IN ('history', 'vision', 'community', 'ai')),
  CONSTRAINT valid_confidence CHECK (confidence_score >= 0 AND confidence_score <= 1),
  CONSTRAINT valid_success_rate CHECK (success_rate >= 0 AND success_rate <= 1)
);

-- Index pour la recherche par similarité
CREATE INDEX prompt_suggestions_embedding_idx ON prompt_suggestions 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

### `public.user_preferences`
```sql
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  preference_type TEXT NOT NULL,
  preference_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT valid_preference_type CHECK (preference_type IN (
    'generation_defaults',
    'style_preferences',
    'safety_settings',
    'ui_preferences',
    'notification_settings'
  ))
);
```

### `public.credit_transactions`
```sql
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  metadata JSONB DEFAULT '{}'::jsonb,
  
  CONSTRAINT valid_transaction_type CHECK (type IN ('purchase', 'usage', 'refund', 'bonus', 'ads_reward')),
  CONSTRAINT valid_amount CHECK (amount != 0)
);
```

### `public.subscriptions`
```sql
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  metadata JSONB DEFAULT '{}'::jsonb,
  
  CONSTRAINT valid_subscription_status CHECK (status IN ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid'))
);
```

## 2. Tables de Référence

### `public.models`
```sql
CREATE TABLE public.models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  provider TEXT NOT NULL,
  version TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  credits_cost INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  metadata JSONB DEFAULT '{}'::jsonb,
  
  CONSTRAINT valid_provider CHECK (provider IN ('replicate', 'stability', 'openai'))
);
```

### `public.subscription_plans`
```sql
CREATE TABLE public.subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly INTEGER NOT NULL,
  price_yearly INTEGER NOT NULL,
  credits_per_month INTEGER NOT NULL,
  features JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT valid_prices CHECK (price_monthly > 0 AND price_yearly > 0),
  CONSTRAINT valid_credits CHECK (credits_per_month > 0)
);
```

## 3. Tables de Jointure

### `public.user_favorites`
```sql
CREATE TABLE public.user_favorites (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_id UUID REFERENCES generated_images(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  
  PRIMARY KEY (user_id, image_id)
);
```

### `public.user_model_preferences`
```sql
CREATE TABLE public.user_model_preferences (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  model_id TEXT REFERENCES models(id) ON DELETE CASCADE,
  is_favorite BOOLEAN DEFAULT false,
  last_used_at TIMESTAMP WITH TIME ZONE,
  use_count INTEGER DEFAULT 0,
  default_settings JSONB DEFAULT '{}'::jsonb,
  
  PRIMARY KEY (user_id, model_id)
);
```

## 4. Vues Matérialisées

### `public.user_generation_stats`
```sql
CREATE MATERIALIZED VIEW user_generation_stats AS
SELECT 
  u.id as user_id,
  COUNT(DISTINCT p.id) as total_prompts,
  COUNT(DISTINCT gi.id) as total_images,
  AVG(gi.nsfw_score) as avg_nsfw_score,
  array_agg(DISTINCT unnest(gi.style_tags)) as preferred_styles,
  array_agg(DISTINCT unnest(gi.vision_labels)) as common_subjects
FROM profiles u
LEFT JOIN prompts p ON p.user_id = u.id
LEFT JOIN generated_images gi ON gi.prompt_id = p.id
GROUP BY u.id;

-- Rafraîchissement automatique
CREATE OR REPLACE FUNCTION refresh_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_generation_stats;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER refresh_stats
  AFTER INSERT OR UPDATE ON generated_images
  FOR EACH STATEMENT
  EXECUTE FUNCTION refresh_user_stats();
```

### `public.community_trends`
```sql
CREATE MATERIALIZED VIEW community_trends AS
SELECT 
  unnest(vision_labels) as subject,
  COUNT(*) as usage_count,
  AVG(nsfw_score) as avg_nsfw_score,
  array_agg(DISTINCT unnest(style_tags)) as common_styles,
  array_agg(DISTINCT unnest(color_palette)) as color_trends
FROM generated_images
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY subject
HAVING COUNT(*) > 5
ORDER BY usage_count DESC;
```

## 5. Indexes

```sql
-- Profiles
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_subscription ON profiles(subscription_tier, subscription_status);
CREATE INDEX idx_profiles_credits ON profiles(credits_balance);

-- Prompts
CREATE INDEX idx_prompts_user_created ON prompts(user_id, created_at DESC);
CREATE INDEX idx_prompts_status ON prompts(status);
CREATE INDEX idx_prompts_model ON prompts(model_id, model_version);

-- Generated Images
CREATE INDEX idx_images_user ON generated_images(user_id, created_at DESC);
CREATE INDEX idx_images_prompt ON generated_images(prompt_id);
CREATE INDEX idx_images_public ON generated_images(is_public) WHERE is_public = true;
CREATE INDEX idx_images_favorite ON generated_images(is_favorite) WHERE is_favorite = true;

-- Credit Transactions
CREATE INDEX idx_transactions_user ON credit_transactions(user_id, created_at DESC);
CREATE INDEX idx_transactions_type ON credit_transactions(type);

-- Subscriptions
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_period ON subscriptions(current_period_end);
```

## 6. Triggers

### Mise à jour des crédits
```sql
CREATE OR REPLACE FUNCTION update_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET credits_balance = credits_balance + NEW.amount
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER credit_transaction_trigger
  AFTER INSERT ON credit_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_credits();
```

### Mise à jour des statistiques
```sql
CREATE OR REPLACE FUNCTION update_generation_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET 
    total_generations = total_generations + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generation_stats_trigger
  AFTER INSERT ON generated_images
  FOR EACH ROW
  EXECUTE FUNCTION update_generation_stats();
```

### Analyse d'Image Automatique
```sql
CREATE OR REPLACE FUNCTION analyze_new_image()
RETURNS TRIGGER AS $$
BEGIN
  -- Déclencher l'analyse Vision AI
  PERFORM analyze_image_with_vision(NEW.id);
  
  -- Calculer l'embedding
  PERFORM calculate_image_embedding(NEW.id);
  
  -- Analyser le style et les couleurs
  PERFORM analyze_image_style(NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_image_generation
  AFTER INSERT ON generated_images
  FOR EACH ROW
  EXECUTE FUNCTION analyze_new_image();
```

### Mise à jour des Suggestions
```sql
CREATE OR REPLACE FUNCTION update_prompt_suggestions()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour les statistiques de succès
  UPDATE prompt_suggestions
  SET 
    used_count = used_count + 1,
    success_rate = (success_rate * used_count + CASE 
      WHEN NEW.status = 'completed' THEN 1 
      ELSE 0 
    END) / (used_count + 1),
    last_used_at = NOW()
  WHERE id = NEW.prompt_suggestion_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_prompt_use
  AFTER INSERT ON prompts
  FOR EACH ROW
  EXECUTE FUNCTION update_prompt_suggestions();
```

## 7. Politiques RLS

```sql
-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Prompts
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own prompts"
  ON prompts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create prompts"
  ON prompts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Generated Images
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own images"
  ON generated_images FOR SELECT
  USING (
    auth.uid() = user_id OR
    is_public = true OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
```

## 8. Fonctions Utilitaires

```sql
-- Vérification des crédits
CREATE OR REPLACE FUNCTION check_user_credits(user_id UUID, required_credits INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id
    AND credits_balance >= required_credits
  );
END;
$$ LANGUAGE plpgsql;

-- Calcul du coût de génération
CREATE OR REPLACE FUNCTION calculate_generation_cost(
  model_id TEXT,
  num_outputs INTEGER,
  width INTEGER,
  height INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  base_cost INTEGER;
  size_multiplier FLOAT;
BEGIN
  SELECT credits_cost INTO base_cost
  FROM models WHERE id = model_id;
  
  size_multiplier := CEIL((width * height) / (1024.0 * 1024.0));
  
  RETURN CEIL(base_cost * num_outputs * size_multiplier);
END;
$$ LANGUAGE plpgsql;
``` 