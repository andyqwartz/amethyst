import { useCallback } from 'react'
import { useImageGeneratorStore } from '@/state/imageGeneratorStore'
import { checkSession } from '@/integrations/supabase/client'

interface GenerateImageResponse {
  success: boolean
  imageUrl?: string
  error?: string
}

export const useImageHandling = () => {
  const {
    settings,
    setCurrentImage,
    setIsGenerating,
    setError,
    clearError,
    addGeneratedImage,
    addToHistory
  } = useImageGeneratorStore()

  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    try {
      await checkSession()
      return true
    } catch (error) {
      return false
    }
  }, [])

  const handleError = useCallback((error: string) => {
    setError(error)
    setIsGenerating(false)
  }, [setError, setIsGenerating])

  const generateImage = useCallback(async (): Promise<GenerateImageResponse> => {
    const isAuthenticated = await checkAuthStatus()
    if (!isAuthenticated) {
      handleError('Authentication required')
      return { success: false, error: 'Authentication required' }
    }

    try {
      setIsGenerating(true)
      clearError()

      // TODO: Replace with actual API call
      const response = await mockImageGeneration()

      if (!response.success) {
        handleError(response.error || 'Failed to generate image')
        return response
      }

      const newImage = {
        id: Date.now().toString(),
        url: response.imageUrl!,
        timestamp: Date.now(),
        settings: { ...settings }
      }

      setCurrentImage(newImage)
      addGeneratedImage(newImage)
      addToHistory(newImage)

      return { success: true, imageUrl: response.imageUrl }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      handleError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsGenerating(false)
    }
  }, [
    settings,
    setCurrentImage,
    setIsGenerating,
    clearError,
    handleError,
    addGeneratedImage,
    addToHistory,
    checkAuthStatus
  ])

  const setGeneratedImage = useCallback((imageUrl: string) => {
    const newImage = {
      id: Date.now().toString(),
      url: imageUrl,
      timestamp: Date.now(),
      settings: { ...settings }
    }
    setCurrentImage(newImage)
    addGeneratedImage(newImage)
    addToHistory(newImage)
  }, [settings, setCurrentImage, addGeneratedImage, addToHistory])

  // Mock function for development - remove in production
  const mockImageGeneration = async (): Promise<GenerateImageResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          imageUrl: 'https://placeholder.com/generated-image.jpg'
        })
      }, 2000)
    })
  }

  return {
    generateImage,
    setGeneratedImage,
    checkAuthStatus,
    handleError
  }
}
