import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus, HelpCircle } from 'lucide-react';
import type { GenerationSettings } from '@/types/replicate';

const DEFAULT_LORAS = [
  'AndyVampiro/joa',
  'AndyVampiro/andy',
  'AndyVampiro/ilenana',
  'AndyVampiro/fog'
];

interface AdvancedSettingsProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
}

export const AdvancedSettings = ({ settings, onSettingsChange }: AdvancedSettingsProps) => {
  const [loraHistory, setLoraHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('lora_history');
    return saved ? JSON.parse(saved) : DEFAULT_LORAS;
  });

  useEffect(() => {
    const uniqueLoras = Array.from(new Set([...settings.hfLoras, ...loraHistory]));
    localStorage.setItem('lora_history', JSON.stringify(uniqueLoras));
    setLoraHistory(uniqueLoras);
  }, [settings.hfLoras]);

  const aspectRatios = ["1:1", "16:9", "21:9", "3:2", "2:3", "4:5", "5:4", "3:4", "4:3", "9:16", "9:21"];

  const addLoraField = () => {
    onSettingsChange({
      hfLoras: [...settings.hfLoras, ''],
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
      const newLoras = [...settings.hfLoras];
      newLoras[index] = value;
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
    <div className="space-y-6 p-6 bg-card/95 backdrop-blur-xl rounded-xl border border-primary/10 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center">
              Aspect Ratio {renderTooltip("Aspect ratio for the generated image")}
            </Label>
            <Select
              value={settings.aspectRatio}
              onValueChange={(value) => onSettingsChange({ aspectRatio: value })}
            >
              <SelectTrigger className="bg-card/80 border-primary/20">
                <SelectValue placeholder="Select aspect ratio" />
              </SelectTrigger>
              <SelectContent>
                {aspectRatios.map((ratio) => (
                  <SelectItem key={ratio} value={ratio}>{ratio}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center">
              Number of Steps {renderTooltip("Number of inference steps")}
            </Label>
            <Slider
              value={[settings.steps]}
              onValueChange={([value]) => onSettingsChange({ steps: value })}
              max={50}
              min={1}
              step={1}
              className="[&_[role=slider]]:bg-primary"
            />
            <span className="text-xs text-primary/50">{settings.steps}</span>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center">
              Guidance Scale {renderTooltip("Controls how closely the output adheres to the prompt")}
            </Label>
            <Slider
              value={[settings.guidanceScale]}
              onValueChange={([value]) => onSettingsChange({ guidanceScale: value })}
              max={10}
              min={0}
              step={0.1}
              className="[&_[role=slider]]:bg-primary"
            />
            <span className="text-xs text-primary/50">{settings.guidanceScale}</span>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center">
              Prompt Strength {renderTooltip("Prompt strength when using image to image")}
            </Label>
            <Slider
              value={[settings.promptStrength]}
              onValueChange={([value]) => onSettingsChange({ promptStrength: value })}
              max={1}
              min={0}
              step={0.1}
              className="[&_[role=slider]]:bg-primary"
            />
            <span className="text-xs text-primary/50">{settings.promptStrength}</span>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center">
              Seed {renderTooltip("Random seed for reproducible generation")}
            </Label>
            <Input
              type="number"
              value={settings.seed || ''}
              onChange={(e) => onSettingsChange({ seed: parseInt(e.target.value) || undefined })}
              placeholder="Random seed"
              className="bg-card/80 border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center">
              Output Format {renderTooltip("Format of the output images")}
            </Label>
            <Select
              value={settings.outputFormat}
              onValueChange={(value) => onSettingsChange({ outputFormat: value as 'webp' | 'jpg' | 'png' })}
            >
              <SelectTrigger className="bg-card/80 border-primary/20">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="webp">WebP</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center">
              Output Quality {renderTooltip("Quality when saving the output images (0-100)")}
            </Label>
            <Slider
              value={[settings.outputQuality]}
              onValueChange={([value]) => onSettingsChange({ outputQuality: value })}
              max={100}
              min={0}
              step={1}
              className="[&_[role=slider]]:bg-primary"
            />
            <span className="text-xs text-primary/50">{settings.outputQuality}</span>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center">
              Safety Checker {renderTooltip("Enable/disable safety checker for generated images")}
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={!settings.disableSafetyChecker}
                onCheckedChange={(checked) => onSettingsChange({ disableSafetyChecker: !checked })}
              />
              <span className="text-sm text-primary/70">
                {settings.disableSafetyChecker ? 'Disabled' : 'Enabled'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* LoRA Settings */}
      <div className="space-y-4">
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
          <div key={index} className="flex gap-4">
            <Select
              value={lora}
              onValueChange={(value) => updateLoraField(index, value)}
            >
              <SelectTrigger className="bg-popover border-primary/20 flex-grow">
                <SelectValue placeholder="Select or enter LoRA path" />
              </SelectTrigger>
              <SelectContent className="bg-popover/100 border-primary/20">
                <Input
                  value={lora}
                  onChange={(e) => updateLoraField(index, e.target.value)}
                  placeholder="Custom HuggingFace path or URL"
                  className="mb-2 bg-card/80 border-primary/20"
                />
                {loraHistory.map((historyLora) => (
                  <SelectItem key={historyLora} value={historyLora}>
                    {historyLora}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={settings.loraScales[index]}
              onChange={(e) => updateLoraField(index, e.target.value, true)}
              className="bg-popover border-primary/20 w-24"
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
    </div>
  );
};