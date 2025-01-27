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
  const [settings, setSettings] = useState<GenerationSettings>(DEFAULT_SETTINGS);

  const updateSettings = (newSettings: Partial<GenerationSettings>) => {
    setSettings(current => {
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