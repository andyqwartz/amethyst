import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { GenerationSettings } from '@/types/replicate';

export const useImageGeneratorLogic = () => {
  const [history, setHistory] = useState<Array<{
    url: string;
    settings: GenerationSettings;
    timestamp: number;
  }>>([]);
  const { toast } = useToast();

  const fetchHistory = useCallback(async () => {
    try {
      console.log('Fetching history...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedHistory = data.map(item => ({
        url: item.url,
        settings: item.settings || {},
        timestamp: new Date(item.created_at).getTime(),
      }));

      setHistory(formattedHistory);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: "Error",
        description: "Failed to load image history",
        variant: "destructive",
      });
    }
  }, [toast]);

  const addToHistory = useCallback(async (imageUrl: string, settings: GenerationSettings) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('No authenticated user');
      }

      const { error } = await supabase
        .from('images')
        .insert([
          {
            url: imageUrl,
            settings,
            user_id: session.user.id,
          }
        ]);

      if (error) throw error;

      // Update local state
      setHistory(prev => [{
        url: imageUrl,
        settings,
        timestamp: Date.now(),
      }, ...prev]);

      toast({
        title: "Success",
        description: "Image added to history",
      });
    } catch (error) {
      console.error('Error adding to history:', error);
      toast({
        title: "Error",
        description: "Failed to save image to history",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleDeleteImage = useCallback(async (imageUrl: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('No authenticated user');
      }

      const { error } = await supabase
        .from('images')
        .delete()
        .eq('url', imageUrl)
        .eq('user_id', session.user.id);

      if (error) throw error;

      // Update local state
      setHistory(prev => prev.filter(item => item.url !== imageUrl));

      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    history,
    fetchHistory,
    addToHistory,
    handleDeleteImage,
  };
};