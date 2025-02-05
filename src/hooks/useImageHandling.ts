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
      handleError('Authentification requise')
      return { success: false, error: 'Authentification requise' }
    }

    try {
      setIsGenerating(true)
      clearError()

      // Préparer les paramètres de génération
      const generationParams: GenerationParameters = {
        prompt: settings.prompt,
        negative_prompt: settings.negative_prompt || '',
        width: settings.width || 512,
        height: settings.height || 512,
        num_inference_steps: settings.steps || 20,
        guidance_scale: settings.guidance_scale || 7.5,
        seed: settings.seed || Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        scheduler: settings.scheduler || 'DPMSolverMultistep',
        strength: settings.strength || 1.0,
        num_outputs: settings.num_outputs || 1,
        aspect_ratio: `${settings.width}:${settings.height}`,
        output_format: settings.output_format || 'png',
        output_quality: settings.output_quality || 100,
        prompt_strength: settings.prompt_strength || 0.8,
        hf_loras: settings.hf_loras || [],
        lora_scales: settings.lora_scales || [],
        disable_safety_checker: settings.disable_safety_checker || false,
        reference_image_id: settings.reference_image_id,
        reference_image_strength: settings.reference_image_strength || 0.75,
        model_version: settings.model_version || 'SDXL 1.0'
      }

      // Appel à l'API de génération (à implémenter)
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generationParams),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erreur lors de la génération')
      }

      const result = await response.json()

      // Stocker l'image générée
      const generatedImage = await storeGeneratedImage(
        result.imageUrl,
        generationParams,
        user.id
      )

      // Mettre à jour l'interface
      const newImage = {
        id: generatedImage.id,
        url: generatedImage.public_url!,
        timestamp: new Date(generatedImage.created_at).getTime(),
        settings: settings
      }

      setCurrentImage(newImage)
      addGeneratedImage(newImage)
      addToHistory(newImage)

      return { success: true, imageUrl: generatedImage.public_url }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
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
    storeGeneratedImage,
    addGeneratedImage,
    addToHistory
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
