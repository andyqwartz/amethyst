import { supabase } from '@/integrations/supabase/client';
import type { GenerationSettings } from '@/types/replicate';

export const useSupabaseQueries = () => {
  const fetchUserImages = async (userId: string) => {
    const { data: images, error } = await supabase
      .from('images')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return images;
  };

  const insertImage = async (userId: string, url: string, settings: GenerationSettings) => {
    const { error } = await supabase
      .from('images')
      .insert({
        url,
        user_id: userId,
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
      });

    if (error) throw error;
  };

  return {
    fetchUserImages,
    insertImage
  };
};