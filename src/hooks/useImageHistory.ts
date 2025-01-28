import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { GenerationSettings } from '@/types/replicate';
import type { Json } from '@/integrations/supabase/types';

export const useImageHistory = () => {
  const [history, setHistory] = useState<{
    url: string;
    settings: GenerationSettings;
    timestamp: number;
  }[]>([]);
  const [allHistory, setAllHistory] = useState<{
    url: string;
    settings: GenerationSettings;
    timestamp: number;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: images, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

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
          hf_loras: [],
          lora_scales: [],
          disable_safety_checker: false
        } as GenerationSettings,
        timestamp: new Date(img.created_at).getTime()
      }));

      setHistory(formattedHistory.slice(0, 4));
      setAllHistory(formattedHistory);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();

    const channel = supabase
      .channel('images_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'images' },
        (payload) => {
          const newImage = payload.new as any;
          const formattedImage = {
            url: newImage.url,
            settings: {
              prompt: newImage.prompt || '',
              negative_prompt: newImage.negative_prompt || '',
              guidance_scale: newImage.guidance_scale || 7.5,
              num_inference_steps: newImage.steps || 30,
              seed: newImage.seed,
              num_outputs: 1,
              aspect_ratio: "1:1",
              output_format: "webp",
              output_quality: 80,
              prompt_strength: 0.8,
              hf_loras: [],
              lora_scales: [],
              disable_safety_checker: false
            } as GenerationSettings,
            timestamp: new Date(newImage.created_at).getTime()
          };

          setHistory(prev => {
            const newHistory = [formattedImage, ...prev];
            return newHistory.slice(0, 4);
          });

          setAllHistory(prev => [formattedImage, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchHistory]);

  const addToHistory = useCallback(async (url: string, settings: GenerationSettings) => {
    try {
      const { error } = await supabase
        .from('images')
        .insert({
          url,
          settings: settings as unknown as Json,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          prompt: settings.prompt,
          negative_prompt: settings.negative_prompt,
          guidance_scale: settings.guidance_scale,
          steps: settings.num_inference_steps,
          seed: settings.seed,
          num_outputs: settings.num_outputs,
          aspect_ratio: settings.aspect_ratio,
          output_format: settings.output_format,
          output_quality: settings.output_quality,
          prompt_strength: settings.prompt_strength
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  }, []);

  return {
    history,
    allHistory,
    isLoading,
    addToHistory
  };
};