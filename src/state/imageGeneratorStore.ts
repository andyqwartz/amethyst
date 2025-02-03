import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { GenerationSettings, ImageSettings, GeneratedImage } from '@/types/generation'

interface UIState {
  isGenerating: boolean;
  showSettings: boolean;
  isSaving: boolean;
  currentTab: string;
}

interface ErrorState {
  hasError: boolean;
  errorMessage: string;
}

interface ImageGeneratorState {
  settings: ImageSettings;
  currentImage: GeneratedImage | null;
  generatedImages: GeneratedImage[];
  history: GenerationHistoryItem[];
  ui: UIState;
  error: ErrorState;
  
  // Settings actions
  setSettings: (settings: ImageSettings | ((prev: ImageSettings) => ImageSettings)) => void;
  updateSettings: (settings: Partial<ImageSettings>) => void;
  
  // Image generation actions
  setCurrentImage: (image: GeneratedImage | null) => void;
  addGeneratedImage: (image: GeneratedImage) => void;
  clearGeneratedImages: () => void;
  
  // History actions
  addToHistory: (image: GenerationHistoryItem) => void;
  clearHistory: () => void;
  
  // UI state actions
  setIsGenerating: (isGenerating: boolean) => void;
  setShowSettings: (show: boolean) => void;
  setIsSaving: (isSaving: boolean) => void;
  setCurrentTab: (tab: string) => void;
  
  // Error handling
  setError: (message: string) => void;
  clearError: () => void;
  
  // Reset all state
  resetState: () => void;
}

const initialSettings: ImageSettings = {
  prompt: '',
  negative_prompt: '',
  width: 512,
  height: 512,
  steps: 20,
  guidance_scale: 7.5,
  num_inference_steps: 28,
  seed: -1,
  img2img: false,
  strength: 0.75,
  initImage: null,
  output_format: 'webp',
  output_quality: 90,
  num_outputs: 1,
  prompt_strength: 0.8,
  hf_loras: ["AndyVampiro/fog"],
  lora_scales: [1.0],
  disable_safety_checker: false
};

const initialUIState: UIState = {
  isGenerating: false,
  showSettings: false,
  isSaving: false,
  currentTab: 'generate'
};

const initialErrorState: ErrorState = {
  hasError: false,
  errorMessage: ''
};

export const useImageGeneratorStore = create<ImageGeneratorState>()(
  devtools(
    (set) => ({
      // Initial state
      settings: initialSettings,
      currentImage: null,
      generatedImages: [],
      history: [],
      ui: initialUIState,
      error: initialErrorState,

      // Settings actions
      setSettings: (newSettings) =>
        set((state) => ({
          settings: typeof newSettings === 'function' 
            ? newSettings(state.settings)
            : newSettings
        })),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),

      // Image generation actions
      setCurrentImage: (image) =>
        set(() => ({
          currentImage: image
        })),
      addGeneratedImage: (image) =>
        set((state) => ({
          generatedImages: [...state.generatedImages, image]
        })),
      clearGeneratedImages: () =>
        set(() => ({
          generatedImages: []
        })),

      // History actions
      addToHistory: (image) =>
        set((state) => ({
          history: [...state.history, image]
        })),
      clearHistory: () =>
        set(() => ({
          history: []
        })),

      // UI state actions
      setIsGenerating: (isGenerating) =>
        set((state) => ({
          ui: { ...state.ui, isGenerating }
        })),
      setShowSettings: (show) =>
        set((state) => ({
          ui: { ...state.ui, showSettings: show }
        })),
      setIsSaving: (isSaving) =>
        set((state) => ({
          ui: { ...state.ui, isSaving }
        })),
      setCurrentTab: (tab) =>
        set((state) => ({
          ui: { ...state.ui, currentTab: tab }
        })),

      // Error handling
      setError: (message) =>
        set(() => ({
          error: { hasError: true, errorMessage: message }
        })),
      clearError: () =>
        set(() => ({
          error: initialErrorState
        })),

      // Reset all state
      resetState: () =>
        set(() => ({
          settings: initialSettings,
          currentImage: null,
          generatedImages: [],
          history: [],
          ui: initialUIState,
          error: initialErrorState
        }))
    }),
    { name: 'ImageGeneratorStore' }
  )
);