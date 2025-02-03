import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User, Session, AuthError } from '@supabase/supabase-js';

interface AuthResponse {
  success: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleEmailAuth = async (
    email: string, 
    password: string, 
    isSignUp: boolean,
    isAdmin: boolean = false
  ): Promise<AuthResponse> => {
    try {
      let response;
      if (isSignUp) {
        response = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              is_admin: isAdmin
            }
          }
        });
      } else {
        response = await supabase.auth.signInWithPassword({ email, password });
      }

      if (response.error) {
        return {
          success: false,
          error: response.error.message
        };
      }

      // Si c'est une connexion, vérifier si l'utilisateur est admin
      if (!isSignUp && isAdmin) {
        const isActuallyAdmin = await checkAdminStatus(response.data.user?.id);
        if (!isActuallyAdmin) {
          await supabase.auth.signOut();
          return {
            success: false,
            error: "Accès non autorisé : vous n'êtes pas administrateur"
          };
        }
      }

      return {
        success: true,
        error: null
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Une erreur s'est produite"
      };
    }
  };

  const handleGithubAuth = async (): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github'
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        error: null
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Une erreur s'est produite"
      };
    }
  };

  const checkAdminStatus = async (userId: string | undefined): Promise<boolean> => {
    if (!userId) return false;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return data?.is_admin || false;
    } catch (err) {
      console.error('Error checking admin status:', err);
      return false;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    handleEmailAuth,
    handleGithubAuth,
    checkAdminStatus,
    signOut
  };
};