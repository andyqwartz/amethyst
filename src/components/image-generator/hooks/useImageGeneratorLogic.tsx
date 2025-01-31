import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useGenerationSettings } from '@/hooks/useGenerationSettings';
import { useImageHistory } from '@/hooks/useImageHistory';
import { useImageGeneratorState } from './useImageGeneratorState';
import { useImageUpload } from './useImageUpload';
import { useGenerationEffects } from '@/hooks/generation/useGenerationEffects';
import { useProgressChecking } from '@/hooks/generation/useProgressChecking';
import { useGenerationHandlers } from '@/hooks/generation/useGenerationHandlers';
import { useToast } from "@/hooks/useToast";
import { fetchAndProcessReferenceImage, uploadReferenceImage, deleteReferenceImage } from '@/services/storageUtils';
import { supabase } from '@/integrations/supabase/client';
import type { GenerationSettings } from '@/types/replicate';

export const useImageGeneratorLogic = () => {
  const {
    showSettings,
    setShowSettings,
    showHelp,
    setShowHelp,
    showHistory,
    setShowHistory,
    isGenerating,
    setIsGenerating,
    referenceImage,
    setReferenceImage,
    handleRemoveReferenceImage,
    toast
  } = useImageGeneratorState();

  const { settings, updateSettings, resetSettings } = useGenerationSettings();
  const { 
    status: generationStatus, 
    generatedImages = [], 
    generate 
  } = useImageGeneration();
  
  const { 
    history = [], 
    isLoading = false, 
    addToHistory, 
    setHistory 
  } = useImageHistory();
  const { handleImageUpload, handleImageClick } = useImageUpload(setReferenceImage);

  const { currentLogs, progress, setProgress, status } = useProgressChecking(isGenerating);

  const handleDownload = async (imageUrl: string, outputFormat: string) => {
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `generated-image-${Date.now()}.${outputFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive"
      });
    }
  };

  const handleTweak = async (settings: GenerationSettings) => {
    try {
      setIsLoading(true);
      let newReferenceImageUrl = referenceImage;

      // Handle reference image if present
      if (settings.reference_image_url) {
        try {
          // Clean up old reference image if it exists and is different from the new one
          if (referenceImage && referenceImage !== settings.reference_image_url) {
            await deleteReferenceImage(referenceImage).catch(error => {
              console.warn('Failed to cleanup old reference image:', error);
            });
          }

          // Only process and upload if it's a new image
          if (!referenceImage || referenceImage !== settings.reference_image_url) {
            // Fetch and process the new reference image
            const { file, contentType } = await fetchAndProcessReferenceImage(settings.reference_image_url);
            
            // Upload the new reference image
            const { publicUrl } = await uploadReferenceImage(file, contentType || undefined);
            
            newReferenceImageUrl = publicUrl;
            setReferenceImage(publicUrl);
          } else {
            newReferenceImageUrl = settings.reference_image_url;
          }
        } catch (imageError) {
          console.error('Error processing reference image:', imageError);
          toast.error("Impossible de traiter l'image de référence. Les autres paramètres seront restaurés.");
          // Keep the existing reference image if there's an error
          newReferenceImageUrl = referenceImage;
        }
      } else {
        // If no new reference image is provided, clean up the existing one
        if (referenceImage) {
          await deleteReferenceImage(referenceImage).catch(error => {
            console.warn('Failed to cleanup old reference image:', error);
          });
          newReferenceImageUrl = null;
          setReferenceImage(null);
        }
      }

      // Restore generation parameters with proper type checking and defaults
      const restoredSettings = {
        ...settings,
        reference_image_url: newReferenceImageUrl,
        hf_loras: Array.isArray(settings.hf_loras) ? settings.hf_loras : [],
        lora_scales: Array.isArray(settings.lora_scales) ? settings.lora_scales : [],
        prompt: settings.prompt || '',
        negative_prompt: settings.negative_prompt || '',
        guidance_scale: typeof settings.guidance_scale === 'number' ? settings.guidance_scale : 7.5,
        num_inference_steps: typeof settings.num_inference_steps === 'number' ? settings.num_inference_steps : 30,
        seed: typeof settings.seed === 'number' ? settings.seed : Math.floor(Math.random() * 1000000),
        num_outputs: typeof settings.num_outputs === 'number' ? settings.num_outputs : 1,
        aspect_ratio: settings.aspect_ratio || '1:1',
        output_format: settings.output_format || 'webp',
        output_quality: typeof settings.output_quality === 'number' ? settings.output_quality : 90,
        prompt_strength: typeof settings.prompt_strength === 'number' ? settings.prompt_strength : 0.8,
      };

      updateSettings(restoredSettings);
      setShowSettings(true);

      toast.success("Les paramètres de génération ont été restaurés avec succès");
      
      // Return the restored settings for potential chaining
      return restoredSettings;
    } catch (error) {
      console.error('Error in handleTweak:', error);
      toast.error("Impossible de restaurer les paramètres de génération");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const { handleGenerate: baseHandleGenerate } = useGenerationHandlers(
    setIsGenerating,
    generate,
    updateSettings,
    setShowSettings,
    setReferenceImage
  );

  const handleGenerate = async () => {
    if (isGenerating) return;

    const settingsWithImage = {
      ...settings,
      reference_image_url: referenceImage,
      hf_loras: settings.hf_loras || [],
      lora_scales: settings.lora_scales || []
    };

    try {
      await baseHandleGenerate(settingsWithImage, isGenerating);
    } catch (error) {
      console.error('Generation failed:', error);
      setIsGenerating(false);
      toast({
        title: "Erreur",
        description: "La génération a échoué",
        variant: "destructive"
      });
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    try {
      setIsLoading(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        toast.error("Vous devez être connecté pour supprimer une image");
        return;
      }

      // Supprimer l'image de la base de données
      const { error } = await supabase
        .from('images')
        .delete()
        .eq('url', imageUrl)
        .eq('user_id', session.session.user.id);

      if (error) throw error;

      // Mettre à jour l'historique local
      const updatedHistory = (history || []).filter(item => item.url !== imageUrl);
      setHistory(updatedHistory);

      toast.success("L'image a été supprimée avec succès");
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error("Impossible de supprimer l'image");
    } finally {
      setIsLoading(false);
    }
  };

  useGenerationEffects(
    referenceImage,
    updateSettings,
    generationStatus,
    generatedImages,
    settings,
    setIsGenerating,
    addToHistory
  );

  return {
    showSettings,
    setShowSettings,
    showHelp,
    setShowHelp,
    showHistory,
    setShowHistory,
    isGenerating,
    referenceImage,
    settings,
    generatedImages,
    history,
    isLoading,
    progress,
    currentLogs,
    handleImageUpload,
    handleImageClick,
    handleGenerate,
    handleTweak,
    handleDownload,
    handleDeleteImage,
    updateSettings,
    setReferenceImage,
    handleRemoveReferenceImage
  };
};
