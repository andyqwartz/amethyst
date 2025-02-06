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
    const uniqueUrls = new Map<string, {
      url: string;
      settings: GenerationSettings;
      timestamp: number;
    }>();

    images.forEach(img => {
      const item = {
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
        } as GenerationSettings,
        timestamp: new Date(img.created_at).getTime()
      };

      // Only keep the most recent version of each URL
      if (!uniqueUrls.has(img.url) || uniqueUrls.get(img.url)!.timestamp < item.timestamp) {
        uniqueUrls.set(img.url, item);
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
      
      // Additional deduplication check before setting history
      const uniqueHistory = formattedHistory.filter((item, index, self) => 
        index === self.findIndex(t => t.url === item.url)
      );
      
      setHistory(uniqueHistory);
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
    
    // Check for duplicates in current history
    if (history.some(item => item.url === url)) {
      console.log('URL already exists in history:', url);
      return;
    }

    // Check if we're already processing an addition
    if (isAddingToHistory.current) {
      console.log('Already processing an addition, skipping');
      return;
    }

    // Check minimum time between additions
    const now = Date.now();
    if (now - lastAddedTimestamp.current < 5000) {
      console.log('Too soon after last addition, minimum 5s required');
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
      
      toast({
        title: "Image sauvegardée",
        description: "L'image a été ajoutée à votre historique",
      });
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
