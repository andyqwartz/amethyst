import { useCallback } from 'react';
import { supabase, checkSession } from '@/lib/supabase/client';

interface HistoryImage {
  id: string;
  url: string;
  timestamp: number;
  settings: Record<string, any>;
}

interface HistoryResponse {
  success: boolean;
  data?: HistoryImage[];
  error?: string;
}

export const useHistoryManagement = () => {
  const fetchHistory = useCallback(async (): Promise<HistoryResponse> => {
    try {
      await checkSession();
      
      const { data, error } = await supabase
        .from('image_history')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data as HistoryImage[]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch history';
      return {
        success: false,
        error: errorMessage
      };
    }
  }, []);

  const addToHistory = useCallback(async (image: HistoryImage): Promise<{ success: boolean; error?: string }> => {
    try {
      await checkSession();

      const { error } = await supabase
        .from('image_history')
        .insert([{
          id: image.id,
          url: image.url,
          timestamp: image.timestamp,
          settings: image.settings
        }]);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to history';
      return {
        success: false,
        error: errorMessage
      };
    }
  }, []);

  const clearHistory = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    try {
      await checkSession();

      const { error } = await supabase
        .from('image_history')
        .delete()
        .neq('id', ''); // Delete all records

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear history';
      return {
        success: false,
        error: errorMessage
      };
    }
  }, []);

  const removeFromHistory = useCallback(async (imageId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await checkSession();

      const { error } = await supabase
        .from('image_history')
        .delete()
        .eq('id', imageId);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove from history';
      return {
        success: false,
        error: errorMessage
      };
    }
  }, []);

  return {
    fetchHistory,
    addToHistory,
    clearHistory,
    removeFromHistory
  };
};