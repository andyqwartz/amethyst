import { useState, useEffect } from 'react';
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