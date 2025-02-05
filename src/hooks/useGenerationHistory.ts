import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
<<<<<<< HEAD
import type { GenerationSettings } from '@/types/replicate';

export interface HistoryItem {
  url: string;
  settings: GenerationSettings;
}

export const useGenerationHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
=======
import type { GenerationSettings } from '@/types/generation';

export interface GenerationHistoryItem {
  id: string;
  url: string;
  settings: GenerationSettings;
  timestamp: number;
}

export const useGenerationHistory = () => {
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
>>>>>>> a945a29ba778c4116754a03171a654de675e5402

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
<<<<<<< HEAD
        url: item.url,
        settings: item.settings
      })));
    } catch (error) {
      console.error('Error fetching history:', error);
=======
        id: item.id,
        url: item.url,
        settings: item.settings,
        timestamp: new Date(item.created_at).getTime()
      })));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch history'));
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
=======
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

>>>>>>> a945a29ba778c4116754a03171a654de675e5402
  useEffect(() => {
    fetchHistory();
  }, []);

<<<<<<< HEAD
  return { history, loading, fetchHistory };
=======
  return {
    history,
    loading,
    error,
    removeFromHistory,
    clearHistory,
    fetchHistory
  };
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
};