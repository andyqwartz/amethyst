import { useCallback } from 'react';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';
import { supabase } from '@/lib/supabase/client';
import type { ImageSettings } from '@/types/generation';

interface HistoryItem {
  id: string;
  url: string;
  settings: ImageSettings;
  created_at: string;
}

export const useHistoryManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchHistory = useCallback(async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as HistoryItem[];
    } catch (err) {
      console.error('Error fetching history:', err);
      toast({
        title: "Error",
        description: "Failed to load generation history",
        variant: "destructive"
      });
      return [];
    }
  }, [user, toast]);

  const addToHistory = useCallback(async (image: { url: string; settings: ImageSettings }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('generated_images')
        .insert({
          user_id: user.id,
          url: image.url,
          settings: image.settings,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image added to history"
      });
    } catch (err) {
      console.error('Error adding to history:', err);
      toast({
        title: "Error",
        description: "Failed to save image to history",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  const removeFromHistory = useCallback(async (imageUrl: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('generated_images')
        .delete()
        .eq('user_id', user.id)
        .eq('url', imageUrl);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image removed from history"
      });
    } catch (err) {
      console.error('Error removing from history:', err);
      toast({
        title: "Error",
        description: "Failed to remove image from history",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  const clearHistory = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('generated_images')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Generation history cleared"
      });
    } catch (err) {
      console.error('Error clearing history:', err);
      toast({
        title: "Error",
        description: "Failed to clear generation history",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  return {
    fetchHistory,
    addToHistory,
    removeFromHistory,
    clearHistory
  };
};
