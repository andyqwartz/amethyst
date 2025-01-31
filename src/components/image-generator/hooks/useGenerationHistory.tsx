import { useState, useEffect, useCallback } from 'react';

export interface GenerationHistoryItem {
  id: string;
  prompt: string;
  negativePrompt?: string;
  imageUrl: string;
  timestamp: number;
  parameters?: {
    steps: number;
    cfgScale: number;
    seed?: number;
    width: number;
    height: number;
  };
}

export interface UseGenerationHistoryReturn {
  history: GenerationHistoryItem[];
  addToHistory: (item: Omit<GenerationHistoryItem, 'id' | 'timestamp'>) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  isLoading: boolean;
  error: Error | null;
}

const STORAGE_KEY = 'image-generation-history';

export const useGenerationHistory = (): UseGenerationHistoryReturn => {
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load history'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save history'));
    }
  }, [history]);

  const addToHistory = useCallback((item: Omit<GenerationHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: GenerationHistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    setHistory((prev) => [newItem, ...prev]);
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    isLoading,
    error,
  };
};