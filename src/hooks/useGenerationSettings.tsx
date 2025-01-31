import { useState, useEffect, useCallback, useRef } from 'react';
import type { GenerationSettings } from '@/types/replicate';

// Organized settings following the specified order
const DEFAULT_SETTINGS: GenerationSettings = {
  // 1. Image Format
  aspect_ratio: "1:1",
  
  // 2. LoRAs and Scales
  hf_loras: ['AndyVampiro/joa'],
  lora_scales: [0.8],
  
  // 3. Number of outputs
  num_outputs: 1,
  
  // 4. Prompt Strength
  prompt_strength: 0.8,
  
  // 5. Output Format and Quality
  output_format: "webp",
  output_quality: 80,
  
  // Other parameters
  prompt: '',
  negative_prompt: '',
  guidance_scale: 3.5,
  num_inference_steps: 28,
  disable_safety_checker: true,
  reference_image_url: null
};

export const useGenerationSettings = () => {
  // Initialize settings with validation
  const [settings, setSettings] = useState<GenerationSettings>(() => {
    try {
      const savedSettings = localStorage.getItem('generation_settings');
      if (!savedSettings) return DEFAULT_SETTINGS;
      
      const parsedSettings = JSON.parse(savedSettings);
      // Ensure all required fields are present
      return {
        ...DEFAULT_SETTINGS,
        ...parsedSettings
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      return DEFAULT_SETTINGS;
    }
  });

  // Ref for debouncing
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Memoized save function
  const saveSettings = useCallback((settingsToSave: GenerationSettings) => {
    try {
      const serializedSettings = JSON.stringify(settingsToSave);
      localStorage.setItem('generation_settings', serializedSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, []);

  // Debounced settings persistence with stable dependencies
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveSettings(settings);
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [settings, saveSettings]);

  // Memoized settings validator
  const validateSettings = useCallback((updated: GenerationSettings): GenerationSettings => {
    // Validate LoRA scales match LoRAs length
    if (updated.hf_loras && updated.lora_scales) {
      if (updated.hf_loras.length !== updated.lora_scales.length) {
        updated.lora_scales = Array(updated.hf_loras.length).fill(0.8);
      }
    }
    
    // Ensure aspect ratio is valid
    if (updated.aspect_ratio && !['1:1', '3:4', '4:3'].includes(updated.aspect_ratio)) {
      updated.aspect_ratio = '1:1';
    }
    
    return updated;
  }, []);

  // Memoized settings updater
  const updateSettings = useCallback((newSettings: Partial<GenerationSettings>) => {
    setSettings(current => {
      const merged = { ...current, ...newSettings };
      return validateSettings(merged);
    });
  }, [validateSettings]);

  // Reset settings with stable reference
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem('generation_settings');
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  }, []); // Empty dependency array since it only uses constants

  return {
    settings,
    updateSettings,
    resetSettings
  };
};
