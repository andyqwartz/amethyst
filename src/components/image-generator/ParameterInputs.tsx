import React from 'react';
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import type { GenerationSettings } from '@/types/replicate';

interface ParameterInputsProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
}

export const ParameterInputs = ({ settings, onSettingsChange }: ParameterInputsProps) => {
  const aspectRatios = [
    "1:1", "16:9", "21:9", "3:2", "2:3", "4:5", "5:4", "3:4", "4:3", "9:16", "9:21"
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Guidance Scale
            <Tooltip content="Controls how closely the output adheres to the prompt">
              <span className="text-xs text-muted-foreground">(?)</span>
            </Tooltip>
          </Label>
          <Slider
            value={[settings.guidanceScale]}
            onValueChange={([value]) => onSettingsChange({ guidanceScale: value })}
            max={10}
            min={0}
            step={0.1}
            className="[&_[role=slider]]:bg-primary"
          />
          <span className="text-xs text-muted-foreground">{settings.guidanceScale}</span>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Steps
            <Tooltip content="Number of inference steps">
              <span className="text-xs text-muted-foreground">(?)</span>
            </Tooltip>
          </Label>
          <Slider
            value={[settings.steps]}
            onValueChange={([value]) => onSettingsChange({ steps: value })}
            max={50}
            min={1}
            step={1}
            className="[&_[role=slider]]:bg-primary"
          />
          <span className="text-xs text-muted-foreground">{settings.steps}</span>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Number of Images
            <Tooltip content="Number of images to generate">
              <span className="text-xs text-muted-foreground">(?)</span>
            </Tooltip>
          </Label>
          <Slider
            value={[settings.numOutputs]}
            onValueChange={([value]) => onSettingsChange({ numOutputs: value })}
            max={4}
            min={1}
            step={1}
            className="[&_[role=slider]]:bg-primary"
          />
          <span className="text-xs text-muted-foreground">{settings.numOutputs}</span>
        </div>

        <div className="space-y-2">
          <Label>Aspect Ratio</Label>
          <Select
            value={settings.aspectRatio}
            onValueChange={(value) => onSettingsChange({ aspectRatio: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select aspect ratio" />
            </SelectTrigger>
            <SelectContent>
              {aspectRatios.map((ratio) => (
                <SelectItem key={ratio} value={ratio}>
                  {ratio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};