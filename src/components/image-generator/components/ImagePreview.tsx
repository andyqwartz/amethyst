import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Wand2, Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { DeleteImageModal } from './modals/DeleteImageModal';
import type { ImageSettings } from '@/types/generation';

interface ImagePreviewProps {
  generatedImages: string[];
  history: Array<{ url: string; settings: ImageSettings }>;
  isLoading: boolean;
  onDownload: (imageUrl: string, outputFormat: string) => Promise<void>;
  onTweak: (settings: Partial<ImageSettings>) => void;
  onDeleteImage: (imageUrl: string) => void;
  onDeleteHistory: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  generatedImages,
  history,
  isLoading,
  onDownload,
  onTweak,
  onDeleteImage,
  onDeleteHistory
}) => {
  const handleTweak = (settings: ImageSettings) => {
    onTweak({
      prompt: settings.prompt,
      negative_prompt: settings.negative_prompt,
      width: settings.width,
      height: settings.height,
      steps: settings.steps,
      guidance_scale: settings.guidance_scale,
      img2img: true,
      strength: 0.75,
      initImage: settings.initImage
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Generated Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {generatedImages.map((url, index) => (
            <div 
              key={url + index}
              className="relative group rounded-lg overflow-hidden bg-black/10 hover:bg-black/5 transition-colors duration-300"
            >
              <div className="relative w-full">
                <img
                  src={url}
                  alt={`Generated image ${index + 1}`}
                  className="w-full h-auto object-cover rounded-lg"
                  loading="lazy"
                  style={{ aspectRatio: '1', objectFit: 'contain', backgroundColor: 'rgb(15, 15, 15)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => onDownload(url, 'webp')}
                      className="rounded-full bg-black/50 hover:bg-black/70 shadow-sm transition-colors duration-200 w-8 h-8"
                    >
                      <Download className="h-4 w-4 text-white" />
                    </Button>
                    {history.find(item => item.url === url)?.settings && (
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => handleTweak(history.find(item => item.url === url)!.settings)}
                        className="rounded-full bg-black/50 hover:bg-black/70 shadow-sm transition-colors duration-200 w-8 h-8"
                      >
                        <Wand2 className="h-4 w-4 text-white" />
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => onDeleteImage(url)}
                      className="rounded-full bg-black/50 hover:bg-black/70 shadow-sm transition-colors duration-200 w-8 h-8"
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* History Actions */}
        {history.length > 0 && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={onDeleteHistory}
              className="text-destructive hover:text-destructive"
            >
              Clear History
            </Button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteImageModal
        open={false}
        onOpenChange={() => {}}
        onConfirm={() => {}}
        imageUrl={''}
      />
    </>
  );
};
