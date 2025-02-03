import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const { handleEmailAuth } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await handleEmailAuth(email, password, isRegistering);
      if (response.success) {
        toast({
          title: "Success",
          description: `Successfully ${isRegistering ? 'registered' : 'logged in'}!`,
          variant: "default"
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "An error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{isRegistering ? 'Register' : 'Login'}</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>
        
        <button 
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full text-sm text-muted-foreground hover:text-primary"
        >
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </div>
    </div>
  );
};

export default Auth;