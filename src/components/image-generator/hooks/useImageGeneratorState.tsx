import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useImageGeneratorState = () => {
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(() => {
    const wasRemoved = localStorage.getItem('referenceImageRemoved') === 'true';
    if (wasRemoved) {
      return null;
    }
    return localStorage.getItem('referenceImage');
  });

  useEffect(() => {
    if (referenceImage) {
      localStorage.setItem('referenceImage', referenceImage);
      localStorage.removeItem('referenceImageRemoved');
    }
  }, [referenceImage]);

  // Add listener for generation-complete event
  useEffect(() => {
    const handleGenerationComplete = () => {
      console.log('Generation complete event received');
      setIsGenerating(false);
    };

    window.addEventListener('generation-complete', handleGenerationComplete);
    return () => {
      window.removeEventListener('generation-complete', handleGenerationComplete);
    };
  }, []);

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