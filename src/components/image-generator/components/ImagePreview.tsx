import React from 'react';
import { useImageGeneratorStore } from '../../../state/imageGeneratorStore';
import { Button } from '@/components/ui/button';
import { Download, Trash2, Wand2 } from 'lucide-react';
import useModalStore, { ModalId } from '@/state/modalStore';

export const ImagePreview: React.FC = () => {
  const currentImage = useImageGeneratorStore((state) => state.currentImage);
  const setCurrentImage = useImageGeneratorStore((state) => state.setCurrentImage);
  const updateSettings = useImageGeneratorStore((state) => state.updateSettings);
  const isGenerating = useImageGeneratorStore((state) => state.ui.isGenerating);
  const setError = useImageGeneratorStore((state) => state.setError);

  const handleDownload = async () => {
    if (!currentImage?.url) return;

    try {
      const response = await fetch(currentImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${currentImage.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError('Failed to download image');
    }
  };

  const handleTweak = () => {
    if (!currentImage) return;
    
    updateSettings({
      prompt: currentImage.settings.prompt,
      negativePrompt: currentImage.settings.negativePrompt,
      width: currentImage.settings.width,
      height: currentImage.settings.height,
      steps: currentImage.settings.steps,
      seed: currentImage.settings.seed,
      guidanceScale: currentImage.settings.guidanceScale,
      img2img: true,
      strength: 0.75,
      initImage: currentImage.url
    });
  };

  const { openModal } = useModalStore();

  const handleDelete = () => {
    if (!currentImage) return;
    
    openModal(ModalId.DELETE_IMAGE, {
      type: ModalId.DELETE_IMAGE,
      data: {
        imageId: currentImage.id,
        imageName: currentImage.settings.prompt,
      }
    });
  };

  if (!currentImage) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[512px] bg-secondary rounded-lg">
        <p className="text-muted-foreground">No image generated</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      <img
        src={currentImage.url}
        alt={currentImage.settings.prompt}
        className="w-full h-auto rounded-lg"
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleDownload}
            disabled={isGenerating}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleTweak}
            disabled={isGenerating}
          >
            <Wand2 className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleDelete}
            disabled={isGenerating}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
