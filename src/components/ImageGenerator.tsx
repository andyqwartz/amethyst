import React, { useCallback, useState } from 'react';
import { useImageGeneratorLogic } from './image-generator/hooks/useImageGeneratorLogic';
import { ImageGeneratorContainer } from './image-generator/containers/ImageGeneratorContainer';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useGenerationState } from './image-generator/hooks/useGenerationState';
import { useGenerationSettings } from './image-generator/hooks/useGenerationSettings';
import { useImageHistory } from '@/hooks/useImageHistory';
import type { GenerationSettings } from '@/types/replicate';

const defaultSettings: GenerationSettings = {
  prompt: '',
  negative_prompt: '',
  guidance_scale: 7.5,
  num_inference_steps: 28,
  num_outputs: 1,
  aspect_ratio: '1:1',
  output_format: 'webp',
  output_quality: 90,
  prompt_strength: 0.8,
  hf_loras: [],
  lora_scales: [],
  disable_safety_checker: false
};

export const ImageGenerator = React.memo(() => {
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentLogs, setCurrentLogs] = useState<string>();
  
  const generationState = useGenerationState();
  const { settings, updateSettings } = useGenerationSettings();
  const { history, addToHistory, deleteImage } = useImageHistory();

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleImageClick = useCallback(() => {
    // Handle image click logic here
  }, []);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    // Handle image generation logic here
  }, []);

  const handleTweak = useCallback((tweakSettings: GenerationSettings) => {
    updateSettings(tweakSettings);
  }, [updateSettings]);

  const handleDownload = useCallback(async (imageUrl: string, outputFormat: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.download = `generated-image-${Date.now()}.${outputFormat}`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      toast({
        title: "Téléchargement réussi",
        description: "L'image a été téléchargée avec succès",
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleRemoveReferenceImage = useCallback(() => {
    setReferenceImage(null);
  }, []);

  const handleDeleteHistory = useCallback(async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour supprimer l'historique",
          variant: "destructive"
        });
        return;
      }

      const loadingToast = toast({
        title: "Suppression en cours",
        description: "Veuillez patienter...",
      });

      const { error } = await supabase
        .from('images')
        .delete()
        .eq('user_id', session.session.user.id);

      if (error) throw error;

      loadingToast.dismiss?.();
      
      toast({
        title: "Succès",
        description: "Historique supprimé avec succès",
      });
      
      window.location.href = window.location.pathname;
    } catch (error) {
      console.error('Error deleting history:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Échec de la suppression de l'historique",
        variant: "destructive"
      });
    }
  }, [toast]);

  return (
    <ImageGeneratorContainer
      showSettings={showSettings}
      setShowSettings={setShowSettings}
      showHelp={showHelp}
      setShowHelp={setShowHelp}
      isGenerating={isGenerating}
      referenceImage={referenceImage}
      settings={settings || defaultSettings}
      generatedImages={generatedImages}
      history={history}
      isLoading={false}
      progress={progress}
      currentLogs={currentLogs}
      handleImageUpload={handleImageUpload}
      handleImageClick={handleImageClick}
      handleGenerate={handleGenerate}
      handleTweak={handleTweak}
      handleDownload={handleDownload}
      handleDeleteImage={deleteImage}
      updateSettings={updateSettings}
      setReferenceImage={setReferenceImage}
      handleRemoveReferenceImage={handleRemoveReferenceImage}
      handleDeleteHistory={handleDeleteHistory}
    />
  );
});

ImageGenerator.displayName = 'ImageGenerator';