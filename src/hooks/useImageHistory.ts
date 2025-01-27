import { useState, useEffect } from 'react';
import type { GenerationSettings } from '@/types/replicate';

interface HistoryImage {
  url: string;
  settings: GenerationSettings;
  timestamp: number;
}

const MAX_HISTORY = 10;

export const useImageHistory = () => {
  const [history, setHistory] = useState<HistoryImage[]>(() => {
    const saved = localStorage.getItem('image_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('image_history', JSON.stringify(history));
  }, [history]);

  const addToHistory = (url: string, settings: GenerationSettings) => {
    console.log('Adding image to history:', { url, settings });
    setHistory(prev => {
      const newHistory = [
        { url, settings, timestamp: Date.now() },
        ...prev,
      ].slice(0, MAX_HISTORY);
      return newHistory;
    });
  };

  const clearHistory = () => {
    console.log('Clearing image history');
    setHistory([]);
  };

  return { history, addToHistory, clearHistory };
};