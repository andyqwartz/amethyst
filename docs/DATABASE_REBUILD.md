# Guide de Restructuration de la Base de Données Amethyst

## Table des Matières
1. [Sauvegarde et Préparation](#sauvegarde-et-préparation)
2. [Structure de la Base de Données](#structure-de-la-base-de-données)
3. [Système d'Authentification](#système-dauthentification)
4. [Gestion des Crédits](#gestion-des-crédits)
5. [Ordre d'Application des Migrations](#ordre-dapplication-des-migrations)

## Sauvegarde et Préparation

### 1. Sauvegarde
```bash
# Sauvegarde complète de la base de données
pg_dump -h db.hyplbzvyvbcjzpioemay.supabase.co -U postgres -d postgres -F c -f backup_complet.sql
```

### 2. Vérification des Dépendances
- PostgreSQL 14+
- Extension pgvector pour les embeddings
- Extension pg_cron pour les tâches planifiées

## Structure de la Base de Données

### Tables Principales

#### profiles
- Gestion des utilisateurs et des profils
- Intégration avec auth.users
- Gestion des crédits et abonnements

#### images
- Stockage des images générées et de référence
- Métadonnées et analyse d'images
- Intégration avec le système de stockage

#### credit_transactions
- Historique des transactions de crédits
- Suivi des achats et récompenses publicitaires
- Intégration avec Stripe

### Fonctions Essentielles

#### Authentification
```sql
-- Création automatique de profil
CREATE OR REPLACE FUNCTION create_profile_on_signup()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (
        id, email, is_admin, /* ... */
    )
    VALUES (
        new.id, new.email, false, /* ... */
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### Gestion des Crédits
```sql
-- Ajout de crédits
CREATE OR REPLACE FUNCTION add_credits(
    user_id UUID,
    amount INTEGER,
    source TEXT,
    description TEXT DEFAULT NULL
)
RETURNS void AS $$
/* ... */
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Système d'Authentification

### Simplification du Processus
1. Inscription utilisateur via auth.users
2. Création automatique du profil
3. Gestion des rôles simplifiée (user/admin)

### Sécurité
- RLS (Row Level Security) sur toutes les tables
- Vérification des permissions par fonction
- Protection contre les injections SQL

## Gestion des Crédits

### Sources de Crédits
1. Achats via Stripe
2. Visionnage de publicités
3. Actions système (bonus, récompenses)

### Publicités
- Limite quotidienne : 10 vues
- Récompenses :
  * 2 crédits pour 30+ secondes
  * 1 crédit pour 15-29 secondes
  * 0 crédit pour <15 secondes

## Ordre d'Application des Migrations

### 1. Réinitialisation et Structure (20250206151141_reset_and_enhance_database.sql)
```bash
psql -h db.hyplbzvyvbcjzpioemay.supabase.co -U postgres -d postgres -f supabase/migrations/20250206151141_reset_and_enhance_database.sql
```
- Préserve la structure des tables
- Sauvegarde les admins
- Ajoute l'analyse d'images

### 2. Nettoyage (20250206151056_cleanup_duplicate_tables.sql)
```bash
psql -h db.hyplbzvyvbcjzpioemay.supabase.co -U postgres -d postgres -f supabase/migrations/20250206151056_cleanup_duplicate_tables.sql
```
- Supprime les tables en double
- Optimise les index

### 3. Auth et Crédits (20250206151737_simplify_auth_and_credits.sql)
```bash
psql -h db.hyplbzvyvbcjzpioemay.supabase.co -U postgres -d postgres -f supabase/migrations/20250206151737_simplify_auth_and_credits.sql
```
- Simplifie l'authentification
- Améliore la gestion des crédits

### 4. Sécurité (20250206151812_setup_rls_policies.sql)
```bash
psql -h db.hyplbzvyvbcjzpioemay.supabase.co -U postgres -d postgres -f supabase/migrations/20250206151812_setup_rls_policies.sql
```
- Configure les politiques RLS
- Définit les permissions

### 5. Configuration Finale (20250206152129_final_database_setup.sql)
```bash
psql -h db.hyplbzvyvbcjzpioemay.supabase.co -U postgres -d postgres -f supabase/migrations/20250206152129_final_database_setup.sql
```
- Vérifie toutes les fonctions
- Active les triggers
- Configure les notifications

## Vérification Post-Migration

### 1. Vérification des Fonctions
```sql
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname IN ('is_admin', 'add_credits', 'handle_ad_view');
```

### 2. Vérification des Triggers
```sql
SELECT tgname, tgrelid::regclass AS table_name
FROM pg_trigger
WHERE NOT tgisinternal;
```

### 3. Vérification RLS
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### 4. Test des Fonctionnalités
1. Création d'un nouvel utilisateur
2. Attribution de crédits
3. Visionnage de publicité
4. Vérification des transactions

## Points Importants

### Authentification
- Système simplifié avec création automatique de profil
- Pas de complexité inutile dans la gestion des rôles
- Vérification claire des permissions

### Crédits et Publicités
- Système robuste de gestion des crédits
- Limites quotidiennes sur les publicités
- Historique complet des transactions

### Sécurité
- RLS sur toutes les tables
- Fonctions SECURITY DEFINER
- Vérification des permissions par fonction

### Performance
- Index optimisés
- Triggers efficaces
- Nettoyage automatique des données temporaires

## Maintenance

### Tâches Quotidiennes
- Reset des compteurs de publicités à minuit
- Vérification des transactions en erreur
- Mise à jour des statistiques

### Tâches Hebdomadaires
- Analyse des performances
- Vérification des index
- Nettoyage des données temporaires

### Tâches Mensuelles
- Archivage des anciennes transactions
- Optimisation de la base de données
- Vérification des sauvegardes

## Support et Dépannage

### Problèmes Courants
1. Erreur de création de profil
   ```sql
   -- Vérification du trigger
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

2. Problème de crédits
   ```sql
   -- Vérification des transactions
   SELECT * FROM credit_transactions 
   WHERE created_at > now() - interval '1 day'
   ORDER BY created_at DESC;
   ```

3. Erreur d'authentification
   ```sql
   -- Vérification du profil
   SELECT * FROM profiles 
   WHERE email = 'user@example.com';
   ```

### Contact Support
Pour toute assistance supplémentaire :
- Email : support@amethyst.ai
- Documentation : docs.amethyst.ai
- GitHub : github.com/amethyst/database-issues
