import { create } from 'zustand'

interface UIState {
  isSettingsOpen: boolean
  isHelpModalOpen: boolean
  isGenerating: boolean
  progress: number
  logs: string[]
  setSettingsOpen: (isOpen: boolean) => void
  setHelpModalOpen: (isOpen: boolean) => void
  setGenerating: (isGenerating: boolean) => void
  setProgress: (progress: number) => void
  addLog: (log: string) => void
  clearLogs: () => void
  reset: () => void
}

const initialState = {
  isSettingsOpen: false,
  isHelpModalOpen: false,
  isGenerating: false,
  progress: 0,
  logs: []
}

export const useUIState = create<UIState>((set) => ({
  ...initialState,

  setSettingsOpen: (isOpen: boolean) =>
    set({ isSettingsOpen: isOpen }),

  setHelpModalOpen: (isOpen: boolean) =>
    set({ isHelpModalOpen: isOpen }),

  setGenerating: (isGenerating: boolean) =>
    set({ isGenerating }),

  setProgress: (progress: number) =>
    set({ progress: Math.min(Math.max(progress, 0), 100) }),

  addLog: (log: string) =>
    set((state) => ({
      logs: [...state.logs, log]
    })),

  clearLogs: () =>
    set({ logs: [] }),

  reset: () =>
    set(initialState)
}))