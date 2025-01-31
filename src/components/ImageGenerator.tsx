import React, { useCallback } from 'react';
import { useImageGeneratorLogic } from './image-generator/hooks/useImageGeneratorLogic';
import { ImageGeneratorContainer } from './image-generator/containers/ImageGeneratorContainer';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

export const ImageGenerator = React.memo(() => {
  const { toast } = useToast();
  const {
    showSettings,
    setShowSettings,
    showHelp,
    setShowHelp,
    isGenerating,
    referenceImage,
    settings,
    generatedImages: rawGeneratedImages,
    history: rawHistory,
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
  } = useImageGeneratorLogic();

  const generatedImages = rawGeneratedImages ?? [];
  const history = rawHistory ?? [];

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

      // Start loading state
      const loadingToast = toast({
        title: "Suppression en cours",
        description: "Veuillez patienter...",
      });

      const { error } = await supabase
        .from('images')
        .delete()
        .eq('user_id', session.session.user.id);

      if (error) throw error;

      // Clear loading toast
      loadingToast.dismiss();
      
      toast({
        title: "Succès",
        description: "Historique supprimé avec succès",
      });
      
      // Use a more controlled way to refresh the data
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
      settings={settings}
      generatedImages={generatedImages}
      history={history}
      isLoading={isLoading}
      progress={progress}
      currentLogs={currentLogs}
      handleImageUpload={handleImageUpload}
      handleImageClick={handleImageClick}
      handleGenerate={handleGenerate}
      handleTweak={handleTweak}
      handleDownload={handleDownload}
      handleDeleteImage={handleDeleteImage}
      updateSettings={updateSettings}
      setReferenceImage={setReferenceImage}
      handleRemoveReferenceImage={handleRemoveReferenceImage}
      handleDeleteHistory={handleDeleteHistory}
    />
  );
});
