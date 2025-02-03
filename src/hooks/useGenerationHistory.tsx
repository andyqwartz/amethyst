import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { GenerationSettings } from '@/types/replicate';

export interface HistoryItem {
  url: string;
  settings: GenerationSettings;
}

export const useGenerationHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

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
        url: item.url,
        settings: item.settings
      })));
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  return { history, loading, fetchHistory };
};