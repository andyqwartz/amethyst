import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { supabase } from '@/lib/supabase';

export const useGenerationHistory = (userId: string) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setHistory(data);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [userId]);

  return { history, loading };
}; 
=======
import { supabase } from '@/lib/supabase/client';
import type { GeneratedImage } from '@/types/generation';

export interface GenerationHistoryItem extends GeneratedImage {}

export const useGenerationHistory = () => {
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setHistory(data.map(item => ({
        id: item.id,
        url: item.url,
        public_url: item.public_url,
        timestamp: new Date(item.created_at).getTime(),
        created_at: item.created_at,
        settings: item.settings
      })));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch history'));
    } finally {
      setLoading(false);
    }
  };

  const removeFromHistory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('generated_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove image'));
    }
  };

  const clearHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('generated_images')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setHistory([]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to clear history'));
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    history,
    loading,
    error,
    isLoading: loading,
    removeFromHistory,
    clearHistory,
    fetchHistory
  };
};
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
