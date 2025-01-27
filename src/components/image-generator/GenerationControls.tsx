import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  return (
    <div className="space-y-6 my-8">
      <div className="space-y-3">
        <Input
          placeholder="Décrivez l'image que vous souhaitez générer..."
          value={settings.prompt}
          onChange={(e) => onSettingsChange({ prompt: e.target.value })}
          className="bg-card/80 border-primary/20 text-foreground placeholder:text-primary/50 focus:border-primary/50 rounded-full px-6 py-4 text-center h-auto transition-all duration-200 shadow-lg hover:shadow-xl focus:shadow-xl"
        />
        <div className="text-sm text-primary/70 text-center">
          {settings.prompt.length} caractères
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