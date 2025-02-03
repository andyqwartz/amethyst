import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/database';
import { PostgrestError } from '@supabase/supabase-js';

const PROFILE_FIELDS = "id,username,full_name,avatar_url,credits,total_generations,subscription_tier,subscription_expires_at,created_at,updated_at,role";

function validateProfileData(data: unknown): data is Profile {
  if (!data || typeof data !== 'object') return false;
  const profile = data as Record<string, unknown>;
  return (
    typeof profile.id === 'string' &&
    typeof profile.username === 'string' &&
    typeof profile.created_at === 'string' &&
    typeof profile.updated_at === 'string'
  );
}

export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser.user) {
      console.error('Utilisateur non authentifié');
      return null;
    }

    // Utilisation d'une chaîne sur une seule ligne pour éviter les problèmes de formatage
    const { data, error } = await supabase
      .from('profiles')
      .select(PROFILE_FIELDS)
      .eq('id', userId)
      .limit(1)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erreur inattendue lors de la récupération du profil:', error);
    return null;
  }
}

export async function updateProfile(
  userId: string, 
  updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'credits' | 'total_generations'>>
): Promise<Profile | null> {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser.user) {
      console.error('Utilisateur non authentifié');
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select(PROFILE_FIELDS)
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erreur inattendue lors de la mise à jour du profil:', error);
    return null;
  }
}

export async function createProfile(
  userId: string, 
  profile: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'credits' | 'total_generations'>>
): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: profile.username || userId,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        subscription_tier: 'free',
        role: 'user',
        credits: 100,
        total_generations: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(PROFILE_FIELDS)
      .single();

    if (error) {
      console.error('Erreur lors de la création du profil:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erreur inattendue lors de la création du profil:', error);
    return null;
  }
} 