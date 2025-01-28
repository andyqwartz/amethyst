import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { GenerationSettings } from '@/types/replicate';
import type { Json } from '@/integrations/supabase/types';

interface ImageHistoryItem {
  url: string;
  settings: GenerationSettings;
  timestamp: number;
}

export const useImageHistory = () => {
  const [history, setHistory] = useState<ImageHistoryItem[]>([]);
  const [allHistory, setAllHistory] = useState<ImageHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const { data: images, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const historyItems = images.map(img => ({
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

      setHistory(historyItems.slice(0, 4));
      setAllHistory(historyItems);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching history:', error);
      setIsLoading(false);
    }
  };

  const addToHistory = async (url: string, settings: GenerationSettings) => {
    try {
      const newImage = {
        url,
        settings,
        timestamp: Date.now()
      };

      setHistory(prev => {
        const newHistory = [{
          url: newImage.url,
          settings: {
            prompt: newImage.settings.prompt || '',
            negative_prompt: newImage.settings.negative_prompt || '',
            guidance_scale: newImage.settings.guidance_scale || 7.5,
            num_inference_steps: newImage.settings.num_inference_steps || 30,
            seed: newImage.settings.seed,
            num_outputs: newImage.settings.num_outputs || 1,
            aspect_ratio: newImage.settings.aspect_ratio || "1:1",
            output_format: newImage.settings.output_format || "webp",
            output_quality: newImage.settings.output_quality || 80,
            prompt_strength: newImage.settings.prompt_strength || 0.8,
            hf_loras: newImage.settings.hf_loras || [],
            lora_scales: newImage.settings.lora_scales || [],
            disable_safety_checker: newImage.settings.disable_safety_checker || false
          } as GenerationSettings,
          timestamp: Date.now()
        }, ...prev];

        return newHistory.slice(0, 4);
      });

      setAllHistory(prev => [{
        url: newImage.url,
        settings: settings,
        timestamp: Date.now()
      }, ...prev]);

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
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    history,
    allHistory,
    isLoading,
    addToHistory
  };
};