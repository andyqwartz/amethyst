import React from 'react';
import { ImagePreview } from '../ImagePreview';
import type { GenerationSettings } from '@/types/replicate';

interface ImageSectionProps {
  title: string;
  images: string[];
  onTweak: (settings: GenerationSettings) => void;
  onDownload: (imageUrl: string) => void;
  settings: GenerationSettings;
}

export const ImageSection = ({
  title,
  images,
  onTweak,
  onDownload,
  settings
}: ImageSectionProps) => {
  if (!images.length) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
      <ImagePreview
        images={images}
        onTweak={onTweak}
        onDownload={onDownload}
        settings={settings}
      />
    </div>
  );
};