import { useEffect } from 'react';
import { GenerationStatus, GenerationSettings } from '@/types/replicate';

const GENERATION_STATUS_KEY = 'generation_status';
const GENERATION_PROGRESS_KEY = 'generation_progress';
const GENERATION_TIMESTAMP_KEY = 'generation_timestamp';
const GENERATION_FILE_KEY = 'generation_file';
const GENERATION_SETTINGS_KEY = 'generation_settings';
const GENERATION_ID_KEY = 'generation_id';

interface PersistenceResult {
  shouldRetry: boolean;
  savedFile: string | null;
  savedSettings: GenerationSettings | null;
}

export const useGenerationPersistence = (
  status: GenerationStatus,
  progress: number,
  setStatus: (status: GenerationStatus) => void,
  setProgress: (progress: number) => void,
  file?: string | null,
  settings?: GenerationSettings
): PersistenceResult => {
  // Save state
  useEffect(() => {
    if (status === 'loading') {
      console.log('Saving generation state:', { status, progress, file, settings });
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
      console.log('Clearing generation state due to completion:', status);
      localStorage.removeItem(GENERATION_STATUS_KEY);
      localStorage.removeItem(GENERATION_PROGRESS_KEY);
      localStorage.removeItem(GENERATION_TIMESTAMP_KEY);
      localStorage.removeItem(GENERATION_FILE_KEY);
      localStorage.removeItem(GENERATION_SETTINGS_KEY);
      localStorage.removeItem(GENERATION_ID_KEY);
    }
  }, [status, progress, file, settings]);

  // Restore state on load
  useEffect(() => {
    const savedStatus = localStorage.getItem(GENERATION_STATUS_KEY) as GenerationStatus | null;
    const savedProgress = localStorage.getItem(GENERATION_PROGRESS_KEY);
    const savedTimestamp = localStorage.getItem(GENERATION_TIMESTAMP_KEY);
    const savedSettingsStr = localStorage.getItem(GENERATION_SETTINGS_KEY);
    const savedSettings = savedSettingsStr ? JSON.parse(savedSettingsStr) as GenerationSettings : null;

    if (savedStatus === 'loading' && savedProgress && savedTimestamp) {
      const timePassed = Date.now() - Number(savedTimestamp);
      
      // If more than 5 minutes have passed, clean everything
      if (timePassed > 5 * 60 * 1000) {
        console.log('Generation state expired, clearing...');
        localStorage.removeItem(GENERATION_STATUS_KEY);
        localStorage.removeItem(GENERATION_PROGRESS_KEY);
        localStorage.removeItem(GENERATION_TIMESTAMP_KEY);
        localStorage.removeItem(GENERATION_FILE_KEY);
        localStorage.removeItem(GENERATION_SETTINGS_KEY);
        localStorage.removeItem(GENERATION_ID_KEY);
        setStatus('idle');
        setProgress(0);
      } else {
        console.log('Restoring generation state:', { savedStatus, savedProgress, savedSettings });
        setStatus('loading');
        setProgress(Number(savedProgress));
      }
    }
  }, [setStatus, setProgress]);

  return {
    shouldRetry: localStorage.getItem(GENERATION_STATUS_KEY) === 'loading',
    savedFile: localStorage.getItem(GENERATION_FILE_KEY),
    savedSettings: localStorage.getItem(GENERATION_SETTINGS_KEY) ? 
      JSON.parse(localStorage.getItem(GENERATION_SETTINGS_KEY)!) as GenerationSettings : 
      null
  };
};