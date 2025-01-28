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
          <HelpCircle className="h-4 w-4 text-white/50" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm text-white">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  React.useEffect(() => {
    if (!settings.aspect_ratio) {
      onSettingsChange({
        aspect_ratio: "1:1",
        num_inference_steps: 28,
        guidance_scale: 7.5,
        prompt_strength: 0.8,
        output_format: "webp",
        output_quality: 90,
        hf_loras: ["stabilityai/sd-vae-ft-mse"],
        lora_scales: [0.8]
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-4 md:space-y-3">
        <Label className="flex items-center text-white">
          Format {renderTooltip("Choose the dimensions for your generated image")}
        </Label>
        <Select
          value={settings.aspect_ratio}
          onValueChange={(value) => onSettingsChange({ aspect_ratio: value })}
        >
          <SelectTrigger className="bg-popover border-primary/20 text-white">
            <SelectValue placeholder="Select aspect ratio" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-primary/20 max-h-[300px]">
            {aspectRatios.map(({ ratio, description }) => (
              <SelectItem 
                key={ratio} 
                value={ratio}
                className="flex flex-col items-start py-4"
              >
                <span className="font-medium text-white text-base">{ratio}</span>
                <span className="text-xs text-white/70 mt-3">{description}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6 md:space-y-4">
        <div>
          <Label className="flex items-center mb-4 md:mb-3 text-white">
            Prompt Strength {renderTooltip("Controls the influence of the prompt on the final image")}
          </Label>
          <div className="space-y-2">
            <Slider
              value={[settings.prompt_strength]}
              onValueChange={([value]) => onSettingsChange({ prompt_strength: value })}
              max={1}
              min={0}
              step={0.1}
              className="[&_[role=slider]]:bg-white"
            />
            <span className="text-xs text-white block mt-2">{settings.prompt_strength}</span>
          </div>
        </div>

        <div>
          <Label className="flex items-center mb-4 md:mb-3 text-white">
            Steps {renderTooltip("Number of inference steps (higher = more detail but slower)")}
          </Label>
          <div className="space-y-2">
            <Slider
              value={[settings.num_inference_steps]}
              onValueChange={([value]) => onSettingsChange({ num_inference_steps: value })}
              max={50}
              min={10}
              step={1}
              className="[&_[role=slider]]:bg-white"
            />
            <span className="text-xs text-white block mt-2">{settings.num_inference_steps}</span>
          </div>
        </div>
      </div>
    </div>
  );
};