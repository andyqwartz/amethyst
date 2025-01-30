import { useState, useEffect } from 'react';
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
  hf_loras: ['AndyVampiro/joa'],
  lora_scales: [0.8],
  disable_safety_checker: true,
  reference_image_url: null
};

export const useGenerationSettings = () => {
  const [settings, setSettings] = useState<GenerationSettings>(() => {
    const savedSettings = localStorage.getItem('generation_settings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('generation_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<GenerationSettings>) => {
    setSettings(current => {
      const updated = { ...current, ...newSettings };
      console.log('Settings updated:', updated);
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('generation_settings');
  };

  return {
    settings,
    updateSettings,
    resetSettings
  };
};