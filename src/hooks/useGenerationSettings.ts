import { useState, useEffect } from 'react';
import type { ImageSettings, ReferenceImage } from '@/types/generation';
import { defaultSettings } from '@/types/generation';

interface StoredSettings extends Omit<ImageSettings, 'initImage'> {
  referenceImage: ReferenceImage | null;
  initImage: string | null;
}

const validAspectRatios = ['1:1', '16:9', '21:9', '3:2', '2:3', '4:5', '5:4', '3:4', '4:3', '9:16', '9:21'] as const;
type AspectRatio = typeof validAspectRatios[number];

const isValidAspectRatio = (ratio: string): ratio is AspectRatio => {
  return validAspectRatios.includes(ratio as AspectRatio);
};

export const useGenerationSettings = () => {
  const [settings, setSettings] = useState<StoredSettings>(() => {
    try {
      const savedSettings = localStorage.getItem('generation_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        const aspectRatio = isValidAspectRatio(parsed.aspect_ratio) ? parsed.aspect_ratio : defaultSettings.aspect_ratio;
        return {
          ...defaultSettings,
          ...parsed,
          // Ensure aspect ratio is valid
          aspect_ratio: aspectRatio,
          // Ensure LoRA arrays are always initialized
          hf_loras: parsed.hf_loras?.length ? parsed.hf_loras : defaultSettings.hf_loras,
          lora_scales: parsed.lora_scales?.length ? parsed.lora_scales : defaultSettings.lora_scales,
          // Initialize reference image
          referenceImage: parsed.referenceImage || null,
          // Set initImage from referenceImage if it exists
          initImage: parsed.referenceImage?.public_url || null,
          // Set img2img based on referenceImage
          img2img: !!parsed.referenceImage,
          // Set reference image settings
          reference_image_url: parsed.referenceImage?.public_url || null,
          reference_image_strength: parsed.reference_image_strength || 0.5
        } as StoredSettings;
      }
      return {
        ...defaultSettings,
        referenceImage: null
      } as StoredSettings;
    } catch (error) {
      console.error('Error loading settings:', error);
      return {
        ...defaultSettings,
        referenceImage: null
      } as StoredSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('generation_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<StoredSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };

      // Validate aspect ratio
      if (newSettings.aspect_ratio && !isValidAspectRatio(newSettings.aspect_ratio)) {
        updated.aspect_ratio = prev.aspect_ratio;
      }

      // Ensure LoRA arrays are synchronized
      if (newSettings.hf_loras && !newSettings.lora_scales) {
        updated.lora_scales = Array(newSettings.hf_loras.length).fill(0.8);
      }
      if (newSettings.lora_scales && !newSettings.hf_loras) {
        updated.hf_loras = Array(newSettings.lora_scales.length).fill('lucataco/flux-dev-multi-lora:2389224e115448d9a77c07d7d45672b3f0aa45acacf1c5bcf51857ac295e3aec');
      }

      // Handle reference image
      if (newSettings.referenceImage !== undefined) {
        updated.referenceImage = newSettings.referenceImage;
        updated.img2img = !!newSettings.referenceImage;
        if (newSettings.referenceImage) {
          updated.initImage = newSettings.referenceImage.public_url;
          updated.reference_image_url = newSettings.referenceImage.public_url;
        } else {
          updated.initImage = null;
        }
      }
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings({
      ...defaultSettings,
      referenceImage: null
    } as StoredSettings);
    localStorage.removeItem('generation_settings');
  };

  return {
    settings,
    updateSettings,
    resetSettings
  };
};
