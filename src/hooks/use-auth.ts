import { useState, useEffect } from 'react';
import { getSupabaseClient, handleAuthError } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AuthResponse {
  success: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const supabase = getSupabaseClient();

  const checkAdminStatus = async (userId: string | undefined): Promise<boolean> => {
    console.log('Checking admin status for user:', userId);
    if (!userId) return false;
    try {
      const { data, error } = await supabase
        .rpc('check_admin_status', {
          user_id: userId
        });

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      console.log('Admin status result:', data);
      return !!data;
    } catch (err) {
      console.error('Error in checkAdminStatus:', err);
      return false;
    }
  };

  const checkEmailStatus = async (email: string) => {
    console.log('Checking email status for:', email);
    try {
      const { data, error } = await supabase
        .rpc('check_email_status', { check_email: email });

      if (error) {
        console.error('Error checking email status:', error);
        throw error;
      }

      console.log('Email status result:', data);
      return data?.[0] || { exists_in_auth: false, is_banned: false };
    } catch (err) {
      console.error('Error in checkEmailStatus:', err);
      throw err;
    }
  };

  const createProfile = async (userId: string, email: string, metadata: any) => {
    console.log('Creating profile for user:', userId, 'with metadata:', metadata);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          email,
          full_name: metadata.full_name || email.split('@')[0],
          avatar_url: metadata.avatar_url,
          language: metadata.language || 'Français',
          theme: metadata.theme || 'light',
          credits_balance: 0,
          lifetime_credits: 0,
          subscription_tier: 'free',
          subscription_status: 'inactive',
          ads_enabled: true,
          ads_watched_today: 0,
          daily_ads_limit: 5,
          ads_credits_earned: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }

      console.log('Profile created successfully:', data);
      return data;
    } catch (err) {
      console.error('Error in createProfile:', err);
      throw err;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      console.log('Initializing auth state');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          return;
        }

        if (mounted && session?.user) {
          console.log('Found existing session for user:', session.user.id);
          setUser(session.user);
          const adminStatus = await checkAdminStatus(session.user.id);
          setIsAdmin(adminStatus);
          if (adminStatus) {
            navigate('/admin');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in:', session.user.id);
        setUser(session.user);
        const adminStatus = await checkAdminStatus(session.user.id);
        setIsAdmin(adminStatus);
        if (adminStatus) {
          navigate('/admin');
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
        setIsAdmin(false);
        navigate('/auth');
      }
      
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleEmailAuth = async (
    email: string, 
    password: string, 
    isSignUp: boolean
  ): Promise<AuthResponse> => {
    console.log(`Starting ${isSignUp ? 'sign up' : 'sign in'} process for email:`, email);
    try {
      setIsLoading(true);

      if (isSignUp) {
        console.log('Checking email status before sign up');
        const emailStatus = await checkEmailStatus(email);

        if (emailStatus.exists_in_auth) {
          throw new Error("Un compte existe déjà avec cet email");
        }

        if (emailStatus.is_banned) {
          throw new Error("Cet email n'est pas autorisé à créer un compte");
        }

        console.log('Email status check passed, proceeding with sign up');
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: email.split('@')[0],
              avatar_url: null,
              language: 'Français',
              theme: 'light'
            }
          }
        });

        if (error) {
          console.error('Sign up error:', error);
          throw error;
        }

        if (data.user) {
          console.log('User created successfully:', data.user.id);
          await createProfile(data.user.id, email, data.user.user_metadata);
        }

        toast({
          title: "Inscription réussie",
          description: "Un email de confirmation vous a été envoyé"
        });

        return { success: true, error: null };
      } else {
        // Try to sign in multiple times in case of temporary 500 error
        let attempts = 0;
        const maxAttempts = 3;
        let lastError;

        while (attempts < maxAttempts) {
          try {
            console.log(`Sign in attempt ${attempts + 1} of ${maxAttempts}`);
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password
            });

            if (!error) {
              if (data?.user) {
                console.log('Sign in successful for user:', data.user.id);
                const emailStatus = await checkEmailStatus(email);

                if (emailStatus.is_banned) {
                  console.log('User is banned, signing out');
                  await supabase.auth.signOut();
                  throw new Error("Votre compte a été suspendu");
                }

                toast({
                  title: "Connexion réussie",
                  description: "Bienvenue !"
                });

                return { success: true, error: null };
              }
              break;
            }

            if (error.status !== 500) {
              console.error('Non-500 error during sign in:', error);
              throw error;
            }

            console.log('Got 500 error, will retry');
            lastError = error;
            attempts++;
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          } catch (error) {
            if (error instanceof Error && error.message !== "Le service d'authentification est temporairement indisponible") {
              throw error;
            }
            lastError = error;
            attempts++;
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }

        if (lastError) {
          console.error('All sign in attempts failed:', lastError);
          throw lastError;
        }

        throw new Error("Erreur inconnue lors de la connexion");
      }
    } catch (error) {
      console.error('Auth error:', error);
      const message = handleAuthError(error);
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive"
      });
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubAuth = async (): Promise<AuthResponse> => {
    console.log('Starting GitHub auth');
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('GitHub auth error:', error);
      const message = handleAuthError(error);
      toast({
        title: "Erreur GitHub",
        description: message,
        variant: "destructive"
      });
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async (): Promise<AuthResponse> => {
    console.log('Starting Google auth');
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Google auth error:', error);
      const message = handleAuthError(error);
      toast({
        title: "Erreur Google",
        description: message,
        variant: "destructive"
      });
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    console.log('Starting sign out');
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setIsAdmin(false);
      navigate('/auth');
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !"
      });
    } catch (error) {
      console.error('Sign out error:', error);
      const message = handleAuthError(error);
      toast({
        title: "Erreur de déconnexion",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isAdmin,
    isAuthenticated: !!user,
    handleEmailAuth,
    handleGithubAuth,
    handleGoogleAuth,
    checkAdminStatus,
    signOut
  };
};
