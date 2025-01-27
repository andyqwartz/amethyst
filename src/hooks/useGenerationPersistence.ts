import { useEffect } from 'react';
import { GenerationStatus } from '@/types/replicate';

const GENERATION_STATUS_KEY = 'generation_status';
const GENERATION_PROGRESS_KEY = 'generation_progress';
const GENERATION_TIMESTAMP_KEY = 'generation_timestamp';
const GENERATION_FILE_KEY = 'generation_file';
const GENERATION_SETTINGS_KEY = 'generation_settings';

export const useGenerationPersistence = (
  status: GenerationStatus,
  progress: number,
  setStatus: (status: GenerationStatus) => void,
  setProgress: (progress: number) => void,
  file?: string | null,
  settings?: any
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
      if (settings) {
        localStorage.setItem(GENERATION_SETTINGS_KEY, JSON.stringify(settings));
      }
    } else if (status === 'success' || status === 'error') {
      // Clear generation state when completed or on error
      localStorage.removeItem(GENERATION_STATUS_KEY);
      localStorage.removeItem(GENERATION_PROGRESS_KEY);
      localStorage.removeItem(GENERATION_TIMESTAMP_KEY);
      localStorage.removeItem(GENERATION_FILE_KEY);
      localStorage.removeItem(GENERATION_SETTINGS_KEY);
    }
  }, [status, progress, file, settings]);

  // Restore state on load
  useEffect(() => {
    const savedStatus = localStorage.getItem(GENERATION_STATUS_KEY) as GenerationStatus | null;
    const savedProgress = localStorage.getItem(GENERATION_PROGRESS_KEY);
    const savedTimestamp = localStorage.getItem(GENERATION_TIMESTAMP_KEY);
    const savedSettings = localStorage.getItem(GENERATION_SETTINGS_KEY);

    if (savedStatus === 'loading' && savedProgress && savedTimestamp) {
      const timePassed = Date.now() - Number(savedTimestamp);
      
      // If more than 5 minutes have passed, clear everything
      if (timePassed > 5 * 60 * 1000) {
        localStorage.removeItem(GENERATION_STATUS_KEY);
        localStorage.removeItem(GENERATION_PROGRESS_KEY);
        localStorage.removeItem(GENERATION_TIMESTAMP_KEY);
        localStorage.removeItem(GENERATION_FILE_KEY);
        localStorage.removeItem(GENERATION_SETTINGS_KEY);
        setStatus('idle');
        setProgress(0);
        return;
      }

      setStatus('loading');
      setProgress(Number(savedProgress));

      // Automatically retry generation if settings are available
      if (savedSettings) {
        return {
          shouldRetry: true,
          settings: JSON.parse(savedSettings)
        };
      }
    }

    return {
      shouldRetry: false,
      savedFile: localStorage.getItem(GENERATION_FILE_KEY),
      savedSettings: savedSettings ? JSON.parse(savedSettings) : null
    };
  }, []);

  return {
    savedFile: localStorage.getItem(GENERATION_FILE_KEY),
    savedSettings: localStorage.getItem(GENERATION_SETTINGS_KEY)
  };
};