import { create } from 'zustand';

interface GenerationState {
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  progress: number;
  setProgress: (progress: number) => void;
  currentLogs: string;
  setCurrentLogs: (logs: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useGenerationState = create<GenerationState>((set) => ({
  isGenerating: false,
  setIsGenerating: (isGenerating: boolean) => set({ isGenerating }),
  progress: 0,
  setProgress: (progress: number) => set({ progress }),
  currentLogs: '',
  setCurrentLogs: (currentLogs: string) => set({ currentLogs }),
  error: null,
  setError: (error: string | null) => set({ error }),
  reset: () =>
    set({
      isGenerating: false,
      progress: 0,
      currentLogs: '',
      error: null,
    }),
}));
