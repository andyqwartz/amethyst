import create from 'zustand'
import { devtools } from 'zustand/middleware'

interface ImageSettings {
  prompt: string
  negativePrompt: string
  width: number
  height: number
  steps: number
  seed: number
  guidanceScale: number
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
  isSettingsModalOpen: boolean
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
  updateSettings: (settings: Partial<ImageSettings>) => void
  resetSettings: () => void
  
  // Image generation actions
  setCurrentImage: (image: GeneratedImage | null) => void
  addGeneratedImage: (image: GeneratedImage) => void
  clearGeneratedImages: () => void
  
  // History actions
  addToHistory: (image: GeneratedImage) => void
  clearHistory: () => void
  
  // UI state actions
  setIsGenerating: (isGenerating: boolean) => void
  setIsSettingsModalOpen: (isOpen: boolean) => void
  setIsSaving: (isSaving: boolean) => void
  setCurrentTab: (tab: string) => void
  
  // Error handling
  setError: (message: string) => void
  clearError: () => void
  
  // Reset all state
  resetState: () => void
}

const initialSettings: ImageSettings = {
  prompt: '',
  negativePrompt: '',
  width: 512,
  height: 512,
  steps: 20,
  seed: -1,
  guidanceScale: 7.5,
  img2img: false,
  strength: 0.75,
  initImage: null
}

const initialUIState: UIState = {
  isGenerating: false,
  isSettingsModalOpen: false,
  isSaving: false,
  currentTab: 'generate'
}

const initialErrorState: ErrorState = {
  hasError: false,
  errorMessage: ''
}

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
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),
      resetSettings: () =>
        set(() => ({
          settings: initialSettings
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
      setIsSettingsModalOpen: (isOpen) =>
        set((state) => ({
          ui: { ...state.ui, isSettingsModalOpen: isOpen }
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
)
