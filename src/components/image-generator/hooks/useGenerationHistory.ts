
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { GenerationHistoryItem } from '@/types/generation';

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
        url: item.output_url,
        output_url: item.output_url,
        public_url: item.output_url,
        timestamp: new Date(item.created_at).getTime(),
        created_at: item.created_at,
        settings: {
          ...item.raw_parameters,
          width: item.width,
          height: item.height,
          img2img: false,
          strength: item.strength,
          initImage: null
        },
        user_id: item.user_id,
        image_id: item.image_id,
        status: item.status,
        completed_at: item.completed_at,
        error_message: item.error_message,
        prompt: item.prompt,
        parameters: item.raw_parameters,
        processing_time: item.processing_time,
        credits_cost: item.credits_cost
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
