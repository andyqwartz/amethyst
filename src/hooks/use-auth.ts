import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleEmailAuth = async (email: string, password: string, isSignUp: boolean) => {
    if (isSignUp) {
      return await supabase.auth.signUp({ email, password });
    } else {
      return await supabase.auth.signInWithPassword({ email, password });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    handleEmailAuth,
    signOut
  };
};