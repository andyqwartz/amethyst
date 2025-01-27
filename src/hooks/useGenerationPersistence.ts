import { useEffect } from 'react';
import { GenerationStatus } from '@/types/replicate';

const GENERATION_STATUS_KEY = 'generation_status';
const GENERATION_PROGRESS_KEY = 'generation_progress';

export const useGenerationPersistence = (
  status: GenerationStatus,
  progress: number,
  setStatus: (status: GenerationStatus) => void,
  setProgress: (progress: number) => void
) => {
  // Sauvegarder l'état
  useEffect(() => {
    if (status === 'loading') {
      localStorage.setItem(GENERATION_STATUS_KEY, status);
      localStorage.setItem(GENERATION_PROGRESS_KEY, progress.toString());
    } else {
      localStorage.removeItem(GENERATION_STATUS_KEY);
      localStorage.removeItem(GENERATION_PROGRESS_KEY);
    }
  }, [status, progress]);

  // Restaurer l'état au chargement
  useEffect(() => {
    const savedStatus = localStorage.getItem(GENERATION_STATUS_KEY) as GenerationStatus | null;
    const savedProgress = localStorage.getItem(GENERATION_PROGRESS_KEY);

    if (savedStatus === 'loading') {
      setStatus('loading');
      if (savedProgress) {
        setProgress(Number(savedProgress));
      }
    }
  }, []);
};