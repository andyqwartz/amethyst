import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useImageGeneratorState = () => {
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

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