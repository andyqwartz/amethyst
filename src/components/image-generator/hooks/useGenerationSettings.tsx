import { useState, useEffect, useCallback, useRef } from 'react';

const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
};

export interface GenerationSettings {
  negativePrompt: string;
  width: number;
  height: number;
  numInferenceSteps: number;
  guidanceScale: number;
  seed: number;
}

const DEFAULT_SETTINGS: GenerationSettings = {
  negativePrompt: '',
  width: 512,
  height: 512,
  numInferenceSteps: 50,
  guidanceScale: 7.5,
  seed: -1,
};

const STORAGE_KEY = 'generation-settings';

export const useGenerationSettings = () => {
  const [settings, setSettings] = useState<GenerationSettings>(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });

  const saveToLocalStorage = useCallback((settings: GenerationSettings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, []);

  const debouncedSave = useDebounce(saveToLocalStorage, 500);

  useEffect(() => {
    debouncedSave(settings);
  }, [settings, debouncedSave]);

  const updateSettings = useCallback((newSettings: Partial<GenerationSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const updateNegativePrompt = useCallback((negativePrompt: string) => {
    updateSettings({ negativePrompt });
  }, [updateSettings]);

  const updateDimensions = useCallback((width: number, height: number) => {
    updateSettings({ width, height });
  }, [updateSettings]);

  const updateNumInferenceSteps = useCallback((numInferenceSteps: number) => {
    updateSettings({ numInferenceSteps });
  }, [updateSettings]);

  const updateGuidanceScale = useCallback((guidanceScale: number) => {
    updateSettings({ guidanceScale });
  }, [updateSettings]);

  const updateSeed = useCallback((seed: number) => {
    updateSettings({ seed });
  }, [updateSettings]);

  return {
    settings,
    updateSettings,
    resetSettings,
    updateNegativePrompt,
    updateDimensions,
    updateNumInferenceSteps,
    updateGuidanceScale,
    updateSeed,
  };
};
