import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error('Missing environment variable: VITE_SUPABASE_URL');
if (!supabaseAnonKey) throw new Error('Missing environment variable: VITE_SUPABASE_ANON_KEY');

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

export const checkSession = async (): Promise<{ session: NonNullable<Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']> }> => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Session check error:', error);
    throw error;
  }
  
  if (!session) {
    throw new Error('No authenticated user');
  }
  
  return { session };
};
