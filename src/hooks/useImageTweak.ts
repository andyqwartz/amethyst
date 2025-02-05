import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { GenerationSettings } from '@/types/replicate';
import { supabase } from '@/lib/supabase/client';

const DEFAULT_SETTINGS: Partial<GenerationSettings> = {
  hf_loras: [],
  lora_scales: [],
  prompt: '',
  negative_prompt: '',
  guidance_scale: 7.5,
  num_inference_steps: 30,
  num_outputs: 1,
  aspect_ratio: '1:1',
  output_format: 'webp',
  output_quality: 90,
  prompt_strength: 0.8,
  seed: Math.floor(Math.random() * 1000000),
};

const validateSettings = (settings: GenerationSettings) => {
  if (settings.guidance_scale < 1 || settings.guidance_scale > 20) {
    throw new Error('Guidance scale must be between 1 and 20');
  }
  if (settings.num_inference_steps < 1 || settings.num_inference_steps > 100) {
    throw new Error('Number of inference steps must be between 1 and 100');
  }
  if (settings.prompt_strength < 0 || settings.prompt_strength > 1) {
    throw new Error('Prompt strength must be between 0 and 1');
  }
};

const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface UseTweakOptions {
  onSettingsChange: (settings: GenerationSettings) => void;
  onReferenceImageChange: (url: string | null) => void;
}

export const useImageTweak = ({ onSettingsChange, onReferenceImageChange }: UseTweakOptions) => {
  const { toast } = useToast();

  const tweakImage = useCallback(async (file: File) => {
    try {
      // Validate file type
      if (!VALID_IMAGE_TYPES.includes(file.type)) {
        throw new Error('Invalid image type. Please upload a JPEG, PNG, or WebP image.');
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Image size too large. Maximum size is 10MB.');
      }

      // Create a new settings object with current timestamp as seed
      const newSettings: GenerationSettings = {
        ...DEFAULT_SETTINGS as GenerationSettings,
        seed: Math.floor(Date.now() / 1000),
      };

      // Validate the settings
      validateSettings(newSettings);

      // Upload image to Supabase storage
      const fileName = `tweak-${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('tweaks')
        .upload(fileName, file);

      if (error) {
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      // Get the public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('tweaks')
        .getPublicUrl(fileName);

      // Update reference image and settings
      onReferenceImageChange(publicUrl);
      onSettingsChange(newSettings);

      toast({
        title: "Image loaded successfully",
        description: "You can now adjust the settings to tweak your image.",
        duration: 3000,
      });

    } catch (error) {
      toast({
        title: "Error processing image",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
        duration: 5000,
      });
      
      // Reset state on error
      onReferenceImageChange(null);
      onSettingsChange({
        ...DEFAULT_SETTINGS as GenerationSettings,
        seed: Math.floor(Math.random() * 1000000),
      });
    }
  }, [onSettingsChange, onReferenceImageChange, toast]);

  return { tweakImage };
}; 
