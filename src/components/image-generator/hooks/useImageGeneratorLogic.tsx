import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useGenerationSettings } from '@/hooks/useGenerationSettings';
import { useImageHistory } from '@/hooks/useImageHistory';
import { useImageGeneratorState } from './useImageGeneratorState';
import { useImageUpload } from './useImageUpload';
import { useGenerationEffects } from '@/hooks/generation/useGenerationEffects';
import { useProgressChecking } from '@/hooks/generation/useProgressChecking';
import { useGenerationHandlers } from '@/hooks/generation/useGenerationHandlers';
import { useToast } from "@/hooks/use-toast";
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
  const { status: generationStatus, generatedImages, generate } = useImageGeneration();
  const { history, isLoading, addToHistory } = useImageHistory();
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
      if (settings.reference_image_url) {
        const response = await fetch(settings.reference_image_url);
        const blob = await response.blob();
        const file = new File([blob], `reference-${Date.now()}.${settings.output_format || 'webp'}`, { type: blob.type });
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('reference-images')
          .upload(`reference-${Date.now()}.${settings.output_format || 'webp'}`, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('reference-images')
          .getPublicUrl(uploadData.path);

        setReferenceImage(publicUrl);
      }

      updateSettings({
        ...settings,
        hf_loras: settings.hf_loras || [],
        lora_scales: settings.lora_scales || [],
        prompt: settings.prompt || '',
        negative_prompt: settings.negative_prompt || '',
        guidance_scale: settings.guidance_scale || 7.5,
        num_inference_steps: settings.num_inference_steps || 30,
        aspect_ratio: settings.aspect_ratio || '1:1',
        output_format: settings.output_format || 'webp',
        output_quality: settings.output_quality || 80,
        prompt_strength: settings.prompt_strength || 0.8,
      });

      setShowSettings(true);

      toast({
        title: "Paramètres restaurés",
        description: "Les paramètres de génération ont été restaurés avec succès",
      });
    } catch (error) {
      console.error('Error in handleTweak:', error);
      toast({
        title: "Erreur",
        description: "Impossible de restaurer les paramètres",
        variant: "destructive"
      });
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
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour supprimer une image",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('images')
        .delete()
        .eq('url', imageUrl)
        .eq('user_id', session.session.user.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Image supprimée avec succès",
      });

      const updatedHistory = history.filter(item => item.url !== imageUrl);
      addToHistory(updatedHistory);
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Erreur",
        description: "Échec de la suppression de l'image",
        variant: "destructive"
      });
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