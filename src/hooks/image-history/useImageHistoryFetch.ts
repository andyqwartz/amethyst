import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import type { ImageSettings } from '@/types/image-history';
import type { GenerationSettings } from '@/types/replicate';

export const useImageHistoryFetch = (
  setHistory: (history: Array<{ url: string; settings: GenerationSettings; timestamp: number }>) => void,
  setLoading: (isLoading: boolean) => void
) => {
  const { toast } = useToast();

  const fetchHistory = useCallback(async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        console.log('No authenticated user found');
        setHistory([]);
        setLoading(false);
        return;
      }

      console.log('Fetching history for user:', session.session.user.id);
      
      const { data: images, error } = await supabase
        .from('images')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedHistory = images.map(img => {
        const imgSettings = img.settings as ImageSettings;
        const outputFormat = img.output_format as "webp" | "jpg" | "png" || "webp";
        
        return {
          url: img.url,
          settings: {
            prompt: img.prompt || '',
            negative_prompt: img.negative_prompt || '',
            guidance_scale: img.guidance_scale || 7.5,
            num_inference_steps: img.steps || 30,
            seed: img.seed,
            num_outputs: img.num_outputs || 1,
            aspect_ratio: img.aspect_ratio || "1:1",
            output_format: outputFormat,
            output_quality: img.output_quality || 80,
            prompt_strength: img.prompt_strength || 0.8,
            hf_loras: imgSettings?.hf_loras || [],
            lora_scales: imgSettings?.lora_scales || [],
            disable_safety_checker: imgSettings?.disable_safety_checker || false,
            reference_image_url: img.reference_image_url || null
          } as GenerationSettings,
          timestamp: new Date(img.created_at).getTime()
        };
      });

      setHistory(formattedHistory);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: "Error",
        description: "Unable to load image history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [setHistory, setLoading, toast]);

  return { fetchHistory };
};