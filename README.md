# Amethyst - Générateur d'images IA

## Configuration requise

1. **Variables d'environnement**
Créez un fichier `.env` à la racine du projet en vous basant sur `.env.example` :
```bash
# Supabase
VITE_SUPABASE_URL=votre_url_projet
VITE_SUPABASE_ANON_KEY=votre_clé_anon

# Stripe
VITE_STRIPE_PUBLIC_KEY=votre_clé_publique_stripe
```

2. **Base de données**
Exécutez les migrations dans l'ordre suivant :
```bash
# Structure de base
supabase/migrations/20250205183327_setup_base_tables.sql
supabase/migrations/20250205183347_fix_constraints.sql
supabase/migrations/20250205183401_final_setup.sql

# Système de crédits
supabase/migrations/20250205181725_setup_credit_system.sql
supabase/migrations/20250205181753_add_credit_columns.sql
supabase/migrations/20250205220000_add_credit_functions.sql

# Sécurité
supabase/migrations/20250205220100_fix_credit_policies.sql
supabase/migrations/20250205222400_fix_profile_trigger.sql
supabase/migrations/20250205191015_update_profile_policies.sql

# Stripe
supabase/migrations/20250205190128_add_stripe_customer_id_to_profiles.sql
```

## Installation

```bash
# Installation des dépendances
npm install

# Démarrage en développement
npm run dev

# Build pour la production
npm run build
```

## Structure du projet

- `/src/components/` - Composants React
  - `/admin/` - Interface d'administration
  - `/account/` - Pages du compte utilisateur
  - `/credits/` - Système de crédits et paiements
  - `/image-generator/` - Générateur d'images

- `/src/lib/` - Utilitaires et configurations
  - `/supabase/` - Client et hooks Supabase
  - `/stripe.ts` - Configuration Stripe

- `/src/pages/` - Pages principales
  - `/account/` - Pages du compte (paramètres, sécurité, etc.)
  - `Auth.tsx` - Authentification
  - `Admin.tsx` - Administration

- `/supabase/` - Configuration Supabase
  - `/migrations/` - Migrations SQL
  - `/functions/` - Edge Functions

## Fonctionnalités

1. **Authentification**
   - Email/Mot de passe
   - Google OAuth
   - Vérification en deux étapes (à venir)

2. **Gestion des crédits**
   - Achat via Stripe
   - Gains par publicités
   - Historique des transactions

3. **Profil utilisateur**
   - Informations personnelles
   - Préférences
   - Sécurité
   - Abonnements

4. **Génération d'images**
   - Paramètres avancés
   - Images de référence
   - Historique des générations

## Développement

1. **Conventions de code**
   - TypeScript strict
   - ESLint + Prettier
   - Tests avec Vitest

2. **Base de données**
   - PostgreSQL via Supabase
   - Migrations versionnées
   - Politiques RLS

3. **Sécurité**
   - Authentification Supabase
   - Validation des données
   - Protection CSRF

## Déploiement

1. **Prérequis**
   - Node.js 18+
   - Base de données PostgreSQL
   - Compte Supabase
   - Compte Stripe

2. **Étapes**
   ```bash
   # Build
   npm run build
   
   # Migrations
   supabase db reset
   
   # Démarrage
   npm run start
