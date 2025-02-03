import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/use-auth';

const Auth = () => {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      toast({
        title: "Success",
        description: `Successfully ${isRegistering ? 'registered' : 'logged in'}!`,
        variant: "success"
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: Error | string) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    toast({
      title: "Erreur",
      description: errorMessage,
      variant: "destructive"
    });
  };

  return (
    <div className="auth-container">
      <h1>{isRegistering ? 'Register' : 'Login'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      </form>
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
      </button>
    </div>
  );
};

export default Auth;
