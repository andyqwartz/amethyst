import React from 'react';
import { useImageGeneratorLogic } from './image-generator/hooks/useImageGeneratorLogic';
import { ImageGeneratorContainer } from './image-generator/containers/ImageGeneratorContainer';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

export const ImageGenerator = () => {
  const { toast } = useToast();
  const {
    showSettings,
    setShowSettings,
    showHelp,
    setShowHelp,
    isGenerating,
    referenceImage,
    settings,
    generatedImages,
    history,
    allHistory,
    isLoading,
    progress,
    currentLogs,
    handleImageUpload,
    handleImageClick,
    handleGenerate,
    handleTweak,
    handleDownload,
    updateSettings,
    setReferenceImage,
    handleRemoveReferenceImage
  } = useImageGeneratorLogic();

  const handleDeleteHistory = async () => {
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

      const { error } = await supabase
        .from('images')
        .delete()
        .eq('user_id', session.session.user.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Historique supprimé avec succès",
      });

      window.location.reload();
    } catch (error) {
      console.error('Error deleting history:', error);
      toast({
        title: "Erreur",
        description: "Échec de la suppression de l'historique",
        variant: "destructive"
      });
    }
  };

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
      allHistory={allHistory}
      isLoading={isLoading}
      progress={progress}
      currentLogs={currentLogs}
      handleImageUpload={handleImageUpload}
      handleImageClick={handleImageClick}
      handleGenerate={handleGenerate}
      handleTweak={handleTweak}
      handleDownload={handleDownload}
      updateSettings={updateSettings}
      setReferenceImage={setReferenceImage}
      handleRemoveReferenceImage={handleRemoveReferenceImage}
      handleDeleteHistory={handleDeleteHistory}
    />
  );
};