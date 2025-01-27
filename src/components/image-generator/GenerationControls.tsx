import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, Sparkles, XCircle } from 'lucide-react';
import type { GenerationSettings } from '@/types/replicate';

interface GenerationControlsProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
  onGenerate: () => void;
  onCancel: () => void;
  onToggleSettings: () => void;
  isGenerating: boolean;
}

export const GenerationControls = ({
  settings,
  onSettingsChange,
  onGenerate,
  onCancel,
  onToggleSettings,
  isGenerating
}: GenerationControlsProps) => {
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    const text = textarea.value;
    
    textarea.style.height = 'auto';
    const lines = Math.ceil(text.length / 10);
    const lineHeight = 24;
    textarea.style.height = `${Math.max(40, lines * lineHeight)}px`;
    
    onSettingsChange({ prompt: text });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center my-6">
        <div className="inline-flex items-center max-w-[90vw]">
          <div className="
            relative 
            inline-block
            p-1
            rounded-full
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
                block
                min-w-[200px]
                max-w-[80vw]
                h-10
                bg-card/80 
                border 
                border-primary/20 
                text-foreground 
                placeholder:text-primary/50 
                focus:border-primary/50 
                rounded-full
                px-4
                py-2
                text-center
                text-sm
                transition-all 
                duration-300
                shadow-inner
                leading-6
                overflow-hidden
                focus:outline-none
                focus:ring-2
                focus:ring-primary/20
                hover:border-primary/30
                resize-none
                whitespace-normal
                text-align-center
              "
              style={{
                transform: settings.prompt ? 'scale(1.02)' : 'scale(1)',
                textAlignLast: 'center',
                textAlign: 'center'
              }}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onGenerate();
                }
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

        {isGenerating ? (
          <Button
            onClick={onCancel}
            className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full transition-all duration-200"
            variant="destructive"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Annuler la génération
          </Button>
        ) : (
          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-full transition-all duration-200"
          >
            <Sparkles className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            Générer
          </Button>
        )}
      </div>
    </div>
  );
};