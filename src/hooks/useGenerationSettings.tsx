import { useState, useEffect } from 'react';
import type { GenerationSettings } from '@/types/replicate';

const DEFAULT_SETTINGS: GenerationSettings = {
  prompt: '',
  negativePrompt: '',
  guidanceScale: 3.5,
  steps: 28,
  numOutputs: 1,
  aspectRatio: "1:1",
  outputFormat: "webp",
  outputQuality: 80,
  promptStrength: 0.8,
  hfLoras: [],
  loraScales: [],
  disableSafetyChecker: false
};

export const useGenerationSettings = () => {
  const [settings, setSettings] = useState<GenerationSettings>(() => {
    try {
      const saved = localStorage.getItem('last_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Always ensure prompt starts empty
        return { ...parsed, prompt: '' };
      }
    } catch (error) {
      console.error('Error parsing saved settings:', error);
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('last_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<GenerationSettings>) => {
    setSettings(current => ({ ...current, ...newSettings }));
    console.log('Settings updated:', newSettings);
  };

  return {
    settings,
    updateSettings
  };
};