# Guide d'Intégration OAuth et Publicités

## Configuration OAuth dans Supabase

### 1. Configuration Google OAuth

1. Dans Google Cloud Console :
   ```bash
   # Créer un projet
   https://console.cloud.google.com/
   
   # Activer les APIs nécessaires
   - Google+ API
   - Google People API
   ```

2. Dans Supabase Dashboard :
   ```javascript
   // Authentication > Providers > Google
   {
     "client_id": "xxx.apps.googleusercontent.com",
     "client_secret": "xxx",
     "redirect_url": "https://xxx.supabase.co/auth/v1/callback"
   }
   ```

3. Scopes requis :
   - email
   - profile
   - openid

### 2. Configuration Apple Sign In

1. Dans Apple Developer Console :
   ```bash
   # 1. Créer un Service ID
   Settings > Certificates, IDs & Profiles > Identifiers > Services IDs
   
   # 2. Configurer Sign in with Apple
   Settings > Certificates, IDs & Profiles > Keys
   ```

2. Dans Supabase Dashboard :
   ```javascript
   // Authentication > Providers > Apple
   {
     "client_id": "com.votre.app",
     "team_id": "xxx",
     "key_id": "xxx",
     "private_key": "-----BEGIN PRIVATE KEY-----\n..."
   }
   ```

### 3. Configuration GitHub OAuth

1. Dans GitHub :
   ```bash
   # Créer une OAuth App
   Settings > Developer settings > OAuth Apps > New OAuth App
   ```

2. Dans Supabase Dashboard :
   ```javascript
   // Authentication > Providers > GitHub
   {
     "client_id": "xxx",
     "client_secret": "xxx"
   }
   ```

## Intégration des Publicités (Google AdMob)

### 1. Configuration AdMob

1. Créer un compte AdMob :
   ```bash
   # 1. Créer une application
   https://admob.google.com/home/
   
   # 2. Obtenir les IDs d'application
   Apps > [Votre App] > App settings
   ```

2. Configuration dans l'application :
   ```typescript
   // src/config/admob.ts
   export const AdMobConfig = {
     production: {
       appId: {
         android: 'ca-app-pub-xxx~xxx',
         ios: 'ca-app-pub-xxx~xxx'
       },
       rewardedAd: {
         android: 'ca-app-pub-xxx/xxx',
         ios: 'ca-app-pub-xxx/xxx'
       }
     },
     development: {
       // Utiliser les ID de test
       appId: {
         android: 'ca-app-pub-3940256099942544~3347511713',
         ios: 'ca-app-pub-3940256099942544~1458002511'
       },
       rewardedAd: {
         android: 'ca-app-pub-3940256099942544/5224354917',
         ios: 'ca-app-pub-3940256099942544/1712485313'
       }
     }
   };
   ```

### 2. Implémentation Backend

1. Configuration des publicités :
   ```sql
   -- Insérer la configuration
   INSERT INTO ad_config (platform, ad_network, app_id, reward_unit_id) VALUES
   ('android', 'admob', 'ca-app-pub-xxx~xxx', 'ca-app-pub-xxx/xxx'),
   ('ios', 'admob', 'ca-app-pub-xxx~xxx', 'ca-app-pub-xxx/xxx');
   ```

2. Règles de récompense :
   ```sql
   -- Configurer les récompenses
   INSERT INTO reward_rules 
   (condition_type, condition_value, credits_amount) VALUES
   ('duration', '{"min": 30}', 5),
   ('daily_streak', '{"days": 7}', 10);
   ```

### 3. Implémentation Frontend

```typescript
// src/hooks/useAds.ts
export const useAds = () => {
  const watchAd = async () => {
    try {
      // 1. Charger la publicité
      await AdMob.prepareRewardVideoAd({
        adId: AdMobConfig.rewardedAd[platform]
      });

      // 2. Afficher la publicité
      const result = await AdMob.showRewardVideoAd();

      // 3. Valider le visionnage
      if (result.type === 'earned') {
        await supabase.rpc('watch_ad', {
          ad_id: AdMobConfig.rewardedAd[platform],
          duration: result.duration,
          platform: platform
        });
      }
    } catch (error) {
      console.error('Erreur publicité:', error);
    }
  };

  return { watchAd };
};
```

### 4. Sécurité et Validation

1. Vérification côté serveur :
   ```sql
   -- Exemple de validation
   SELECT verify_ad_request(
     'ca-app-pub-xxx/xxx',
     'android',
     'Mozilla/5.0 (Linux; Android 10)...'
   );
   ```

2. Rate limiting :
   ```sql
   -- Vérifier les limites
   SELECT COUNT(*) <= daily_ads_limit
   FROM ads_history
   WHERE profile_id = auth.uid()
   AND DATE(watched_at) = CURRENT_DATE;
   ```

## Surveillance et Maintenance

### 1. Rapports quotidiens

```sql
-- Générer un rapport
SELECT * FROM generate_daily_ad_report(CURRENT_DATE);
```

### 2. Nettoyage automatique

```sql
-- Configuration dans le cron de Supabase
SELECT cron.schedule(
  'daily-maintenance',
  '0 0 * * *',
  $$
  SELECT daily_maintenance();
  $$
);
```

### 3. Alertes

```sql
-- Configurer des alertes pour :
- Taux de complétion < 80%
- Erreurs de validation > 10%
- Utilisateurs atteignant la limite quotidienne
``` 