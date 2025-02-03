import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useImageGeneratorStore } from '@/state/imageGeneratorStore';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HelpCircle } from 'lucide-react';
import { LoraSettings } from './LoraSettings';

interface AdvancedSettingsProps {
  disabled?: boolean;
}

const renderTooltip = (description: string) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger className="ml-2">
        <HelpCircle className="h-4 w-4 text-primary/50" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs text-sm">{description}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  disabled = false
}) => {
  const { settings, updateSettings } = useImageGeneratorStore();

  useEffect(() => {
    console.log('AdvancedSettings monté');
    return () => {
      console.log('AdvancedSettings démonté');
    };
  }, []);

  return (
    <Card className="p-6 space-y-6 bg-card/95 backdrop-blur-sm border border-primary/10 shadow-lg animate-in slide-in-from-top duration-300">
      {/* Format */}
      <div className="space-y-4">
        <Label className="flex items-center">
          Format {renderTooltip("Format de sortie des images générées")}
        </Label>
        <Select
          value={settings.output_format}
          onValueChange={(value: 'webp' | 'jpg' | 'png') => updateSettings({ output_format: value })}
          disabled={disabled}
        >
          <SelectTrigger className="bg-background/50 border-primary/20">
            <SelectValue placeholder="Sélectionner un format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="webp">WebP</SelectItem>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="jpg">JPEG</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-primary/10" />

      {/* Nombre d'images */}
      <div className="space-y-4">
        <Label className="flex items-center">
          Nombre d'images {renderTooltip("Nombre d'images à générer en une fois")}
        </Label>
        <Input
          type="number"
          min={1}
          max={4}
          value={settings.num_outputs}
          onChange={(e) => updateSettings({ num_outputs: parseInt(e.target.value) })}
          disabled={disabled}
          className="bg-background/50 border-primary/20"
        />
      </div>

      <Separator className="bg-primary/10" />

      {/* Force du prompt */}
      <div className="space-y-4">
        <Label className="flex items-center">
          Force du prompt {renderTooltip("Contrôle l'influence du prompt sur l'image finale")}
        </Label>
        <Slider
          value={[settings.prompt_strength]}
          min={0}
          max={1}
          step={0.1}
          onValueChange={([value]) => updateSettings({ prompt_strength: value })}
          disabled={disabled}
          className="[&_[role=slider]]:bg-primary"
        />
        <div className="text-sm text-primary/70">
          {settings.prompt_strength.toFixed(1)}
        </div>
      </div>

      <Separator className="bg-primary/10" />

      {/* Étapes d'inférence */}
      <div className="space-y-4">
        <Label className="flex items-center">
          Étapes {renderTooltip("Nombre d'étapes d'inférence (plus = plus de détails mais plus lent)")}
        </Label>
        <Slider
          value={[settings.num_inference_steps]}
          min={10}
          max={50}
          step={1}
          onValueChange={([value]) => updateSettings({ num_inference_steps: value })}
          disabled={disabled}
          className="[&_[role=slider]]:bg-primary"
        />
        <div className="text-sm text-primary/70">
          {settings.num_inference_steps}
        </div>
      </div>

      <Separator className="bg-primary/10" />

      {/* Guidance Scale */}
      <div className="space-y-4">
        <Label className="flex items-center">
          Guidance Scale {renderTooltip("Contrôle l'adhérence au prompt (plus = plus fidèle mais moins créatif)")}
        </Label>
        <Slider
          value={[settings.guidanceScale]}
          min={1}
          max={20}
          step={0.1}
          onValueChange={([value]) => updateSettings({ guidanceScale: value })}
          disabled={disabled}
          className="[&_[role=slider]]:bg-primary"
        />
        <div className="text-sm text-primary/70">
          {settings.guidanceScale.toFixed(1)}
        </div>
      </div>

      <Separator className="bg-primary/10" />

      {/* Seed */}
      <div className="space-y-4">
        <Label className="flex items-center">
          Seed {renderTooltip("Graine aléatoire pour une génération reproductible")}
        </Label>
        <Input
          type="number"
          value={settings.seed || ''}
          onChange={(e) => updateSettings({ seed: parseInt(e.target.value) || -1 })}
          placeholder="Aléatoire"
          disabled={disabled}
          className="bg-background/50 border-primary/20"
        />
      </div>

      <Separator className="bg-primary/10" />

      {/* Safety Checker */}
      <div className="space-y-4">
        <Label className="flex items-center">
          Filtre de sécurité {renderTooltip("Active/désactive le filtre de contenu inapproprié")}
        </Label>
        <div className="flex items-center space-x-2">
          <Switch
            checked={!settings.disable_safety_checker}
            onCheckedChange={(checked) => updateSettings({ disable_safety_checker: !checked })}
            disabled={disabled}
          />
          <span className="text-sm text-primary/70">
            {settings.disable_safety_checker ? 'Désactivé' : 'Activé'}
          </span>
        </div>
      </div>

      <Separator className="bg-primary/10" />

      {/* LoRA Settings */}
      <LoraSettings disabled={disabled} />
    </Card>
  );
};
