import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card } from "@/components/ui/card";
import { useAuth } from '@/hooks/use-auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Checkbox } from "@/components/ui/checkbox";
import { Github, Sparkles, Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const AuthHeader = () => (
  <div className="space-y-2 text-center">
    <h1 className="text-3xl font-bold">Bienvenue</h1>
    <p className="text-muted-foreground">Connectez-vous pour continuer</p>
  </div>
);

const GithubButton = ({ onClick, disabled }: { onClick: () => void, disabled: boolean }) => (
  <Button 
    variant="outline" 
    className="w-full" 
    onClick={onClick}
    disabled={disabled}
  >
    {disabled ? (
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    ) : (
      <Github className="mr-2 h-4 w-4" />
    )}
    Continuer avec Github
  </Button>
);

const Divider = () => (
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
);

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isLoading, handleEmailAuth, handleGithubAuth, checkAdminStatus } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Vérifier si l'utilisateur est un admin
        const isUserAdmin = await checkAdminStatus(session.user.id);
        if (isUserAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
        
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate, toast, checkAdminStatus]);

  const handleGithubSignIn = async () => {
    try {
      const response = await handleGithubAuth();
      if (!response.success) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: response.error || "Une erreur s'est produite"
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la connexion"
      });
      console.error('Github auth error:', err);
    }
  };

  const handleAuthAction = async (type: 'login' | 'signup') => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs"
      });
      return;
    }

    try {
      const response = await handleEmailAuth(email, password, type === 'signup', isAdmin);
      if (!response.success) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: response.error || "Une erreur s'est produite"
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'authentification"
      });
      console.error('Email auth error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/20 to-secondary/20">
      <Card className="w-full max-w-md p-6 space-y-6 backdrop-blur-xl bg-background/80">
        <AuthHeader />
        
        <div className="space-y-4">
          <GithubButton onClick={handleGithubSignIn} disabled={isLoading} />
          <Divider />
          
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
            <div className="flex items-center justify-between">
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
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="admin" 
                  checked={isAdmin}
                  onCheckedChange={(checked) => setIsAdmin(checked as boolean)}
                />
                <label
                  htmlFor="admin"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Admin
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            className="w-full" 
            onClick={() => handleAuthAction('login')}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isAdmin ? "Accès Administration" : "Entrer dans le portail Amethyst"}
          </Button>
          {!isAdmin && (
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleAuthAction('signup')}
              disabled={isLoading || !email || !password}
            >
              Créer un compte
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Auth;