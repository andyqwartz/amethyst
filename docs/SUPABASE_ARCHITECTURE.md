# Architecture Supabase d'Amethyst

## 1. Extensions et Configuration

### Extensions PostgreSQL Requises
```sql
-- Vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Full text search
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Job scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

### Configuration pgvector
```sql
-- Configuration pour les embeddings
ALTER SYSTEM SET 
  ivfflat.probes = 10;

-- Optimisation des index vectoriels
CREATE INDEX ON generated_images 
USING ivfflat (vision_embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX ON prompt_suggestions 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

## 2. Tables Principales

### Profiles
```sql
CREATE TABLE profiles (
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

### Prompts
```sql
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  negative_prompt TEXT DEFAULT '',
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT prompt_strength_range CHECK (prompt_strength BETWEEN 0.1 AND 1.0),
  CONSTRAINT steps_range CHECK (steps BETWEEN 1 AND 100),
  CONSTRAINT guidance_scale_range CHECK (guidance_scale BETWEEN 1.0 AND 20.0),
  CONSTRAINT num_outputs_range CHECK (num_outputs BETWEEN 1 AND 4),
  CONSTRAINT output_quality_range CHECK (output_quality BETWEEN 1 AND 100),
  CONSTRAINT valid_aspect_ratio CHECK (aspect_ratio IN ('1:1', '16:9'))
);
```

### Generated Images
```sql
CREATE TABLE generated_images (
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
```

### Image Analysis
```sql
CREATE TABLE image_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_id UUID REFERENCES generated_images(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  analysis_version TEXT NOT NULL,
  raw_response JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT valid_analysis_type CHECK (analysis_type IN ('vision', 'safety', 'style', 'color'))
);
```

### Prompt Suggestions
```sql
CREATE TABLE prompt_suggestions (
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
```

### Credit Transactions
```sql
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT valid_transaction_type CHECK (type IN ('purchase', 'usage', 'refund', 'bonus'))
);
```

## 3. Edge Functions

### Vision Analysis
```typescript
// /supabase/functions/vision-analysis/index.ts
import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';

export async function analyzeImage(
  imageUrl: string,
  options: AnalysisOptions
): Promise<VisionAnalysis> {
  const openai = new OpenAI();
  
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Analyze this image in detail." },
          { type: "image_url", url: imageUrl }
        ],
      },
    ],
    max_tokens: 1000,
  });
  
  return processVisionResponse(response);
}
```

### Embedding Generation
```typescript
// /supabase/functions/generate-embeddings/index.ts
export async function generateEmbeddings(
  text: string
): Promise<number[]> {
  const openai = new OpenAI();
  
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });
  
  return response.data[0].embedding;
}
```

## 4. Politiques RLS

### Images et Analyse
```sql
-- Lecture des images
CREATE POLICY "Users can view their own images"
  ON generated_images FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public images are visible to all"
  ON generated_images FOR SELECT
  USING (is_public = true);

-- Analyse des images
CREATE POLICY "Users can view analysis of their images"
  ON image_analysis FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM generated_images
    WHERE generated_images.id = image_id
    AND generated_images.user_id = auth.uid()
  ));
```

### Suggestions
```sql
-- Lecture des suggestions
CREATE POLICY "Users can view their suggestions"
  ON prompt_suggestions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view community suggestions"
  ON prompt_suggestions FOR SELECT
  USING (metadata->>'visibility' = 'public');
```

## 5. Fonctions et Triggers

### Analyse Automatique
```sql
CREATE OR REPLACE FUNCTION analyze_new_image()
RETURNS TRIGGER AS $$
BEGIN
  -- Déclencher l'analyse Vision AI
  PERFORM http_post(
    'https://.../functions/v1/vision-analysis',
    json_build_object('image_id', NEW.id)
  );
  
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
  -- Calculer l'embedding du nouveau prompt
  PERFORM http_post(
    'https://.../functions/v1/generate-embeddings',
    json_build_object('text', NEW.prompt)
  );
  
  -- Mettre à jour les statistiques
  UPDATE prompt_suggestions
  SET used_count = used_count + 1
  WHERE id = NEW.prompt_suggestion_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## 6. Tâches Planifiées

### Maintenance des Embeddings
```sql
SELECT cron.schedule(
  'refresh_embeddings_job',
  '0 0 * * *',  -- Tous les jours à minuit
  $$
  UPDATE generated_images
  SET vision_embedding = (
    SELECT embedding FROM refresh_vision_embedding(id)
  )
  WHERE created_at > NOW() - INTERVAL '7 days'
  $$
);
```

### Nettoyage des Données
```sql
SELECT cron.schedule(
  'cleanup_old_analysis_job',
  '0 0 * * 0',  -- Chaque dimanche
  $$
  DELETE FROM image_analysis
  WHERE created_at < NOW() - INTERVAL '30 days'
  AND analysis_type NOT IN ('vision', 'safety')
  $$
);
```

