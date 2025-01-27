import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from 'lucide-react';

interface ImagePreviewProps {
  images: string[];
  onDownload: (imageUrl: string) => void;
}

export const ImagePreview = ({ images, onDownload }: ImagePreviewProps) => {
  if (!images.length) {
    return (
      <div className="col-span-full aspect-square rounded-lg border-2 border-dashed border-primary/30 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 mx-auto text-primary/30">🖼️</div>
          <p className="text-sm text-primary/50">Generated images will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {images.map((imageUrl, index) => (
        <div key={index} className="relative group">
          <img
            src={imageUrl}
            alt={`Generated image ${index + 1}`}
            className="w-full h-auto rounded-lg"
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onDownload(imageUrl)}
              className="bg-white/90 hover:bg-white"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/90 hover:bg-white"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};