import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { ImageSettings } from '@/types/generation';

export interface HistoryItem {
  id: string;
  url: string;
  settings: ImageSettings;
  created_at: string;
}

export const useGenerationHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  return { history, loading, fetchHistory };
};