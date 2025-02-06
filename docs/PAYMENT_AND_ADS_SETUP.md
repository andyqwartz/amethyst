# Configuration du système de paiement et publicités

## Configuration de Stripe

1. **Créer un compte Stripe**
   - Rendez-vous sur [Stripe.com](https://stripe.com) et créez un compte
   - Activez le mode test pour développement

2. **Récupérer les clés API**
   - Dans le dashboard Stripe, allez dans Développeurs > Clés API
   - Copiez la clé publique (`pk_test_...`) et la clé secrète (`sk_test_...`)

3. **Configuration des variables d'environnement**
   ```env
   VITE_STRIPE_PUBLIC_KEY=pk_test_votre_cle_publique
   STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
   STRIPE_WEBHOOK_SECRET=whsec_votre_cle_webhook
   ```

4. **Configurer le webhook Stripe**
   - Dans le dashboard Stripe, allez dans Développeurs > Webhooks
   - Ajoutez un endpoint : `https://votre-projet.supabase.co/functions/v1/stripe-webhook`
   - Sélectionnez l'événement `checkout.session.completed`
   - Copiez la clé de signature du webhook dans `STRIPE_WEBHOOK_SECRET`

5. **Déployer les fonctions Edge**
   ```bash
   supabase functions deploy create-checkout
   supabase functions deploy stripe-webhook
   ```

## Configuration de Google Ads

1. **Créer un compte Google AdSense**
   - Rendez-vous sur [Google AdSense](https://www.google.com/adsense)
   - Créez un compte et attendez la validation

2. **Configurer les publicités récompensées**
   - Dans AdSense, allez dans Annonces > Vue d'ensemble
   - Créez une nouvelle unité de publicité de type "Publicité récompensée"
   - Copiez l'ID de l'unité publicitaire

3. **Configuration des variables d'environnement**
   ```env
   VITE_GOOGLE_ADS_CLIENT_ID=votre_client_id
   VITE_GOOGLE_ADS_UNIT_ID=votre_unite_publicitaire_id
   ```

## Structure des données

### Tables Supabase
- `credit_transactions` : Historique des transactions de crédits
- `ads_history` : Historique des publicités visionnées
- `subscription_history` : Historique des abonnements

### Fonctions RPC
- `add_credits` : Ajoute des crédits au solde utilisateur
- `record_ad_view` : Enregistre une vue de publicité

## Sécurité

1. **Politiques RLS**
   - Les utilisateurs ne peuvent voir que leurs propres transactions
   - Seul le rôle service peut ajouter des crédits
   - Les transactions sont en lecture seule pour les utilisateurs

2. **Vérifications**
   - Validation du webhook Stripe avec la signature
   - Limite quotidienne de publicités par utilisateur
   - Vérification des montants et des crédits

## Tests

1. **Mode test Stripe**
   - Utilisez la carte `4242 4242 4242 4242` pour les tests
   - Date d'expiration : n'importe quelle date future
   - CVC : n'importe quels 3 chiffres

2. **Test des publicités**
   - En développement, une simulation de publicité est affichée
   - En production, les vraies publicités Google sont chargées

## Déploiement

1. **Préparation**
   ```bash
   # Déployer les migrations Supabase
   supabase db push

   # Déployer les fonctions Edge
   supabase functions deploy
   ```

2. **Variables de production**
   - Mettez à jour les variables d'environnement avec les clés de production
   - Activez le mode production dans Stripe
   - Configurez le webhook Stripe avec l'URL de production

## Dépannage

### Problèmes courants

1. **Erreur de paiement**
   - Vérifiez les logs Stripe dans le dashboard
   - Vérifiez les logs des fonctions Edge dans Supabase

2. **Publicités ne s'affichent pas**
   - Vérifiez que l'unité publicitaire est approuvée
   - Vérifiez les restrictions géographiques
   - Consultez la console Google AdSense

3. **Crédits non ajoutés**
   - Vérifiez les logs de la fonction webhook
   - Vérifiez les politiques RLS
   - Consultez l'historique des transactions

### Support

Pour toute question ou problème :
1. Consultez les logs Supabase
2. Vérifiez le dashboard Stripe
3. Contactez le support si nécessaire

## Maintenance

- Surveillez les métriques dans Stripe et AdSense
- Mettez à jour les dépendances régulièrement
- Faites des sauvegardes de la base de données
- Surveillez les taux de conversion et ajustez les prix si nécessaire
