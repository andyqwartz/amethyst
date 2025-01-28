import { useState, useEffect } from 'react';
import { useGenerationPersistence } from './useGenerationPersistence';
import { GenerationStatus, GenerationSettings } from '@/types/replicate';

export const useGenerationProgress = (
  isGenerating: boolean, 
  referenceImage?: string | null,
  settings?: GenerationSettings,
  onRetry?: (settings: GenerationSettings) => void
) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<GenerationStatus>('idle');

  const { shouldRetry, savedFile, savedSettings } = useGenerationPersistence(
    isGenerating ? 'loading' : status,
    progress,
    setStatus,
    setProgress,
    referenceImage,
    settings
  );

  // Réinitialiser le progrès quand la génération est terminée
  useEffect(() => {
    if (!isGenerating) {
      setProgress(0);
      setStatus('idle');
      localStorage.removeItem('generation_status');
      localStorage.removeItem('generation_progress');
      localStorage.removeItem('generation_timestamp');
      return;
    }
  }, [isGenerating]);

  // Gérer la reprise d'une génération en cours
  useEffect(() => {
    if (shouldRetry && savedSettings && onRetry) {
      console.log('Reprise de la génération avec les paramètres sauvegardés:', savedSettings);
      onRetry(savedSettings);
    }
  }, [shouldRetry, savedSettings, onRetry]);

  // Mettre à jour la progression uniquement pendant la génération
  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setProgress(current => {
        if (current >= 95) {
          clearInterval(interval);
          return current;
        }
        const increment = Math.max(0.5, (95 - current) * 0.05);
        return Math.min(95, current + increment);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isGenerating]);

  return { 
    progress, 
    setProgress,
    status,
    savedFile,
    savedSettings
  };
};