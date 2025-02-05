<<<<<<< HEAD
import { useState, useEffect } from 'react';
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
  hf_loras: ['AndyVampiro/fog'],
  lora_scales: [1.0],
  disable_safety_checker: false,
  seed: -1
};

export const useGenerationSettings = () => {
  const [settings, setSettings] = useState<GenerationSettings>(() => {
    try {
      const savedSettings = localStorage.getItem('generation_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        return {
          ...defaultSettings,
          ...parsed,
          // S'assurer que les tableaux LoRA sont toujours initialisés
          hf_loras: parsed.hf_loras?.length ? parsed.hf_loras : defaultSettings.hf_loras,
          lora_scales: parsed.lora_scales?.length ? parsed.lora_scales : defaultSettings.lora_scales,
        };
      }
      return defaultSettings;
    } catch (error) {
      console.error('Error loading settings:', error);
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('generation_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<GenerationSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      // S'assurer que les tableaux LoRA sont synchronisés
      if (newSettings.hf_loras && !newSettings.lora_scales) {
        updated.lora_scales = Array(newSettings.hf_loras.length).fill(1.0);
      }
      if (newSettings.lora_scales && !newSettings.hf_loras) {
        updated.hf_loras = Array(newSettings.lora_scales.length).fill('AndyVampiro/fog');
      }
      return updated;
    });
  };

  return {
    settings,
    updateSettings,
    resetSettings: () => {
      setSettings(defaultSettings);
      localStorage.removeItem('generation_settings');
    }
=======
import { useState } from 'react';
import type { ImageSettings } from '@/types/generation';

const defaultSettings: ImageSettings = {
  prompt: '',
  negative_prompt: '',
  width: 512,
  height: 512,
  steps: 20,
  guidance_scale: 7.5,
  num_outputs: 1,
  seed: -1,
  img2img: false,
  strength: 0.75,
  initImage: null,
  output_format: 'webp',
  output_quality: 90,
  prompt_strength: 0.8,
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

  const resetSettings = () => setSettings(defaultSettings);

  return {
    settings,
    updateSettings,
    resetSettings
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
  };
};