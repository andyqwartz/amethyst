import { useState } from 'react';
import type { ImageSettings } from '@/types/generation';

const defaultSettings: ImageSettings = {
  prompt: '',
  negative_prompt: '',
  guidance_scale: 7.5,
  steps: 20,
  width: 512,
  height: 512,
  seed: -1,
  num_outputs: 1,
  aspect_ratio: '1:1',
  output_format: 'webp',
  output_quality: 90,
  prompt_strength: 0.8,
  hf_loras: ['AndyVampiro/fog'],
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
    updateSettings,
    resetSettings: () => setSettings(defaultSettings)
  };
};