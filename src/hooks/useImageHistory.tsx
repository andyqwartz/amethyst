import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { GenerationSettings } from '@/types/replicate';
import { useToast } from "@/hooks/use-toast";
import { useSupabaseQueries } from './supabase/useSupabaseQueries';
import { useRealtimeSubscription } from './supabase/useRealtimeSubscription';

export const useImageHistory = () => {
  const [history, setHistory] = useState<{
    url: string;
    settings: GenerationSettings;
    timestamp: number;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const isAddingToHistory = useRef(false);
  const lastAddedUrl = useRef<string | null>(null);
  const lastAddedTimestamp = useRef<number>(0);
  const { fetchUserImages, insertImage } = useSupabaseQueries();

  const formatHistory = (images: any[]) => {
    const uniqueUrls = new Map();
    
    images.forEach(img => {
      const key = img.url;
      const timestamp = new Date(img.created_at).getTime();
      
      if (!uniqueUrls.has(key) || timestamp > uniqueUrls.get(key).timestamp) {
        uniqueUrls.set(key, {
          url: img.url,
          settings: {
            prompt: img.prompt || '',
            negative_prompt: img.negative_prompt || '',
            guidance_scale: img.guidance_scale || 7.5,
            num_inference_steps: img.steps || 30,
            seed: img.seed,
            num_outputs: img.num_outputs || 1,
            aspect_ratio: img.aspect_ratio || "1:1",
            output_format: img.output_format || "webp",
            output_quality: img.output_quality || 80,
            prompt_strength: img.prompt_strength || 0.8,
            hf_loras: img.settings?.hf_loras || [],
            lora_scales: img.settings?.lora_scales || [],
            disable_safety_checker: false,
            reference_image_url: img.reference_image_url || null
          },
          timestamp
        });
      }
    });

    return Array.from(uniqueUrls.values())
      .sort((a, b) => b.timestamp - a.timestamp);
  };

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        setHistory([]);
        return;
      }

      const images = await fetchUserImages(session.session.user.id);
      const formattedHistory = formatHistory(images);
      setHistory(formattedHistory);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des images",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, fetchUserImages]);

  const addToHistory = async (url: string, settings: GenerationSettings) => {
    console.log('Attempting to add to history:', url);
    
    // Vérifier si l'URL existe déjà dans l'historique
    if (history.some(item => item.url === url)) {
      console.log('URL already exists in history, skipping:', url);
      return;
    }

    // Vérifier si nous sommes déjà en train d'ajouter une image
    if (isAddingToHistory.current) {
      console.log('Already processing an addition, skipping');
      return;
    }

    // Vérifier le délai minimum entre les ajouts
    const now = Date.now();
    if (now - lastAddedTimestamp.current < 2000) { // Réduit à 2 secondes
      console.log('Too soon after last addition, skipping');
      return;
    }

    isAddingToHistory.current = true;
    lastAddedUrl.current = url;
    lastAddedTimestamp.current = now;

    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        toast({
          title: "Erreur d'authentification",
          description: "Veuillez vous connecter pour sauvegarder les images",
          variant: "destructive"
        });
        return;
      }

      await insertImage(session.session.user.id, url, settings);
      await fetchHistory();
    } catch (error) {
      console.error('Error adding to history:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'image dans l'historique",
        variant: "destructive"
      });
    } finally {
      isAddingToHistory.current = false;
    }
  };

  useRealtimeSubscription(fetchHistory);

  return { 
    history,
    addToHistory,
    isLoading 
  };
};