
import { useState } from 'react';
import type { ImageSettings } from '@/types/generation';

const defaultSettings: ImageSettings = {
  prompt: '',
  negative_prompt: '',
  width: 512,
  height: 512,
  steps: 20,
  guidance_scale: 7.5,
  num_inference_steps: 28,
  num_outputs: 1,
  seed: -1,
  img2img: false,
  strength: 0.75,
  initImage: null,
  output_format: 'webp',
  output_quality: 90,
  prompt_strength: 0.8,
  aspect_ratio: '1:1',
  hf_loras: ["AndyVampiro/fog"],
  lora_scales: [1.0],
  disable_safety_checker: false
};

export const useGenerationSettings = () => {
  const [settings, setSettings] = useState<ImageSettings>(defaultSettings);

  const updateSettings = (newSettings: Partial<ImageSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  return {
    settings,
    updateSettings
  };
};
