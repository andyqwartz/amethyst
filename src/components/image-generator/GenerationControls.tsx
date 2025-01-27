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
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    onSettingsChange({ prompt: textarea.value });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center min-h-[60px] my-6">
        <div className="relative w-full max-w-3xl">
          <div className="
            relative 
            p-2 
            rounded-3xl 
            bg-gradient-to-br 
            from-primary/5 
            to-primary/10 
            animate-float
            shadow-lg
            backdrop-blur-sm
          ">
            <textarea
              placeholder="Imagine..."
              value={settings.prompt}
              onChange={handleTextareaInput}
              className="
                w-full
                min-h-[48px]
                bg-card/80 
                border 
                border-primary/20 
                text-foreground 
                placeholder:text-primary/50 
                focus:border-primary/50 
                rounded-2xl
                px-8
                py-4
                text-center
                transition-all 
                duration-300
                shadow-inner
                leading-relaxed
                break-words
                overflow-hidden
                focus:outline-none
                focus:ring-2
                focus:ring-primary/20
                hover:border-primary/30
                resize-none
              "
              style={{
                transform: settings.prompt ? 'scale(1.02)' : 'scale(1)',
              }}
            />
          </div>
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