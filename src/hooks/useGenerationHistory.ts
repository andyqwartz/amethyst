import { useState } from 'react';
import type { GenerationSettings } from '@/types/replicate';

interface HistoryItem {
  url: string;
  settings: GenerationSettings;
}

export const useGenerationHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addToHistory = (item: HistoryItem) => {
    setHistory(prev => [...prev, item]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    history,
    addToHistory,
    clearHistory
  };
};