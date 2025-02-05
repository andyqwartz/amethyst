import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
<<<<<<< HEAD
import type { GenerationSettings } from '@/types/replicate'
import { ImageSettings } from '@/types/generation'

type ImageSettings = Omit<GenerationSettings, 'aspect_ratio'> & {
  width: number
  height: number
  steps: number
  img2img: boolean
  strength: number
  initImage: string | null
}

interface GeneratedImage {
  id: string
  url: string
  timestamp: number
  settings: ImageSettings
}

interface UIState {
  isGenerating: boolean
  showSettings: boolean
  isSaving: boolean
  currentTab: string
}

interface ErrorState {
  hasError: boolean
  errorMessage: string
}

interface ImageGeneratorState {
  settings: ImageSettings
  currentImage: GeneratedImage | null
  generatedImages: GeneratedImage[]
  history: GeneratedImage[]
  ui: UIState
  error: ErrorState
  
  // Settings actions
  setSettings: (settings: ImageSettings | ((prev: ImageSettings) => ImageSettings)) => void
  
  // Image generation actions
  setCurrentImage: (image: GeneratedImage | null) => void
  addGeneratedImage: (image: GeneratedImage) => void
  clearGeneratedImages: () => void
  
  // History actions
  addToHistory: (image: GeneratedImage) => void
  clearHistory: () => void
  
  // UI state actions
  setIsGenerating: (isGenerating: boolean) => void
  setShowSettings: (show: boolean) => void
  setIsSaving: (isSaving: boolean) => void
  setCurrentTab: (tab: string) => void
  
  // Error handling
  setError: (message: string) => void
  clearError: () => void
  
  // Reset all state
  resetState: () => void
=======
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
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
}

const initialSettings: ImageSettings = {
  prompt: '',
  negative_prompt: '',
  width: 512,
  height: 512,
  steps: 20,
<<<<<<< HEAD
  seed: -1,
  guidance_scale: 7.5,
=======
  guidance_scale: 7.5,
  num_inference_steps: 28,
  seed: -1,
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
  img2img: false,
  strength: 0.75,
  initImage: null,
  output_format: 'webp',
  output_quality: 90,
  num_outputs: 1,
<<<<<<< HEAD
  num_inference_steps: 28,
  prompt_strength: 0.8,
  disable_safety_checker: false,
  hf_loras: ["AndyVampiro/fog"],
  lora_scales: [1.0],
  aspect_ratio: '1:1'
}
=======
  prompt_strength: 0.8,
  hf_loras: ["AndyVampiro/fog"],
  lora_scales: [1.0],
  disable_safety_checker: false
};
>>>>>>> a945a29ba778c4116754a03171a654de675e5402

const initialUIState: UIState = {
  isGenerating: false,
  showSettings: false,
  isSaving: false,
  currentTab: 'generate'
<<<<<<< HEAD
}
=======
};
>>>>>>> a945a29ba778c4116754a03171a654de675e5402

const initialErrorState: ErrorState = {
  hasError: false,
  errorMessage: ''
<<<<<<< HEAD
}
=======
};
>>>>>>> a945a29ba778c4116754a03171a654de675e5402

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
<<<<<<< HEAD
=======
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),
>>>>>>> a945a29ba778c4116754a03171a654de675e5402

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
<<<<<<< HEAD
)
=======
);
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
