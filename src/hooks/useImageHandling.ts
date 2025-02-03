import { useCallback } from 'react'
import { useImageGeneratorStore } from '@/state/imageGeneratorStore'
import { checkSession } from '@/lib/supabase/client'
import { useImageStorage } from './useImageStorage'
import { useAuth } from './useAuth'
import type { GenerationParameters } from '@/types/generation'

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

  const { user } = useAuth()
  const { storeGeneratedImage } = useImageStorage()

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
    if (!user) {
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

      // Convertir les paramètres au nouveau format
      const generationParams: GenerationParameters = {
        prompt: settings.prompt,
        negative_prompt: settings.negative_prompt,
        width: settings.width,
        height: settings.height,
        num_inference_steps: settings.steps,
        guidance_scale: settings.guidance_scale,
        seed: settings.seed,
        strength: settings.strength,
        reference_image_id: settings.initImage || undefined,
        reference_image_strength: settings.strength,
        output_format: 'png',
        output_quality: 100,
        num_outputs: 1
      }

      // Stocker l'image générée
      const generatedImage = await storeGeneratedImage(
        response.imageUrl!,
        generationParams,
        user.id
      )

      // Mettre à jour l'interface
      setCurrentImage({
        id: generatedImage.id,
        url: generatedImage.public_url!,
        timestamp: new Date(generatedImage.created_at).getTime(),
        settings: settings
      })

      return { success: true, imageUrl: generatedImage.public_url }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      handleError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsGenerating(false)
    }
  }, [
    user,
    settings,
    setCurrentImage,
    setIsGenerating,
    clearError,
    handleError,
    storeGeneratedImage
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
