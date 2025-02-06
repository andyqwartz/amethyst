import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useImageGeneratorState = () => {
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(() => {
    // Check if the image was explicitly removed
    const wasRemoved = localStorage.getItem('referenceImageRemoved') === 'true';
    if (wasRemoved) {
      return null;
    }
    // Try to get the saved reference image
    return localStorage.getItem('referenceImage');
  });

  // Update localStorage when reference image changes
  useEffect(() => {
    if (referenceImage) {
      localStorage.setItem('referenceImage', referenceImage);
      localStorage.removeItem('referenceImageRemoved');
    }
  }, [referenceImage]);

  const handleRemoveReferenceImage = () => {
    setReferenceImage(null);
    localStorage.removeItem('referenceImage');
    localStorage.setItem('referenceImageRemoved', 'true');
  };

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
    handleRemoveReferenceImage,
    toast
  };
};