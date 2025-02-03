import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HelpCircle } from 'lucide-react';
import { useImageGeneratorStore } from '@/state/imageGeneratorStore';

const DEFAULT_LORAS = [
  { 
    id: "AndyVampiro/joa", 
    name: "JOA Style", 
    description: "Style artistique unique avec des couleurs vibrantes" 
  },
  { 
    id: "AndyVampiro/andy", 
    name: "Andy Style", 
    description: "Style graphique moderne et épuré" 
  },
  { 
    id: "AndyVampiro/ilenana", 
    name: "Ilenana Style", 
    description: "Style fantaisiste et onirique" 
  },
  { 
    id: "AndyVampiro/fog", 
    name: "Fog Effect", 
    description: "Ajoute des effets atmosphériques et brumeux" 
  }
];

interface LoraSettingsProps {
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

export const LoraSettings: React.FC<LoraSettingsProps> = ({
  disabled = false
}) => {
  const { settings, updateSettings } = useImageGeneratorStore();

  const addLora = () => {
    const newHfLoras = [...(settings.hf_loras || []), DEFAULT_LORAS[0].id];
    const newLoraScales = [...(settings.lora_scales || []), 0.8];
    updateSettings({ 
      hf_loras: newHfLoras,
      lora_scales: newLoraScales
    });
  };

  const removeLora = (index: number) => {
    const newHfLoras = settings.hf_loras?.filter((_, i) => i !== index) || [];
    const newLoraScales = settings.lora_scales?.filter((_, i) => i !== index) || [];
    updateSettings({ 
      hf_loras: newHfLoras,
      lora_scales: newLoraScales
    });
  };

  const updateLoraId = (index: number, value: string) => {
    const newHfLoras = [...(settings.hf_loras || [])];
    newHfLoras[index] = value;
    updateSettings({ hf_loras: newHfLoras });
  };

  const updateLoraScale = (index: number, value: number) => {
    const newLoraScales = [...(settings.lora_scales || [])];
    newLoraScales[index] = value;
    updateSettings({ lora_scales: newLoraScales });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center">
          LoRAs {renderTooltip("Modèles LoRA pour personnaliser la génération")}
        </Label>
        <Button
          variant="outline"
          size="sm"
          onClick={addLora}
          disabled={disabled || (settings.hf_loras?.length || 0) >= 3}
          className="border-primary/20"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {settings.hf_loras?.map((loraId, index) => (
        <div key={index} className="space-y-3 pt-2">
          <div className="flex items-center justify-between gap-2">
            <Select
              value={loraId}
              onValueChange={(value) => updateLoraId(index, value)}
              disabled={disabled}
            >
              <SelectTrigger className="bg-popover border-primary/20">
                <SelectValue placeholder="Sélectionner un LoRA" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-primary/20">
                {DEFAULT_LORAS.map((lora) => (
                  <SelectItem 
                    key={lora.id} 
                    value={lora.id}
                    className="flex flex-col items-start py-3"
                  >
                    <span className="font-medium">{lora.name}</span>
                    <span className="text-xs text-primary/70 mt-1">{lora.description}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeLora(index)}
              disabled={disabled || index === 0}
              className="text-destructive hover:text-destructive/80"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-primary/70">Force du LoRA</Label>
            <Slider
              value={[settings.lora_scales?.[index] || 0.8]}
              onValueChange={([value]) => updateLoraScale(index, value)}
              min={0}
              max={1}
              step={0.1}
              disabled={disabled}
              className="[&_[role=slider]]:bg-primary"
            />
            <span className="text-xs text-primary/50 block">
              {(settings.lora_scales?.[index] || 0.8).toFixed(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};