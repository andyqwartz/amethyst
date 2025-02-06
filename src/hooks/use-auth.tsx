
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { useToast } from './use-toast';

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
        const { error } = await supabase.auth.signUp({
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
          if (error.status === 503) {
            throw new Error("Le service d'authentification est temporairement indisponible. Veuillez réessayer dans quelques minutes.");
          }
          throw error;
        }

        toast({
          title: "Inscription réussie",
          description: "Un email de confirmation vous a été envoyé"
        });

        return { success: true, error: null };
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          if (error.status === 503) {
            throw new Error("Le service d'authentification est temporairement indisponible. Veuillez réessayer dans quelques minutes.");
          }
          if (error.message === 'Invalid login credentials') {
            throw new Error("Email ou mot de passe incorrect");
          }
          throw error;
        }

        toast({
          title: "Connexion réussie",
          description: "Bienvenue !"
        });

        return { success: true, error: null };
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      return { success: false, error: error.message };
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
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Erreur de déconnexion",
        description: error.message,
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
    signOut
  };
};
