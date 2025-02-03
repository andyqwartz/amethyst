import { useState } from 'react';
import { ImageSettings } from '@/types/generation';

export const useGenerationState = () => {
  const [settings, setSettings] = useState<ImageSettings>({
    negative_prompt: '',
    guidance_scale: 7.5,
    num_inference_steps: 50,
    aspect_ratio: '1:1'
  });

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