import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import type { GenerationSettings } from '@/types/replicate';

const REFERENCE_IMAGE_KEY = 'reference_image';

export const useImageGeneratorState = () => {
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(() => {
    return localStorage.getItem(REFERENCE_IMAGE_KEY);
  });

  useEffect(() => {
    if (referenceImage) {
      localStorage.setItem(REFERENCE_IMAGE_KEY, referenceImage);
    } else {
      localStorage.removeItem(REFERENCE_IMAGE_KEY);
    }
  }, [referenceImage]);

  return {
    showSettings,
    setShowSettings,
    showHelp,
    setShowHelp,
    showHistory,
    setShowHistory,
    isGenerating,
    setIsGenerating,
    referenceImage,
    setReferenceImage,
    toast
  };
};