import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from 'lucide-react';

interface ReferenceImageUploadProps {
  referenceImage: string | null;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageClick: () => void;
  onRemoveImage: () => void;
}

export const ReferenceImageUpload: React.FC<ReferenceImageUploadProps> = ({
  referenceImage,
  onImageUpload,
  onImageClick,
  onRemoveImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onImageUpload}
        accept="image/*"
        className="hidden"
      />
      {referenceImage ? (
        <div className="relative group">
          <img
            src={referenceImage}
            alt="Image de référence"
            className="w-full h-auto rounded-xl object-contain"
          />
          <Button
            variant="secondary"
            size="icon"
            onClick={onRemoveImage}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary-hover rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="w-full p-6 border-2 border-dashed border-primary/30 rounded-xl hover:bg-primary/5 transition-colors"
        >
          <div className="flex flex-col items-center gap-2 text-primary/70">
            <ImagePlus className="h-6 w-6" />
            <span>Ajouter une image de référence</span>
          </div>
        </button>
      )}
    </div>
  );
};