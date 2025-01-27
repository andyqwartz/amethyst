import React from 'react';
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
          <span className="text-xs text-primary/50">{settings.guidanceScale}</span>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Steps
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="text-xs text-primary/50">(?)</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Number of inference steps</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
          <Label>Aspect Ratio</Label>
          <Select
            value={settings.aspectRatio}
            onValueChange={(value) => onSettingsChange({ aspectRatio: value })}
          >
            <SelectTrigger className="bg-popover border-primary/20">
              <SelectValue placeholder="Select aspect ratio" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-primary/20">
              {aspectRatios.map((ratio) => (
                <SelectItem key={ratio} value={ratio}>
                  {ratio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Output Format</Label>
          <Select
            value={settings.outputFormat}
            onValueChange={(value) => onSettingsChange({ outputFormat: value as "webp" | "jpg" | "png" })}
          >
            <SelectTrigger className="bg-popover border-primary/20">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-primary/20">
              <SelectItem value="webp">WebP</SelectItem>
              <SelectItem value="jpg">JPG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};