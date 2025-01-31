import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from "@/components/ui/card";
import { useAuth } from '@/hooks/use-auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Checkbox } from "@/components/ui/checkbox";
import { Github, Sparkles } from "lucide-react";
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

const AuthForm = ({
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
}: {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
}) => (
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
);

const AuthButtons = ({
  onLogin,
  onSignup,
  disabled,
}: {
  onLogin: () => void;
  onSignup: () => void;
  disabled: boolean;
}) => (
  <div className="space-y-4">
    <Button 
      className="w-full" 
      onClick={onLogin}
      disabled={disabled}
    >
      <Sparkles className="mr-2 h-4 w-4" />
      Entrer dans le portail Amethyst
    </Button>
    <Button 
      className="w-full" 
      variant="outline"
      onClick={onSignup}
      disabled={disabled}
    >
      Créer un compte
    </Button>
  </div>
);

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { isLoading, handleEmailAuth, handleGithubAuth } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/dashboard');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleGithubSignIn = async () => {
    try {
      const { error } = await handleGithubAuth();
      if (error) {
        toast({
          title: "Erreur d'authentification",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur inattendue",
        description: "Une erreur s'est produite lors de la connexion",
        variant: "destructive",
      });
    }
  };

  const handleAuthAction = async (type: 'login' | 'signup') => {
    try {
      const { error } = await handleEmailAuth(email, password, type === 'signup');
      if (error) {
        toast({
          title: "Erreur d'authentification",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur inattendue",
        description: "Une erreur s'est produite lors de l'authentification",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/20 to-secondary/20">
      <Card className="w-full max-w-md p-6 space-y-6 backdrop-blur-xl bg-background/80">
        <AuthHeader />
        
        <div className="space-y-4">
          <GithubButton onClick={handleGithubSignIn} disabled={isLoading} />
          <Divider />
          <AuthForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
          />
        </div>

        <AuthButtons
          onLogin={() => handleAuthAction('login')}
          onSignup={() => handleAuthAction('signup')}
          disabled={isLoading || !email || !password}
        />
      </Card>
    </div>
  );
};

export default Auth;
