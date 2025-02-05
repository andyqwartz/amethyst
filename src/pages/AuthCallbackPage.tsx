import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Récupérer la session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Erreur de récupération de session:', error);
          navigate('/auth', { replace: true });
          return;
        }

        if (!session) {
          navigate('/auth', { replace: true });
          return;
        }

        // Vérifier si le profil existe
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Erreur de récupération du profil:', profileError);
          // Attendre un peu et réessayer une fois
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const { data: retryProfile, error: retryError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (retryError) {
            console.error('Erreur de récupération du profil (retry):', retryError);
            navigate('/auth', { replace: true });
            return;
          }

          if (!retryProfile) {
            navigate('/auth', { replace: true });
            return;
          }
        }

        // Rediriger vers la page d'accueil
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Erreur inattendue:', err);
        navigate('/auth', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Redirection en cours...</p>
    </div>
  );
}; 