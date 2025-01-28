import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { Checkbox } from "@/components/ui/checkbox";
import { Github, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuth = async (type: 'login' | 'signup') => {
    try {
      if (!email || !password) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);
      
      const { data, error } = type === 'login' 
        ? await supabase.auth.signInWithPassword({ 
            email, 
            password,
          })
        : await supabase.auth.signUp({ email, password });

      if (error) {
        toast({
          title: "Erreur d'authentification",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        if (!rememberMe) {
          await supabase.auth.setSession({
            access_token: data.session?.access_token || '',
            refresh_token: data.session?.refresh_token || '',
          });
        }

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

  const handleGithubAuth = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: 'https://hyplbzvyvbcjzpioemay.supabase.co/auth/v1/callback',
        }
      });

      if (error) {
        toast({
          title: "Erreur de connexion GitHub",
          description: "Impossible de se connecter avec GitHub. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion avec GitHub",
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
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGithubAuth}
            disabled={loading}
          >
            <Github className="mr-2 h-4 w-4" />
            Continuer avec Github
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continuez avec
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Se souvenir de moi
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            className="w-full" 
            onClick={() => handleAuth('login')}
            disabled={loading}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Entrer dans le portail Amethyst
          </Button>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => handleAuth('signup')}
            disabled={loading}
          >
            Créer un compte
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
