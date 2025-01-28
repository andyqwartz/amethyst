import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuth = async (type: 'login' | 'signup') => {
    try {
      setLoading(true);
      
      const { data, error } = type === 'login' 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;

      if (data.user) {
        toast({
          title: type === 'login' ? "Connexion réussie" : "Inscription réussie",
          description: "Vous allez être redirigé...",
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/20 to-secondary/20">
      <Card className="w-full max-w-md p-6 space-y-6 backdrop-blur-xl bg-background/80">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Bienvenue</h1>
          <p className="text-muted-foreground">Connectez-vous pour continuer</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            className="w-full" 
            onClick={() => handleAuth('login')}
            disabled={loading}
          >
            Se connecter
          </Button>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => handleAuth('signup')}
            disabled={loading}
          >
            S'inscrire
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;