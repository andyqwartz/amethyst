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
  const aspectRatios = [
    { ratio: "1:1", description: "Square format (1024x1024px) - Perfect for profile pictures and social media posts" },
    { ratio: "16:9", description: "Widescreen (1024x576px) - Ideal for YouTube thumbnails and presentations" },
    { ratio: "21:9", description: "Ultra-wide (1024x439px) - Cinematic format for movie scenes and landscapes" },
    { ratio: "3:2", description: "Standard photo (1024x683px) - Classic DSLR camera ratio" },
    { ratio: "2:3", description: "Portrait (683x1024px) - Vertical format for phone wallpapers" },
    { ratio: "4:5", description: "Instagram portrait (819x1024px) - Optimized for Instagram posts" },
    { ratio: "5:4", description: "Large format (1024x819px) - Common for printed photographs" },
    { ratio: "3:4", description: "Classic portrait (768x1024px) - Traditional portrait photography" },
    { ratio: "4:3", description: "Standard screen (1024x768px) - Classic monitor aspect ratio" },
    { ratio: "9:16", description: "Mobile (576x1024px) - Perfect for Stories and TikTok" },
    { ratio: "9:21", description: "Vertical panorama (439x1024px) - Tall architectural shots" }
  ];

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
          Aspect Ratio {renderTooltip("Choose the dimensions for your generated image")}
        </Label>
        <Select
          value={settings.aspectRatio}
          onValueChange={(value) => onSettingsChange({ aspectRatio: value })}
        >
          <SelectTrigger className="bg-popover border-primary/20">
            <SelectValue placeholder="Select aspect ratio" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-primary/20 max-h-[300px] w-[320px] sm:w-[400px]">
            {aspectRatios.map(({ ratio, description }) => (
              <SelectItem 
                key={ratio} 
                value={ratio}
                className="flex flex-col items-start py-3"
              >
                <div className="flex flex-col gap-1.5 w-full pr-2">
                  <span className="font-medium text-sm">{ratio}</span>
                  <span className="text-xs leading-relaxed text-primary/70 break-normal whitespace-normal">{description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="flex items-center">
            Number of Steps {renderTooltip("Number of inference steps")}
          </Label>
          <div className="relative pt-6">
            <Slider
              value={[settings.steps]}
              onValueChange={([value]) => onSettingsChange({ steps: value })}
              max={50}
              min={1}
              step={1}
              className="[&_[role=slider]]:bg-primary"
            />
            <span className="absolute top-0 left-0 text-xs text-primary/50">{settings.steps}</span>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="flex items-center">
            Guidance Scale {renderTooltip("Controls how closely the output adheres to the prompt")}
          </Label>
          <div className="relative pt-6">
            <Slider
              value={[settings.guidanceScale]}
              onValueChange={([value]) => onSettingsChange({ guidanceScale: value })}
              max={10}
              min={0}
              step={0.1}
              className="[&_[role=slider]]:bg-primary"
            />
            <span className="absolute top-0 left-0 text-xs text-primary/50">{settings.guidanceScale}</span>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="flex items-center">
            Prompt Strength {renderTooltip("Prompt strength when using image to image")}
          </Label>
          <div className="relative pt-6">
            <Slider
              value={[settings.promptStrength]}
              onValueChange={([value]) => onSettingsChange({ promptStrength: value })}
              max={1}
              min={0}
              step={0.1}
              className="[&_[role=slider]]:bg-primary"
            />
            <span className="absolute top-0 left-0 text-xs text-primary/50">{settings.promptStrength}</span>
          </div>
        </div>
      </div>
    </div>
  );
};