import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HelpCircle, Plus, Minus } from 'lucide-react';
import type { GenerationSettings } from '@/types/replicate';

const DEFAULT_LORAS = [
  'AndyVampiro/joa',
  'AndyVampiro/andy',
  'AndyVampiro/ilenana',
  'AndyVampiro/fog'
];

interface LoraSettingsProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
}

export const LoraSettings = ({ settings, onSettingsChange }: LoraSettingsProps) => {
  const [loraHistory, setLoraHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('lora_history');
    return saved ? JSON.parse(saved).filter((item: string) => item && item.trim()) : DEFAULT_LORAS;
  });

  useEffect(() => {
    const uniqueLoras = Array.from(new Set([
      ...settings.hfLoras.filter(lora => lora && lora.trim()),
      ...loraHistory.filter(lora => lora && lora.trim())
    ]));
    localStorage.setItem('lora_history', JSON.stringify(uniqueLoras));
    setLoraHistory(uniqueLoras);
  }, [settings.hfLoras]);

  const addLoraField = () => {
    onSettingsChange({
      hfLoras: [...settings.hfLoras, DEFAULT_LORAS[0]],
      loraScales: [...settings.loraScales, 0.8],
    });
  };

  const removeLoraField = (index: number) => {
    onSettingsChange({
      hfLoras: settings.hfLoras.filter((_, i) => i !== index),
      loraScales: settings.loraScales.filter((_, i) => i !== index),
    });
  };

  const updateLoraField = (index: number, value: string, isScale: boolean = false) => {
    if (isScale) {
      const newScales = [...settings.loraScales];
      newScales[index] = parseFloat(value);
      onSettingsChange({ loraScales: newScales });
    } else {
      if (!value || !value.trim()) return;
      
      const newLoras = [...settings.hfLoras];
      newLoras[index] = value.trim();
      onSettingsChange({ hfLoras: newLoras });
    }
  };

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

  return (
    <div className="space-y-4 p-4 md:p-6 bg-card/95 backdrop-blur-xl rounded-xl border border-primary/10 shadow-xl w-full overflow-x-hidden">
      <div className="flex items-center justify-between">
        <Label className="flex items-center">
          LoRA Weights {renderTooltip("Huggingface path or URL to the LoRA weights")}
        </Label>
        <Button
          onClick={addLoraField}
          variant="ghost"
          size="sm"
          className="text-primary hover:bg-primary/10"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add LoRA
        </Button>
      </div>

      {settings.hfLoras.map((lora, index) => (
        <div key={index} className="flex gap-2 md:gap-4">
          <Select
            value={lora || DEFAULT_LORAS[0]}
            onValueChange={(value) => updateLoraField(index, value)}
          >
            <SelectTrigger className="bg-card border-primary/20 flex-grow">
              <SelectValue placeholder="Select or enter LoRA path" />
            </SelectTrigger>
            <SelectContent className="bg-card border-primary/20">
              {loraHistory.filter(item => item && item.trim()).map((historyLora) => (
                <SelectItem key={historyLora} value={historyLora}>
                  {historyLora}
                </SelectItem>
              ))}
              <div className="px-2 py-2">
                <Input
                  value={lora}
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    if (value) {
                      updateLoraField(index, value);
                    }
                  }}
                  placeholder="Custom HuggingFace path or URL"
                  className="bg-card border-primary/20"
                />
              </div>
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={settings.loraScales[index]}
            onChange={(e) => updateLoraField(index, e.target.value, true)}
            className="bg-card border-primary/20 w-20 md:w-24"
            step={0.1}
            min={0}
            max={1}
          />
          <Button
            onClick={() => removeLoraField(index)}
            variant="ghost"
            size="icon"
            className="text-primary hover:bg-primary/10"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};