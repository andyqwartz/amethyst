import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import type { GenerationSettings } from '@/types/replicate';
import type { ImageSettings } from '@/types/image-history';

export const useImageHistoryMutations = (fetchHistory: () => Promise<void>) => {
  const { toast } = useToast();

  const addToHistory = async (url: string, settings: GenerationSettings) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        console.error('No authenticated user found');
        toast({
          title: "Authentication Error",
          description: "Please log in to save images",
          variant: "destructive"
        });
        return;
      }

      console.log('Adding image to history for user:', session.session.user.id);
      console.log('Settings being saved:', settings);

      const imageSettings: ImageSettings = {
        hf_loras: settings.hf_loras,
        lora_scales: settings.lora_scales,
        disable_safety_checker: settings.disable_safety_checker
      };

      const { error } = await supabase
        .from('images')
        .insert({
          url,
          user_id: session.session.user.id,
          settings: imageSettings as any,
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
    } catch (error) {
      console.error('Error adding to history:', error);
      toast({
        title: "Error",
        description: "Unable to save image to history",
        variant: "destructive"
      });
    }
  };

  return { addToHistory };
};