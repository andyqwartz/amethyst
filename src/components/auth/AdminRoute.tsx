import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous devez être connecté pour accéder à cette page"
      });
    } else if (!isLoading && !isAdmin) {
      navigate('/');
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les droits d'administration nécessaires"
      });
    }
  }, [isAdmin, isLoading, isAuthenticated, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}; 