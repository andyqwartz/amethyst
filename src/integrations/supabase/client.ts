import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hyplbzvyvbcjzpioemay.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  throw new Error('Missing Supabase anon key');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export const checkSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    throw error;
  }
  
  if (!session) {
    throw new Error('No authenticated user');
  }
  
  return { session };
};