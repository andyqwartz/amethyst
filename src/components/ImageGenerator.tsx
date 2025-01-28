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
    showHistory,
    setShowHistory,
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
    setReferenceImage
  } = useImageGeneratorLogic();

  const handleDeleteHistory = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to delete history",
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
        title: "Success",
        description: "History deleted successfully",
      });

      // Force reload the page to refresh the history
      window.location.reload();
    } catch (error) {
      console.error('Error deleting history:', error);
      toast({
        title: "Error",
        description: "Failed to delete history",
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
      showHistory={showHistory}
      setShowHistory={setShowHistory}
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
      handleDeleteHistory={handleDeleteHistory}
    />
  );
};