## 7. Monitoring et Logs

### Audit Logs
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT valid_action CHECK (action IN (
    'generate', 'analyze', 'delete', 'update', 'share'
  ))
);
```

### Performance Metrics
```sql
CREATE MATERIALIZED VIEW performance_metrics AS
SELECT
  date_trunc('hour', created_at) as time_bucket,
  COUNT(*) as total_operations,
  AVG(EXTRACT(EPOCH FROM (completed_at - created_at))) as avg_duration,
  COUNT(*) FILTER (WHERE status = 'error') as error_count
FROM operations_log
GROUP BY date_trunc('hour', created_at);

-- Refresh toutes les heures
SELECT cron.schedule(
  'refresh_metrics_job',
  '0 * * * *',
  'REFRESH MATERIALIZED VIEW CONCURRENTLY performance_metrics;'
);
```

## 8. Backups et Réplication

### Configuration des Backups
```sql
-- Backup quotidien des données critiques
SELECT cron.schedule(
  'daily_backup_job',
  '0 1 * * *',  -- 1h du matin
  $$
  SELECT backup_to_storage(
    'critical_data',
    ARRAY['profiles', 'generated_images', 'image_analysis'],
    'daily/'
  );
  $$
);

-- Backup hebdomadaire complet
SELECT cron.schedule(
  'weekly_full_backup_job',
  '0 2 * * 0',  -- 2h du matin le dimanche
  'SELECT backup_full_database();'
);
```

### Réplication en Temps Réel
```sql
-- Configuration de la réplication
ALTER SYSTEM SET
  wal_level = logical;
ALTER SYSTEM SET
  max_replication_slots = 10;
ALTER SYSTEM SET
  max_wal_senders = 10;

-- Publication des tables critiques
CREATE PUBLICATION amethyst_critical FOR TABLE
  profiles,
  generated_images,
  image_analysis;
```

## 9. Optimisations

### Partitionnement
```sql
-- Partitionnement des images par date
CREATE TABLE generated_images_partitioned (
  LIKE generated_images INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- Création des partitions
CREATE TABLE generated_images_y2024m01 PARTITION OF generated_images_partitioned
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Fonction de maintenance des partitions
CREATE OR REPLACE FUNCTION maintain_partitions()
RETURNS void AS $$
BEGIN
  -- Créer la partition du mois prochain
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS generated_images_y%sm%s PARTITION OF generated_images_partitioned
     FOR VALUES FROM (%L) TO (%L)',
    to_char(NOW() + interval '1 month', 'YYYY'),
    to_char(NOW() + interval '1 month', 'MM'),
    date_trunc('month', NOW() + interval '1 month'),
    date_trunc('month', NOW() + interval '2 month')
  );
END;
$$ LANGUAGE plpgsql;
```

### Indexes
```sql
-- Indexes vectoriels
CREATE INDEX idx_images_embedding ON generated_images
USING ivfflat (vision_embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX idx_suggestions_embedding ON prompt_suggestions
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Indexes composites
CREATE INDEX idx_images_user_date ON generated_images(user_id, created_at DESC);
CREATE INDEX idx_analysis_type_date ON image_analysis(analysis_type, created_at DESC);
CREATE INDEX idx_suggestions_score ON prompt_suggestions(confidence_score DESC, created_at DESC);
```

## 10. Hooks Edge Functions

```typescript
// Vérification des crédits avant génération
export async function beforeGeneration(req: Request) {
  const { user_id } = await getUser(req);
  const { data: profile } = await supabase
    .from('profiles')
    .select('credits_balance')
    .eq('user_id', user_id)
    .single();

  if (profile.credits_balance < 1) {
    throw new Error('Insufficient credits');
  }
}

// Mise à jour des crédits après génération
export async function afterGeneration(req: Request) {
  const { user_id } = await getUser(req);
  await supabase.from('credit_transactions').insert({
    user_id,
    amount: -1,
    type: 'usage',
    description: 'Image generation'
  });
}
```

## Authentification

Configuration de l'authentification dans Supabase :

1. Email/Password
2. OAuth Providers :
   - Google
   - GitHub
   - Discord

## Sécurité

1. RLS activé sur toutes les tables
2. Validation des entrées côté base de données
3. Contraintes d'intégrité référentielle
4. Logging des opérations sensibles
5. Backups automatiques

## Monitoring

Métriques importantes à surveiller :

1. Nombre de générations par utilisateur
2. Utilisation des crédits
3. Taux de conversion des utilisateurs gratuits
4. Temps de réponse des requêtes
5. Taille du stockage utilisé

Cette architecture assure :
- Isolation des données par utilisateur
- Scalabilité
- Maintenance facilitée
- Sécurité robuste
- Traçabilité des opérations 