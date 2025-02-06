import { useState } from 'react';
import type { GenerationSettings } from '@/types/replicate';

const DEFAULT_SETTINGS: GenerationSettings = {
  prompt: '',
  negative_prompt: '',
  guidance_scale: 3.5,
  num_inference_steps: 28,
  num_outputs: 1,
  aspect_ratio: "1:1",
  output_format: "webp",
  output_quality: 80,
  prompt_strength: 0.8,
  hf_loras: ['AndyVampiro/andy', 'AndyVampiro/joa'],
  lora_scales: [1.0, 1.0],
  disable_safety_checker: true,
  reference_image_url: null
};

export const useGenerationSettings = () => {
  const [settings, setSettings] = useState<GenerationSettings>(DEFAULT_SETTINGS);

  const updateSettings = (newSettings: Partial<GenerationSettings>) => {
    setSettings(current => {
      // Si on met à jour les LoRAs, s'assurer que les scales sont aussi mises à jour
      if (newSettings.hf_loras && !newSettings.lora_scales) {
        newSettings.lora_scales = newSettings.hf_loras.map(() => 1.0);
      }
      
      const updated = { ...current, ...newSettings };
      console.log('Settings updated:', updated);
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('last_settings');
  };

  return {
    settings,
    updateSettings,
    resetSettings
  };
};