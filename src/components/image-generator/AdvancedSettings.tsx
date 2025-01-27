import React from 'react';
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from 'lucide-react';
import type { GenerationSettings } from '@/types/replicate';

interface AdvancedSettingsProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
}

export const AdvancedSettings = ({ settings, onSettingsChange }: AdvancedSettingsProps) => {
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

  return (
    <div className="space-y-6 p-4 bg-white/50 rounded-xl animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Negative Prompt</Label>
            <Input
              value={settings.negativePrompt}
              onChange={(e) => onSettingsChange({ negativePrompt: e.target.value })}
              placeholder="Elements to exclude from generation..."
              className="bg-white/50 border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Guidance Scale
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="text-xs text-primary/50">(?)</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Controls how closely the output adheres to the prompt</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Slider
              value={[settings.guidanceScale]}
              onValueChange={([value]) => onSettingsChange({ guidanceScale: value })}
              max={10}
              min={0}
              step={0.1}
              className="[&_[role=slider]]:bg-primary"
            />
          </div>

          <div className="space-y-2">
            <Label>Number of Outputs</Label>
            <Select
              value={settings.numOutputs.toString()}
              onValueChange={(value) => onSettingsChange({ numOutputs: parseInt(value) })}
            >
              <SelectTrigger className="bg-white/50 border-primary/20">
                <SelectValue placeholder="Select number of outputs" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Seed (Optional)</Label>
            <Input
              type="number"
              value={settings.seed || ''}
              onChange={(e) => onSettingsChange({ seed: parseInt(e.target.value) || undefined })}
              placeholder="Random seed for reproducible results"
              className="bg-white/50 border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Output Format</Label>
            <Select
              value={settings.outputFormat}
              onValueChange={(value) => onSettingsChange({ outputFormat: value as 'webp' | 'jpg' | 'png' })}
            >
              <SelectTrigger className="bg-white/50 border-primary/20">
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
            <Label>Safety Checker</Label>
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
          <Label>LoRA Weights</Label>
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
            <Input
              value={lora}
              onChange={(e) => updateLoraField(index, e.target.value)}
              placeholder="HuggingFace path or URL"
              className="bg-white/50 border-primary/20 flex-grow"
            />
            <Input
              type="number"
              value={settings.loraScales[index]}
              onChange={(e) => updateLoraField(index, e.target.value, true)}
              className="bg-white/50 border-primary/20 w-24"
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