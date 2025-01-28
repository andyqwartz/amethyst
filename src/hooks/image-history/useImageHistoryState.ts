import { useState } from 'react';
import type { ImageHistoryEntry, ImageHistoryState } from '@/types/image-history';

export const useImageHistoryState = () => {
  const [state, setState] = useState<ImageHistoryState>({
    history: [],
    allHistory: [],
    isLoading: true
  });

  const setHistory = (history: ImageHistoryEntry[]) => {
    setState(prev => ({
      ...prev,
      history: history.slice(0, 4),
      allHistory: history
    }));
  };

  const setLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  return {
    ...state,
    setHistory,
    setLoading
  };
};