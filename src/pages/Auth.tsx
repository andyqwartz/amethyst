import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { AuthError } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Github } from 'lucide-react';

export const Auth = () => {
  const { handleEmailAuth, handleGithubAuth, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent, isSignUp: boolean) => {
    e.preventDefault();
    try {
      const response = await handleEmailAuth(email, password, isSignUp);
      if (response.error) {
        toast({
          title: "Authentication Error",
          description: response.error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      const message = error instanceof AuthError ? error.message : 'An error occurred';
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-card/95 backdrop-blur-xl border border-primary/10">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Welcome</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Sign In'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-primary/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={handleGithubAuth}
          disabled={isLoading}
        >
          <Github className="mr-2 h-4 w-4" />
          Github
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <button
            onClick={(e) => handleSubmit(e, true)}
            className="underline hover:text-primary"
            disabled={isLoading}
          >
            Sign up
          </button>
        </p>
      </Card>
    </div>
  );
};

export default Auth;