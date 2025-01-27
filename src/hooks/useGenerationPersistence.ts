import { useEffect } from 'react';
import { GenerationStatus } from '@/types/replicate';

const GENERATION_STATUS_KEY = 'generation_status';
const GENERATION_PROGRESS_KEY = 'generation_progress';
const GENERATION_TIMESTAMP_KEY = 'generation_timestamp';
const GENERATION_FILE_KEY = 'generation_file';

export const useGenerationPersistence = (
  status: GenerationStatus,
  progress: number,
  setStatus: (status: GenerationStatus) => void,
  setProgress: (progress: number) => void,
  file?: string | null
) => {
  // Save state
  useEffect(() => {
    if (status === 'loading') {
      localStorage.setItem(GENERATION_STATUS_KEY, status);
      localStorage.setItem(GENERATION_PROGRESS_KEY, progress.toString());
      localStorage.setItem(GENERATION_TIMESTAMP_KEY, Date.now().toString());
      if (file) {
        localStorage.setItem(GENERATION_FILE_KEY, file);
      }
    } else if (status === 'success' || status === 'error') {
      // Only clear if generation is complete or failed
      localStorage.removeItem(GENERATION_STATUS_KEY);
      localStorage.removeItem(GENERATION_PROGRESS_KEY);
      localStorage.removeItem(GENERATION_TIMESTAMP_KEY);
      // Keep the file even after generation completes
    }
  }, [status, progress, file]);

  // Restore state on load
  useEffect(() => {
    const savedStatus = localStorage.getItem(GENERATION_STATUS_KEY) as GenerationStatus | null;
    const savedProgress = localStorage.getItem(GENERATION_PROGRESS_KEY);
    const savedTimestamp = localStorage.getItem(GENERATION_TIMESTAMP_KEY);

    if (savedStatus === 'loading' && savedProgress && savedTimestamp) {
      const timePassed = Date.now() - Number(savedTimestamp);
      
      // If more than 5 minutes have passed, assume the generation failed
      if (timePassed > 5 * 60 * 1000) {
        localStorage.removeItem(GENERATION_STATUS_KEY);
        localStorage.removeItem(GENERATION_PROGRESS_KEY);
        localStorage.removeItem(GENERATION_TIMESTAMP_KEY);
        return;
      }

      setStatus('loading');
      setProgress(Number(savedProgress));
    }
  }, []);

  return {
    savedFile: localStorage.getItem(GENERATION_FILE_KEY)
  };
};
