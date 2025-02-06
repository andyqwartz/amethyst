
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
  role
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
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

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

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

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
        username: profile.username || userId,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        subscription_tier: 'free',
        role: 'user',
        credits_balance: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(PROFILE_FIELDS)
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error creating profile:', error);
    return null;
  }
}
