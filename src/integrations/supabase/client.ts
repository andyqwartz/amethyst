import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = 'https://hyplbzvyvbcjzpioemay.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cGxienZ5dmJjanpwaW9lbWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4OTQxNjAsImV4cCI6MjAyMjQ3MDE2MH0.0Oi0JQvmqVJYOE4Dj2zFBHUEfwEBYWV-YcNBB_5Vxmg';

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing Supabase anon key');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
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