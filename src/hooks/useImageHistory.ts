import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { GenerationSettings } from '@/types/replicate';
import { useToast } from "@/hooks/use-toast";

export const useImageHistory = () => {
  const [history, setHistory] = useState<{
    url: string;
    settings: GenerationSettings;
    timestamp: number;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const isAddingToHistory = useRef(false);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Fetching history...');
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        console.log('No authenticated user found');
        setHistory([]);
        setIsLoading(false);
        return;
      }

      const { data: images, error } = await supabase
        .from('images')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching images:', error);
        throw error;
      }

      console.log('Fetched images:', images);

      const formattedHistory = images.map(img => ({
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
          hf_loras: Array.isArray(img.settings?.hf_loras) ? img.settings.hf_loras : [],
          lora_scales: Array.isArray(img.settings?.lora_scales) ? img.settings.lora_scales : [],
          disable_safety_checker: false,
          reference_image_url: img.reference_image_url || null
        } as GenerationSettings,
        timestamp: new Date(img.created_at).getTime()
      }));

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
  }, [toast]);

  const addToHistory = async (url: string, settings: GenerationSettings) => {
    if (isAddingToHistory.current) {
      console.log('Already adding to history, skipping duplicate call');
      return;
    }

    isAddingToHistory.current = true;

    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        console.error('No authenticated user found');
        toast({
          title: "Erreur d'authentification",
          description: "Veuillez vous connecter pour sauvegarder les images",
          variant: "destructive"
        });
        return;
      }

      console.log('Adding image to history:', { url, settings });

      const { error } = await supabase
        .from('images')
        .insert({
          url,
          user_id: session.session.user.id,
          settings: settings as unknown as Json,
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
        });

      if (error) {
        console.error('Error adding to history:', error);
        throw error;
      }

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
    allHistory: history,
    addToHistory,
    isLoading 
  };
};