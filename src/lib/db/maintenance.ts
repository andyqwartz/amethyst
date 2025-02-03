import { supabase } from '@/lib/supabase';

/**
 * Maintient les index vectoriels pour optimiser les performances de recherche
 */
export async function maintainVectorIndexes() {
  const { error } = await supabase.rpc('maintain_vector_indexes');
  
  if (error) {
    console.error('Erreur lors de la maintenance des index vectoriels:', error);
    throw error;
  }
}

/**
 * Analyse l'utilisation des index pour identifier ceux qui sont peu utilisés
 */
export async function analyzeIndexUsage() {
  const { data, error } = await supabase
    .from('pg_stat_user_indexes')
    .select('*')
    .order('idx_scan', { ascending: false });

  if (error) {
    console.error('Erreur lors de l\'analyse des index:', error);
    throw error;
  }

  return data;
}

/**
 * Vérifie la santé des index vectoriels
 */
export async function checkVectorIndexHealth() {
  const { data, error } = await supabase.rpc('check_vector_index_health');
  
  if (error) {
    console.error('Erreur lors de la vérification des index vectoriels:', error);
    throw error;
  }

  return data;
} 