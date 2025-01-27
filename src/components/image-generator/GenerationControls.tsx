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
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Décrivez l'image que vous souhaitez générer..."
          value={settings.prompt}
          onChange={(e) => onSettingsChange({ prompt: e.target.value })}
          className="bg-white/50 border-primary/20 text-foreground placeholder:text-primary/50 focus:border-primary/50"
        />
        <div className="text-sm text-primary/70">
          {settings.prompt.length} caractères
        </div>
      </div>

      <div className="space-y-2">
        <Button
          onClick={onToggleSettings}
          className="w-full bg-white/50 hover:bg-white/70 text-foreground border border-primary/20"
          variant="secondary"
        >
          <Settings className="h-4 w-4 mr-2" />
          Paramètres avancés
        </Button>

        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Sparkles className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
          Générer
        </Button>
      </div>
    </div>
  );
};