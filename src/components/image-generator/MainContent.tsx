import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Wand2, Trash2 } from 'lucide-react';
import { ReferenceImageUpload } from './ReferenceImageUpload';
import { GenerationControls } from './GenerationControls';
import { AdvancedSettings } from './AdvancedSettings';
import { ImagePreview } from './ImagePreview';
import type { GenerationSettings } from '@/types/replicate';
import { cn } from '@/lib/utils';

interface ImageItem {
  url: string;
  settings: GenerationSettings;
  isNew?: boolean;
}

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
  onDownload: (imageUrl: string, outputFormat: string) => Promise<void>;
  onDeleteHistory: () => void;
  onDeleteImage: (imageUrl: string) => void;
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
  onDeleteHistory,
  onDeleteImage
}: MainContentProps) => {
  const allImages = React.useMemo(() => {
    const uniqueHistory = (history || []).filter((item, index, self) =>
      index === self.findIndex((t) => t.url === item.url)
    );
    
    const newImages = (generatedImages || []).map(url => ({
      url,
      settings,
      isNew: true
    }));
    
    return [...newImages, ...uniqueHistory] as ImageItem[];
  }, [history, generatedImages, settings]);

  const handleGenerate = () => {
    if (showSettings) {
      onToggleSettings();
    }
    onGenerate();
  };

  return (
    <Card className="border-none glass-card shadow-xl relative">
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-[300px,1fr,auto] gap-6 items-start">
          <ReferenceImageUpload
            referenceImage={referenceImage}
            onImageUpload={onImageUpload}
            onImageClick={onImageClick}
            onRemoveImage={onRemoveImage}
          />
          
          <GenerationControls
            settings={settings}
            onSettingsChange={onSettingsChange}
            onGenerate={handleGenerate}
            onToggleSettings={onToggleSettings}
            isGenerating={isGenerating}
          />
        </div>

        {showSettings && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <AdvancedSettings
              settings={settings}
              onSettingsChange={onSettingsChange}
            />
          </div>
        )}

        {allImages.length > 0 && (
          <div className="mt-8">
            <ImagePreview
              images={allImages.map(img => img.url)}
              onDownload={async (url) => await onDownload(url, settings.output_format || 'webp')}
              onTweak={(settings) => onTweak(settings)}
              onDelete={onDeleteImage}
              settings={settings}
              className="gap-4"
            />
          </div>
        )}

        {allImages.length > 0 && (
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
        )}
      </div>
    </Card>
  );
};