import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { GenerationSettings } from '@/types/replicate';

export function useImageHistory() {
  const [history, setHistory] = useState<{ url: string; settings: GenerationSettings; timestamp: number; }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addToHistory = useCallback(async (url: string, settings: GenerationSettings) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to save images",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('images')
        .insert([
          {
            url,
            settings,
            user_id: session.session.user.id,
          },
        ]);

      if (error) throw error;

      setHistory(prev => [{
        url,
        settings,
        timestamp: Date.now()
      }, ...prev]);

    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save image to history",
        variant: "destructive"
      });
    }
  }, [toast]);

  const deleteImage = useCallback(async (url: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to delete images",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('images')
        .delete()
        .eq('url', url)
        .eq('user_id', session.session.user.id);

      if (error) throw error;

      setHistory(prev => prev.filter(item => item.url !== url));
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete image",
        variant: "destructive"
      });
    }
  }, [toast]);

  return {
    history,
    addToHistory,
    deleteImage,
    isLoading
  };
}