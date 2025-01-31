// This file configures the Supabase client and provides authentication utilities.
import { createClient, type Session, AuthError, StorageError, User } from '@supabase/supabase-js';
import type { Database } from './types';

// Environment configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://hyplbzvyvbcjzpioemay.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cGxienZ5dmJjanpwaW9lbWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5ODU1MDMsImV4cCI6MjA1MzU2MTUwM30.Q15-zYFnwoc7TVnxUAQPCXCScGvEA97Strdz5AL0z_0";

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

// Enhanced error logging for Supabase operations
export const logSupabaseError = (
  error: AuthError | StorageError | null, 
  context: string, 
  type: 'auth' | 'storage' | 'database' = 'auth'
) => {
  if (error) {
    console.error(`Supabase ${type} Error [${context}]:`, {
      message: error.message,
      status: error.status,
      name: error.name,
      details: error.details,
      timestamp: new Date().toISOString(),
      stack: error.stack,
    });
    
    // Report to error monitoring service if available
    if (import.meta.env.PROD) {
      // TODO: Implement error reporting service integration
    }
  }
};

// Session management utilities
export const getUser = async (): Promise<User | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    logSupabaseError(error as AuthError, 'getUser');
    return null;
  }
};

export const refreshSession = async (): Promise<Session | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return session;
  } catch (error) {
    logSupabaseError(error as AuthError, 'refreshSession');
    return null;
  }
};

// Utility function to validate image upload
export const validateImageUpload = (file: File): boolean => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 10MB limit');
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG and WebP are supported');
  }
  
  return true;
};

// Connection health check utility
export const checkConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('health_check').select('*').limit(1);
    if (error) throw error;
    return true;
  } catch (error) {
    logSupabaseError(error as AuthError, 'connectionCheck', 'database');
    return false;
  }
};

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if there is an active authenticated session
 * @throws Error if no active session is found or if there's an authentication error
 * @returns The current session if authenticated
 */
export async function checkSession(): Promise<Session> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      logSupabaseError(error, 'checkSession', 'auth');
      throw new Error(`Authentication error: ${error.message}`);
    }
    
    if (!session) {
      const error = new Error('No active session found. Please authenticate first.');
      logSupabaseError(error as AuthError, 'checkSession-noSession', 'auth');
      throw error;
    }
    
    return session;
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error during session check:', error);
    throw new Error('Failed to verify authentication status. Please try again.');
  }
}

// Initialize Supabase client with enhanced configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: import.meta.env.DEV,
    storage: localStorage,
    storageKey: 'amethyst-auth-token',
    onAuthStateChange: (event, session) => {
      console.debug('Auth state changed:', event, session?.user?.id);
    }
  },
  global: {
    headers: {
      'Cache-Control': 'no-cache',
      'X-Client-Info': 'amethyst'
    },
  },
  storage: {
    retryAttempts: 3,
    multipartUploadThreshold: 5242880, // 5MB
    maxRetryDelay: 10000,
    retryInterval: 500
  },
  db: {
    schema: 'public'
  }
});

// Verify the client was initialized correctly and handle connection status
supabase.auth.onAuthStateChange((event, session) => {
  console.debug('Supabase auth state changed:', event, session ? 'Session exists' : 'No session');
  
  // Handle specific auth events
  switch (event) {
    case 'SIGNED_IN':
      console.debug('User signed in successfully');
      break;
    case 'SIGNED_OUT':
      console.debug('User signed out');
      break;
    case 'TOKEN_REFRESHED':
      console.debug('Session token refreshed');
      break;
    case 'USER_UPDATED':
      console.debug('User profile updated');
      break;
  }
});

// Initialize connection check
(async () => {
  if (import.meta.env.DEV) {
    const isConnected = await checkConnection();
    console.debug(`Supabase connection status: ${isConnected ? 'Connected' : 'Failed'}`);
    
    // Verify authentication setup
    const user = await getUser();
    console.debug('Initial auth state:', user ? 'Authenticated' : 'Not authenticated');
  }
})();

// Export additional utilities for external use
export const isAuthenticated = async (): Promise<boolean> => {
  const session = await checkSession();
  return !!session;
};
