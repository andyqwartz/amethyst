
import { useState, KeyboardEvent } from 'react';
import { Card } from "@/components/ui/card";
import { useAuth } from '@/hooks/use-auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, Github, Globe, Mail, Lock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from '@/lib/supabase/client';
import { useNavigate } from 'react-router-dom';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailAuth = async (isSignUp: boolean) => {
    try {
      setIsLoading(true);

      const { error } = isSignUp 
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      toast({
        title: isSignUp ? "Compte créé" : "Connexion réussie",
        description: isSignUp 
          ? "Vérifiez votre email pour confirmer votre compte"
          : "Vous êtes maintenant connecté"
      });

      if (!isSignUp) navigate('/');
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('OAuth error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && email && password) {
      handleEmailAuth(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1a103d_0%,_#0d0621_100%)]"></div>
      <div className="absolute inset-0 bg-purple-900/20 animate-pulse-slowest"></div>
      
      {/* Portal Effect Rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-purple-300/10 animate-pulse-slow"></div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-purple-300/10 animate-pulse-slower"></div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-purple-300/10 animate-pulse-slowest"></div>

      <Card className="w-full max-w-md p-8 space-y-8 relative backdrop-blur-xl bg-background/30 border-purple-300/20 shadow-2xl shadow-purple-900/20">
        <div className="space-y-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            <span className="text-white drop-shadow-[0_0_30px_rgba(167,139,250,0.5)]">✧</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 drop-shadow-[0_0_15px_rgba(167,139,250,0.3)]">Amethyst</span>
            <span className="text-white drop-shadow-[0_0_30px_rgba(167,139,250,0.5)]">✧</span>
          </h1>
          <p className="text-xl font-light text-purple-200/90">Bienvenue sur le portail</p>
        </div>

        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full relative overflow-hidden transition-all duration-300 hover:bg-purple-900/20 hover:border-purple-300/50" 
            onClick={() => handleOAuthSignIn('github')}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Github className="mr-2 h-4 w-4" />
            )}
            Continuer avec Github
          </Button>

          <Button 
            variant="outline" 
            className="w-full relative overflow-hidden transition-all duration-300 hover:bg-purple-900/20 hover:border-purple-300/50" 
            onClick={() => handleOAuthSignIn('google')}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Globe className="mr-2 h-4 w-4" />
            )}
            Continuer avec Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="bg-purple-300/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background/50 px-2 text-purple-200/60">
                Ou continuer avec
              </span>
            </div>
          </div>

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
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            className="w-full bg-purple-300 hover:bg-purple-200 text-purple-950 font-medium shadow-lg transition-all duration-300" 
            onClick={() => handleEmailAuth(false)}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : null}
            Entrer dans le portail
          </Button>

          <Button 
            className="w-full bg-background/30 hover:bg-purple-900/20 border-purple-300/30 hover:border-purple-300/50 transition-all duration-300" 
            variant="outline"
            onClick={() => handleEmailAuth(true)}
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
