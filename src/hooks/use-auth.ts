import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

interface AuthResponse {
  success: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const checkAdminStatus = async (userId: string | undefined): Promise<boolean> => {
    if (!userId) return false;
    console.log("Vérification admin pour:", userId);

    try {
      const { data, error } = await supabase
        .rpc('check_admin_status', {
          user_id: userId
        });

      if (error) {
        console.error('Erreur check_admin_status:', error);
        return false;
      }

      console.log("Résultat check_admin_status:", data);
      return !!data;
    } catch (err) {
      console.error('Erreur check_admin_status:', err);
      return false;
    }
  };

  // Effet pour initialiser l'authentification
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("Initialisation de l'auth...");
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        
        if (mounted) {
          console.log("Session récupérée:", currentUser?.id);
          setUser(currentUser);
          
          if (currentUser) {
            const adminStatus = await checkAdminStatus(currentUser.id);
            console.log("Statut admin initial:", adminStatus);
            setIsAdmin(adminStatus);
            if (adminStatus) {
              navigate('/admin');
            }
          }
        }
      } catch (error) {
        console.error('Erreur initialisation auth:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      const currentUser = session?.user ?? null;
      console.log("Changement d'état auth:", currentUser?.id);
      setUser(currentUser);
      
      if (currentUser) {
        const adminStatus = await checkAdminStatus(currentUser.id);
        console.log("Nouveau statut admin:", adminStatus);
        setIsAdmin(adminStatus);
        if (adminStatus) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
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
    try {
      console.log(`Tentative de ${isSignUp ? 'création de compte' : 'connexion'} pour:`, email);
      
      let response;
      if (isSignUp) {
        // Vérifier si l'email existe déjà
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single();

        if (existingUser) {
          return {
            success: false,
            error: "Un compte existe déjà avec cet email"
          };
        }

        // Créer l'utilisateur
        response = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email.split('@')[0],
              avatar_url: null,
              language: 'Français',
              theme: 'light'
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });

        // Check if the user is banned
        const { data: bannedUser } = await supabase
          .from('banned_users')
          .select('id')
          .eq('email', email)
          .single();

        if (bannedUser) {
          return {
            success: false,
            error: "This email is banned from creating an account."
          };
        }
        console.log('Réponse création de compte:', response);

        if (response.error) {
          console.error('Erreur création de compte:', response.error);
          return {
            success: false,
            error: response.error.message
          };
        }

        if (response.data?.user) {
          console.log('Utilisateur créé avec succès:', response.data.user);

          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: response.data.user.id,
              email: response.data.user.email,
              full_name: email.split('@')[0],
              avatar_url: null,
              language: 'Français',
              theme: 'light',
              provider_id: user?.app_metadata.provider_id || 'email', // Updated line to handle null case
            });

          if (profileError) {
            console.error('Erreur création profil:', profileError);
            return {
              success: false,
              error: profileError.message
            };
          }

          return {
            success: true,
            error: "Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception."
          };
        }

        return {
          success: false,
          error: "Erreur inconnue lors de la création de l'utilisateur."
        };
      } else {
        response = await supabase.auth.signInWithPassword({ email, password });
        
        console.log('Réponse connexion:', response);
        
        if (response.error) {
          console.error('Erreur connexion:', response.error);
          return {
            success: false,
            error: response.error.message
          };
        }

        if (response.data?.user) {
          const adminStatus = await checkAdminStatus(response.data.user.id);
          console.log('Statut admin après connexion:', adminStatus);
          setIsAdmin(adminStatus);
          if (adminStatus) {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }

        return {
          success: true,
          error: null
        };
      }
    } catch (err) {
      console.error('Erreur inattendue:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Une erreur s'est produite"
      };
    }
  };

  const handleGithubAuth = async (): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
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

  const handleGoogleAuth = async (): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
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

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    navigate('/auth');
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
