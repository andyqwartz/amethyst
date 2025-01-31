import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Wand2, Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { DeleteImageModal } from './modals/DeleteImageModal';
import type { GenerationSettings } from '@/types/replicate';

interface ImagePreviewProps {
  images: string[];
  onDownload?: (url: string) => void;
  onTweak?: (settings: GenerationSettings) => void;
  onDelete?: (url: string) => Promise<void>;
  settings?: GenerationSettings;
  className?: string;
}

export const ImagePreview = ({ 
  images, 
  onDownload, 
  onTweak,
  onDelete,
  settings,
  className = "" 
}: ImagePreviewProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async (url: string) => {
    setSelectedImage(url);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedImage && onDelete) {
      await onDelete(selectedImage);
      setShowDeleteModal(false);
      setSelectedImage(null);
    }
  };

  return (
    <>
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3", className)}>
        {images.map((url, index) => (
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
                  {onDownload && (
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => onDownload(url)}
                      className="rounded-full bg-black/50 hover:bg-black/70 shadow-sm transition-colors duration-200 w-8 h-8"
                    >
                      <Download className="h-4 w-4 text-white" />
                    </Button>
                  )}
                  {onTweak && settings && (
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => onTweak(settings)}
                      className="rounded-full bg-black/50 hover:bg-black/70 shadow-sm transition-colors duration-200 w-8 h-8"
                    >
                      <Wand2 className="h-4 w-4 text-white" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handleDelete(url)}
                      className="rounded-full bg-black/50 hover:bg-black/70 shadow-sm transition-colors duration-200 w-8 h-8"
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <DeleteImageModal
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
          onConfirm={handleConfirmDelete}
          imageUrl={selectedImage}
        />
      )}
    </>
  );
};
