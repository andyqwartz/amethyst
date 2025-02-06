
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/database';
import { PostgrestError } from '@supabase/supabase-js';

const PROFILE_FIELDS = `
  id,
  email,
  username,
  full_name,
  avatar_url,
  auth_provider,
  provider_id,
  google_id,
  apple_id,
  github_id,
  stripe_customer_id,
  phone_number,
  language,
  theme,
  is_admin,
  is_banned,
  email_verified,
  phone_verified,
  needs_attention,
  notifications_enabled,
  marketing_emails_enabled,
  ads_enabled,
  subscription_tier,
  subscription_status,
  subscription_end_date,
  credits_balance,
  lifetime_credits,
  ads_credits_earned,
  ads_watched_today,
  daily_ads_limit,
  created_at,
  updated_at,
  last_sign_in_at,
  last_credit_update,
  ads_last_watched,
  last_login
`;

export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser.user) {
      console.error('User not authenticated');
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select(PROFILE_FIELDS)
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Unexpected error fetching profile:', error);
    return null;
  }
}

export async function updateProfile(
  userId: string, 
  updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'credits_balance' | 'total_generations'>>
): Promise<Profile | null> {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser.user) {
      console.error('User not authenticated');
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

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Unexpected error updating profile:', error);
    return null;
  }
}

export async function createProfile(
  userId: string, 
  profile: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'credits_balance' | 'total_generations'>>
): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: profile.email,
        username: profile.email ? profile.email.split('@')[0] : userId,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        subscription_tier: 'free',
        credits_balance: 100,
        last_credit_update: new Date().toISOString(),
        ads_last_watched: null,
        last_login: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(PROFILE_FIELDS)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Unexpected error creating profile:', error);
    return null;
  }
}
