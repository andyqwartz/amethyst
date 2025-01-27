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
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in ${className}`}>
      {images.map((imageUrl, index) => (
        <div key={index} className="relative group hover-scale">
          <img
            src={imageUrl}
            alt={`Image générée ${index + 1}`}
            className="w-full h-auto rounded-lg shadow-lg"
            loading="lazy"
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onDownload(imageUrl)}
              className="bg-white/90 hover:bg-white shadow-lg"
            >
              <Download className="h-4 w-4" />
            </Button>
            {settings && onTweak && (
              <Button
                variant="secondary"
                size="icon"
                onClick={() => onTweak(settings)}
                className="bg-white/90 hover:bg-white shadow-lg"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};