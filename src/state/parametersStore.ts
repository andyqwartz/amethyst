import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GenerationParameters {
  prompt: string;
  negativePrompt: string;
  seed: number;
  steps: number;
  cfgScale: number;
  width: number;
  height: number;
  batchSize: number;
  scheduler: string;
  referenceImage?: string; // Base64 encoded image
  strength?: number;
  noise?: number;
}

interface ParametersState {
  parameters: GenerationParameters;
  setParameters: (params: Partial<GenerationParameters>) => void;
  resetParameters: () => void;
  saveReferenceImage: (imageData: string) => void;
  clearReferenceImage: () => void;
}

const DEFAULT_PARAMETERS: GenerationParameters = {
  prompt: '',
  negativePrompt: '',
  seed: -1,
  steps: 20,
  cfgScale: 7.5,
  width: 512,
  height: 512,
  batchSize: 1,
  scheduler: 'euler_a',
  referenceImage: undefined,
  strength: 0.75,
  noise: 0.2,
};

export const useParametersStore = create<ParametersState>()(
  persist(
    (set) => ({
      parameters: { ...DEFAULT_PARAMETERS },
      
      setParameters: (newParams) =>
        set((state) => ({
          parameters: {
            ...state.parameters,
            ...newParams,
          },
        })),

      resetParameters: () =>
        set(() => ({
          parameters: { ...DEFAULT_PARAMETERS },
        })),

      saveReferenceImage: (imageData) =>
        set((state) => ({
          parameters: {
            ...state.parameters,
            referenceImage: imageData,
          },
        })),

      clearReferenceImage: () =>
        set((state) => ({
          parameters: {
            ...state.parameters,
            referenceImage: undefined,
            strength: DEFAULT_PARAMETERS.strength,
            noise: DEFAULT_PARAMETERS.noise,
          },
        })),
    }),
    {
      name: 'amethyst-parameters',
      partialize: (state) => ({
        parameters: {
          ...state.parameters,
          // Ensure reference image is properly serialized
          referenceImage: state.parameters.referenceImage || undefined,
        },
      }),
      // Version the storage to handle future schema changes
      version: 1,
      // Migration function for future versions
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Handle migration from version 0 if needed
          return {
            ...persistedState,
            parameters: {
              ...DEFAULT_PARAMETERS,
              ...persistedState.parameters,
            },
          };
        }
        return persistedState;
      },
    }
  )
);