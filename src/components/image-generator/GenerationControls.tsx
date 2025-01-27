import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, Sparkles, MessageCircle } from 'lucide-react';
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
  const inputWidth = settings.prompt ? Math.min(Math.max(settings.prompt.length * 0.8, 40), 90) : 40;

  return (
    <div className="space-y-6 my-8">
      <div className="flex justify-center items-center min-h-[100px]">
        <div 
          className={`
            relative transition-all duration-300 ease-in-out
            ${settings.prompt ? '' : 'flex justify-center items-center'}
          `}
          style={{ width: `${inputWidth}%` }}
        >
          {!settings.prompt && (
            <MessageCircle className="absolute left-1/2 -translate-x-1/2 h-5 w-5 text-primary/50 pointer-events-none" />
          )}
          <textarea
            placeholder="Décrivez l'image que vous souhaitez générer..."
            value={settings.prompt}
            onChange={(e) => onSettingsChange({ prompt: e.target.value })}
            rows={Math.max(1, Math.ceil(settings.prompt.length / 50))}
            className={`
              w-full min-h-[48px]
              bg-card/80 border border-primary/20 text-foreground 
              placeholder:text-primary/50 focus:border-primary/50 
              rounded-full px-6 py-3 text-center
              transition-all duration-300 ease-in-out
              shadow-lg hover:shadow-xl focus:shadow-xl
              resize-none overflow-hidden
              ${settings.prompt ? '' : 'w-[300px] mx-auto block pl-12'}
            `}
            style={{
              lineHeight: '1.5',
              borderRadius: settings.prompt.length > 50 ? '1.5rem' : '9999px'
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