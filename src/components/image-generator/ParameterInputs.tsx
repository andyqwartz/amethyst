import React from 'react';
import { GuidanceScale } from './settings/parameters/GuidanceScale';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HelpCircle } from 'lucide-react';
import type { ImageSettings } from '@/types/generation';

interface ParameterInputsProps {
  settings: ImageSettings;
  onSettingsChange: (settings: Partial<ImageSettings>) => void;
}

export const ParameterInputs = ({ settings, onSettingsChange }: ParameterInputsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <GuidanceScale
          value={settings.guidance_scale}
          onChange={(value) => onSettingsChange({ guidance_scale: value })}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          Number of Images
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Number of images to generate (1-4)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <Select
          value={settings.num_outputs?.toString()}
          onValueChange={(value) => onSettingsChange({ num_outputs: parseInt(value) })}
        >
          <SelectTrigger className="w-full bg-popover border-primary/20">
            <SelectValue placeholder="Select number of images" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 image</SelectItem>
            <SelectItem value="2">2 images</SelectItem>
            <SelectItem value="3">3 images</SelectItem>
            <SelectItem value="4">4 images</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
