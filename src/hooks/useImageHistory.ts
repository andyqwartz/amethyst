import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { GenerationSettings } from '@/types/replicate';
import type { Json } from '@/integrations/supabase/types';

interface HistoryImage {
  url: string;
  settings: GenerationSettings;
  timestamp: number;
}

interface ImageRecord {
  url: string;
  settings: Json;
  created_at: string;
}

export const useImageHistory = () => {
  const [history, setHistory] = useState<HistoryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const { data: images, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedHistory = images.map(img => ({
        url: img.url,
        settings: img.settings as unknown as GenerationSettings,
        timestamp: new Date(img.created_at).getTime()
      }));

      setHistory(formattedHistory);
    } catch (error) {
      console.error('Error fetching image history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();

    const channel = supabase
      .channel('images_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'images' },
        (payload) => {
          const newImage = payload.new as ImageRecord;
          setHistory(prev => [{
            url: newImage.url,
            settings: newImage.settings as unknown as GenerationSettings,
            timestamp: new Date(newImage.created_at).getTime()
          }, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addToHistory = async (url: string, settings: GenerationSettings) => {
    try {
      const { error } = await supabase
        .from('images')
        .insert({
          url,
          settings: settings as unknown as Json,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          prompt: settings.prompt
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding image to history:', error);
    }
  };

  const getDashboardImages = () => history.slice(0, 10);
  const getAllImages = () => history;

  return { 
    history: getDashboardImages(), 
    allHistory: getAllImages(),
    addToHistory,
    isLoading 
  };
};