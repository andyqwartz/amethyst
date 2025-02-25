import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Settings } from 'lucide-react';
import type { GenerationSettings } from '@/types/replicate';

interface ImagePreviewProps {
  images: string[];
  onDownload: (imageUrl: string) => void;
  onTweak?: (settings: GenerationSettings) => void;
  settings?: GenerationSettings;
  className?: string;
}

export const ImagePreview = ({ 
  images, 
  onDownload, 
  onTweak,
  settings,
  className = "" 
}: ImagePreviewProps) => {
  if (!images.length) {
    return null;
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {images.map((imageUrl, index) => (
        <div key={index} className="relative group">
          <img
            src={imageUrl}
            alt={`Generated image ${index + 1}`}
            className="w-full h-auto rounded-lg shadow-lg transition-all duration-300 hover:scale-[1.02]"
            loading="lazy"
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onDownload(imageUrl)}
              className="rounded-full bg-primary hover:bg-primary-hover shadow-lg transition-all duration-300 w-10 h-10"
            >
              <Download className="h-4 w-4 text-white" />
            </Button>
            {settings && onTweak && (
              <Button
                variant="secondary"
                size="icon"
                onClick={() => onTweak(settings)}
                className="rounded-full bg-primary hover:bg-primary-hover shadow-lg transition-all duration-300 w-10 h-10"
              >
                <Settings className="h-4 w-4 text-white" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};