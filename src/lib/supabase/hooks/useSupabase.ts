import { useEffect, useState } from 'react';
import { supabase } from '../client';

export const useSupabase = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('profiles').select('count');
        setInitialized(!error);
      } catch {
        setInitialized(false);
      }
    };

    checkConnection();
  }, []);

  return { supabase, initialized };
};