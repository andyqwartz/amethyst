import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, checkSession } from '@/lib/supabase/client';
import type { GenerationSettings } from '@/types/replicate';
import { useToast } from "@/hooks/use-toast";

interface HistoryItem {
  id?: string;
  url: string;
  settings: GenerationSettings;
  timestamp: number;
}

export const useImageHistory = () => {
  const { toast } = useToast();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isAddingToHistory = useRef(false);
  const lastAddedUrl = useRef<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const session = await checkSession();

      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setHistory(data?.map(item => ({
        id: item.id,
        url: item.url,
        settings: {
          prompt: item.prompt,
          negative_prompt: item.negative_prompt,
          guidance_scale: item.guidance_scale,
          num_inference_steps: item.steps,
          seed: item.seed,
          num_outputs: item.num_outputs,
          aspect_ratio: item.aspect_ratio,
          output_format: item.output_format,
          output_quality: item.output_quality,
          prompt_strength: item.prompt_strength,
          reference_image_url: item.reference_image_url,
          hf_loras: item.settings?.hf_loras || [],
          lora_scales: item.settings?.lora_scales || []
        },
        timestamp: new Date(item.created_at).getTime()
      })) || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const addToHistory = useCallback(async (url: string, settings: GenerationSettings) => {
    if (isAddingToHistory.current || url === lastAddedUrl.current) {
      console.log('Skipping duplicate addition to history');
      return;
    }

    try {
      isAddingToHistory.current = true;
      lastAddedUrl.current = url;
      setIsLoading(true);

      // Validate session before any operations
      const session = await checkSession();

      // Prepare the image data
      const imageData = {
        url,
        user_id: session.session.user.id,
        settings: {
          hf_loras: settings.hf_loras || [],
          lora_scales: settings.lora_scales || []
        },
        prompt: settings.prompt,
        negative_prompt: settings.negative_prompt,
        guidance_scale: settings.guidance_scale,
        steps: settings.num_inference_steps,
        seed: settings.seed,
        num_outputs: settings.num_outputs,
        aspect_ratio: settings.aspect_ratio,
        output_format: settings.output_format,
        output_quality: settings.output_quality,
        prompt_strength: settings.prompt_strength,
        reference_image_url: settings.reference_image_url
      };

      // Insert into database first
      const { data, error } = await supabase
        .from('images')
        .insert(imageData)
        .select()
        .single();

      if (error) throw error;

      // Only update state after successful database operation
      setHistory(prev => [{
        id: data.id,
        url: data.url,
        settings,
        timestamp: new Date(data.created_at).getTime()
      }, ...prev]);
      
      toast({
        title: "Image sauvegardée",
        description: "L'image a été ajoutée à votre historique",
        variant: "default"
      });
    } catch (error) {
      console.error('Error adding to history:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'image dans l'historique",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      isAddingToHistory.current = false;
    }
  }, [toast, fetchHistory]);

  const isValidSupabaseUrl = (url: string): boolean => {
    return url.includes('storage.googleapis.com') || url.includes('.supabase.co/storage/v1/object/public/');
  };

  const getStoragePathFromUrl = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts[pathParts.length - 1] || null;
    } catch {
      return null;
    }
  };

  const deleteImage = useCallback(async (url: string) => {
    try {
      setIsLoading(true);
      const session = await checkSession();

      const imageToDelete = history.find(item => item.url === url);
      if (!imageToDelete?.id) {
        throw new Error('Image non trouvée');
      }

      // Delete from database first
      const { error: dbError } = await supabase
        .from('images')
        .delete()
        .eq('id', imageToDelete.id)
        .eq('user_id', session.session.user.id);

      if (dbError) throw dbError;

      // Delete the image from storage if it's a Supabase URL
      if (isValidSupabaseUrl(url)) {
        const path = getStoragePathFromUrl(url);
        if (path) {
          const { error: storageError } = await supabase.storage
            .from('images')
            .remove([path]);
          
          if (storageError) {
            console.error('Error deleting image from storage:', storageError);
            throw storageError;
          }
        }
      }

      // Update local state immediately before database operations
      setHistory(prev => prev.filter(item => item.url !== url));
      
      toast({
        title: "Image supprimée",
        description: "L'image a été supprimée de votre historique",
        variant: "default"
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'image",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [history, toast]);

  const deleteAllImages = useCallback(async () => {
    try {
      setIsLoading(true);
      const session = await checkSession();

      const { error } = await supabase
        .from('images')
        .delete()
        .eq('user_id', session.session.user.id);

      if (error) throw error;

      setHistory([]);
      
      toast({
        title: "Historique supprimé",
        description: "Toutes les images ont été supprimées",
        variant: "default"
      });
    } catch (error) {
      console.error('Error deleting all images:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'historique",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchHistory();

    const channel = supabase
      .channel('images_changes')
      .on(
        'postgres_changes',
        { 
          event: '*',
          schema: 'public',
          table: 'images'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchHistory]);

  return {
    history,
    isLoading,
    addToHistory,
    deleteImage,
    deleteAllImages,
    fetchHistory
  };
};
