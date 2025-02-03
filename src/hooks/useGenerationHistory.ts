import { useState } from 'react';
import type { GenerationSettings } from '@/types/replicate';

interface HistoryItem {
  url: string;
  settings: GenerationSettings;
}

export const useGenerationHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  return {
    history,
    setHistory
  };
};