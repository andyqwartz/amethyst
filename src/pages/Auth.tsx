import { useState, KeyboardEvent } from 'react';
import { Card } from "@/components/ui/card";
import { useAuth } from '@/hooks/use-auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, Github, Sparkles, Globe, Mail, Lock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const AuthHeader = () => (
  <div className="space-y-6 text-center">
    <div className="space-y-2">
      <h1 className="text-5xl font-bold tracking-tight">
        <span className="text-white drop-shadow-[0_0_30px_rgba(167,139,250,0.5)]">✧</span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 drop-shadow-[0_0_15px_rgba(167,139,250,0.3)]">Amethyst</span>
        <span className="text-white drop-shadow-[0_0_30px_rgba(167,139,250,0.5)]">✧</span>
      </h1>
      <p className="text-xl font-light">
        <span className="text-purple-200/90">Bienvenue sur le portail</span>
      </p>
    </div>
    <p className="text-purple-300/60 text-base font-medium tracking-wide uppercase">
      Créez • Explorez • Imaginez
    </p>
  </div>
);

const GithubButton = ({ onClick, disabled }: { onClick: () => void, disabled: boolean }) => (
  <Button 
    variant="outline" 
    className="w-full relative overflow-hidden transition-all duration-300 hover:bg-purple-900/20 hover:border-purple-300/50" 
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

const GoogleButton = ({ onClick, disabled }: { onClick: () => void, disabled: boolean }) => (
  <Button 
    variant="outline" 
    className="w-full relative overflow-hidden transition-all duration-300 hover:bg-purple-900/20 hover:border-purple-300/50" 
    onClick={onClick}
    disabled={disabled}
  >
    {disabled ? (
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    ) : (
      <Globe className="mr-2 h-4 w-4" />
    )}
    Continuer avec Google
  </Button>
);

const Divider = () => (
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <Separator className="bg-purple-300/20" />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-background/50 px-2 text-purple-200/60">
        Ou continuez avec
      </span>
    </div>
  </div>
);

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { isLoading, handleEmailAuth, handleGithubAuth, handleGoogleAuth } = useAuth();
  const { toast } = useToast();

  const handleGithubSignIn = async () => {
    if (isLoading) return;
    await handleGithubAuth();
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    await handleGoogleAuth();
  };

  const handleAuthAction = async (type: 'login' | 'signup') => {
    if (isLoading) return;

    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères"
      });
      return;
    }

    await handleEmailAuth(email, password, type === 'signup');
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && email && password && !isLoading) {
      handleAuthAction('login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1a103d_0%,_#0d0621_100%)]"></div>
      <div className="absolute inset-0 bg-purple-900/20 animate-pulse-slowest"></div>
      
      {/* Portal Effect Rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-purple-300/10 animate-pulse-slow"></div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-purple-300/10 animate-pulse-slower"></div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-purple-300/10 animate-pulse-slowest"></div>

      <Card className="w-full max-w-md p-8 space-y-8 relative backdrop-blur-xl bg-background/30 border-purple-300/20 shadow-2xl shadow-purple-900/20">
        <AuthHeader />
        
        <div className="space-y-4">
          <GithubButton onClick={handleGithubSignIn} disabled={isLoading} />
          <GoogleButton onClick={handleGoogleSignIn} disabled={isLoading} />
          <Divider />
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-100">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-200/50 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="pl-10 bg-background/30 border-purple-300/30 focus:border-purple-300/50 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-purple-100">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-200/50 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="pl-10 pr-10 bg-background/30 border-purple-300/30 focus:border-purple-300/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-200/50 hover:text-purple-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isLoading}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium text-purple-200/80 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Se souvenir de moi
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            className="w-full bg-purple-300 hover:bg-purple-200 text-purple-950 font-medium shadow-lg transition-all duration-300" 
            onClick={() => handleAuthAction('login')}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-5 w-5" />
            )}
            Entrer dans le portail
          </Button>
          <Button 
            className="w-full bg-background/30 hover:bg-purple-900/20 border-purple-300/30 hover:border-purple-300/50 transition-all duration-300" 
            variant="outline"
            onClick={() => handleAuthAction('signup')}
            disabled={isLoading || !email || !password}
          >
            Créer un nouveau compte
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
