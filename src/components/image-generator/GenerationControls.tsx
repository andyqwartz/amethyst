import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, Sparkles } from 'lucide-react';
import type { GenerationSettings } from '@/types/replicate';

interface GenerationControlsProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
  onGenerate: () => void;
  onToggleSettings: () => void;
  isGenerating: boolean;
}

export const GenerationControls = ({
  settings,
  onSettingsChange,
  onGenerate,
  onToggleSettings,
  isGenerating
}: GenerationControlsProps) => {
  const inputWidth = settings.prompt ? Math.min(Math.max(settings.prompt.length * 0.6, 60), 90) : 60;

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center min-h-[60px] my-6">
        <div 
          className="relative transition-all duration-500 ease-in-out flex justify-center items-center"
          style={{ width: `${inputWidth}%` }}
        >
          <textarea
            placeholder="Imagine..."
            value={settings.prompt}
            onChange={(e) => onSettingsChange({ prompt: e.target.value })}
            rows={settings.prompt ? Math.max(Math.ceil(settings.prompt.length / 100), 1) : 1}
            className="
              w-full
              min-h-[48px]
              max-h-[200px]
              bg-card/80 
              border 
              border-primary/20 
              text-foreground 
              placeholder:text-primary/50 
              focus:border-primary/50 
              rounded-full 
              px-8
              py-3
              text-center
              transition-all 
              duration-500
              ease-in-out
              shadow-lg 
              hover:shadow-xl 
              focus:shadow-xl
              resize-none
              overflow-hidden
              leading-relaxed
              whitespace-pre-wrap
              animate-fade-in
            "
            style={{
              transform: settings.prompt ? 'scale(1.02)' : 'scale(1)',
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4">
        <Button
          onClick={onToggleSettings}
          className="w-full bg-card hover:bg-card/80 text-foreground border border-primary/20 rounded-full transition-all duration-200"
          variant="secondary"
        >
          <Settings className="h-4 w-4 mr-2" />
          Paramètres avancés
        </Button>

        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-full transition-all duration-200"
        >
          <Sparkles className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
          Générer
        </Button>
      </div>
    </div>
  );
};