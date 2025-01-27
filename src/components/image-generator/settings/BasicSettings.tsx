import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HelpCircle } from 'lucide-react';
import type { GenerationSettings } from '@/types/replicate';

interface BasicSettingsProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
}

export const BasicSettings = ({ settings, onSettingsChange }: BasicSettingsProps) => {
  const aspectRatios = ["1:1", "16:9", "21:9", "3:2", "2:3", "4:5", "5:4", "3:4", "4:3", "9:16", "9:21"];

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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="flex items-center">
          Aspect Ratio {renderTooltip("Aspect ratio for the generated image")}
        </Label>
        <Select
          value={settings.aspectRatio}
          onValueChange={(value) => onSettingsChange({ aspectRatio: value })}
        >
          <SelectTrigger className="bg-popover border-primary/20">
            <SelectValue placeholder="Select aspect ratio" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-primary/20">
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
  );
};