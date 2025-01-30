import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { ReferenceImageUpload } from './ReferenceImageUpload';
import { GenerationControls } from './GenerationControls';
import { AdvancedSettings } from './AdvancedSettings';
import { ImagePreview } from './ImagePreview';
import type { GenerationSettings } from '@/types/replicate';

interface MainContentProps {
  referenceImage: string | null;
  showSettings: boolean;
  settings: GenerationSettings;
  isGenerating: boolean;
  generatedImages: string[];
  history: { url: string; settings: GenerationSettings }[];
  isLoading: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageClick: () => void;
  onRemoveImage: () => void;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
  onGenerate: () => void;
  onToggleSettings: () => void;
  onTweak: (settings: GenerationSettings) => void;
  onDownload: (imageUrl: string) => void;
  onDeleteHistory: () => void;
}

export const MainContent = ({
  referenceImage,
  showSettings,
  settings,
  isGenerating,
  generatedImages,
  history,
  isLoading,
  onImageUpload,
  onImageClick,
  onRemoveImage,
  onSettingsChange,
  onGenerate,
  onToggleSettings,
  onTweak,
  onDownload,
  onDeleteHistory
}: MainContentProps) => {
  // Remove duplicates from history
  const uniqueHistory = history.filter((item, index, self) =>
    index === self.findIndex((t) => t.url === item.url)
  );

  return (
    <Card className="border-none glass-card shadow-xl relative">
      <div className="p-6 space-y-8">
        <ReferenceImageUpload
          referenceImage={referenceImage}
          onImageUpload={onImageUpload}
          onImageClick={onImageClick}
          onRemoveImage={onRemoveImage}
        />

        <GenerationControls
          settings={settings}
          onSettingsChange={onSettingsChange}
          onGenerate={onGenerate}
          onToggleSettings={onToggleSettings}
          isGenerating={isGenerating}
        />

        {showSettings && (
          <AdvancedSettings
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        )}

        {generatedImages.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-white">Images générées</h3>
            <ImagePreview
              images={generatedImages}
              onTweak={onTweak}
              onDownload={onDownload}
              settings={settings}
            />
          </div>
        )}

        {!isLoading && uniqueHistory.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-white">Historique des générations</h3>
            <ImagePreview
              images={uniqueHistory.map(h => h.url)}
              onTweak={(settings) => onTweak(settings)}
              onDownload={onDownload}
              settings={settings}
            />
          </div>
        )}

        <div className="group h-24 flex items-center justify-center mt-8">
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full bg-[#D6BCFA] hover:bg-[#C4B5FD] border-none text-white 
                     transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm
                     opacity-0 group-hover:opacity-100"
            onClick={onDeleteHistory}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};