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
            alt="Reference image"
            className="w-full h-auto rounded-xl object-contain max-h-[300px] bg-black/10"
            onClick={onImageClick}
          />
          <Button
            variant="secondary"
            size="icon"
            onClick={onRemoveImage}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#D6BCFA] hover:bg-[#C4B5FD] text-white rounded-full shadow-lg backdrop-blur-sm"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="w-full aspect-[16/9] p-6 border-2 border-dashed border-[#D6BCFA]/30 rounded-xl hover:bg-[#D6BCFA]/5 transition-colors flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-2 text-[#D6BCFA]/70 select-none">
            <ImagePlus className="h-6 w-6" />
            <span>Add reference image</span>
          </div>
        </button>
      )}
    </div>
  );
};
