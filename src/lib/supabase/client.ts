import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    console.log('Initializing Supabase client');
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error(
        'Configuration Supabase manquante. Assurez-vous d\'avoir un fichier .env avec :\n' +
        'VITE_SUPABASE_URL=votre_url_projet\n' +
        'VITE_SUPABASE_ANON_KEY=votre_clé_anon'
      );
      // Return a mock client that throws descriptive errors
      return createClient('https://example.com', 'mock-key', {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      });
    }

    console.log('Creating Supabase client with URL:', supabaseUrl);
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        debug: true,
        storage: window.localStorage,
        storageKey: 'supabase.auth.token'
      },
      global: {
        headers: {
          'X-Client-Info': 'supabase-js-v2'
        }
      }
    });

    // Add auth state change logging
    supabaseInstance.auth.onAuthStateChange((event, session) => {
      console.group('Auth State Change');
      console.log('Event:', event);
      console.log('Session:', session ? {
        id: session.user?.id,
        email: session.user?.email,
        role: session.user?.role,
        metadata: session.user?.user_metadata,
        lastSignIn: session.user?.last_sign_in_at,
        expiresAt: session.expires_at
      } : null);

      if (event === 'SIGNED_IN') {
        console.log('User signed in successfully');
        console.log('Access token:', session?.access_token ? 'Present' : 'Missing');
        console.log('Refresh token:', session?.refresh_token ? 'Present' : 'Missing');
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        console.log('Clearing auth data from storage');
        localStorage.removeItem('supabase.auth.token');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Auth tokens refreshed');
      } else if (event === 'USER_UPDATED') {
        console.log('User data updated');
      }

      // Log any errors in user metadata
      if (session?.user?.user_metadata?.error) {
        console.error('User metadata error:', session.user.user_metadata.error);
      }

      console.groupEnd();
    });

    // Log initial session state
    supabaseInstance.auth.getSession().then(({ data: { session }, error }) => {
      console.group('Initial Session State');
      if (error) {
        console.error('Error getting session:', error);
      } else if (session) {
        console.log('Active session found:', {
          userId: session.user?.id,
          email: session.user?.email,
          role: session.user?.role
        });
      } else {
        console.log('No active session');
      }
      console.groupEnd();
    });
  }
  return supabaseInstance;
};

export const supabase = getSupabaseClient();

export const checkSession = async () => {
  console.group('Session Check');
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Session error:', error);
      throw error;
    }
    if (!session) {
      console.log('No active session found');
      throw new Error('Aucune session active');
    }
    console.log('Active session found for user:', {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
      lastSignIn: session.user.last_sign_in_at
    });
    return session;
  } catch (error) {
    console.error('Error checking session:', error);
    throw new Error('Erreur d\'authentification. Veuillez vous reconnecter.');
  } finally {
    console.groupEnd();
  }
};

// Add helper function for handling auth errors
export const handleAuthError = (error: any) => {
  console.group('Auth Error Handler');
  console.log('Original error:', error);
  let message: string;

  if (error.message?.includes('Email not confirmed')) {
    message = 'Veuillez confirmer votre email avant de vous connecter';
  } else if (error.message?.includes('Invalid login credentials')) {
    message = 'Email ou mot de passe incorrect';
  } else if (error.status === 500) {
    message = 'Le service d\'authentification est temporairement indisponible';
  } else {
    message = error.message || 'Une erreur s\'est produite';
  }

  console.log('Translated error message:', message);
  console.groupEnd();
  return message;
};
