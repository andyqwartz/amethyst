import React from 'react';
import { ImagePreview } from './ImagePreview';
import type { GenerationSettings } from '@/types/replicate';

interface HistorySectionProps {
  history: string[];
  onTweak: (settings: GenerationSettings) => void;
  onDownload: (imageUrl: string) => void;
  settings: GenerationSettings;
  isLoading: boolean;
}

export const HistorySection = ({
  history,
  onTweak,
  onDownload,
  settings,
  isLoading
}: HistorySectionProps) => {
  if (isLoading || history.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Dernières générations</h3>
      <ImagePreview
        images={history}
        onTweak={onTweak}
        onDownload={onDownload}
        settings={settings}
      />
    </div>
  );
};