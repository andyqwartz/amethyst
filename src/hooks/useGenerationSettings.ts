import { useState } from 'react';
import type { GenerationSettings } from '@/types/replicate';

const defaultSettings: GenerationSettings = {
  prompt: '',
  negative_prompt: '',
  guidance_scale: 7.5,
  num_inference_steps: 20,
  num_outputs: 1,
  aspect_ratio: '1:1',
  output_format: 'png',
  output_quality: 75,
  prompt_strength: 0.8,
  hf_loras: [],
  lora_scales: [],
  disable_safety_checker: false
};

export const useGenerationSettings = () => {
  const [settings, setSettings] = useState<GenerationSettings>(defaultSettings);

  const updateSettings = (newSettings: Partial<GenerationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    settings,
    updateSettings
  };
};