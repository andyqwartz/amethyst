import React from 'react';
import { GuidanceScale } from './settings/parameters/GuidanceScale';
import { Steps } from './settings/parameters/Steps';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HelpCircle } from 'lucide-react';
import type { GenerationSettings } from '@/types/replicate';

interface ParameterInputsProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
}

export const ParameterInputs = ({ settings, onSettingsChange }: ParameterInputsProps) => {
  console.log('ParameterInputs - settings:', settings);
  console.log('ParameterInputs - numOutputs:', settings.numOutputs);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GuidanceScale
          value={settings.guidanceScale}
          onChange={(value) => onSettingsChange({ guidanceScale: value })}
        />
        <Steps
          value={settings.steps}
          onChange={(value) => onSettingsChange({ steps: value })}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          Nombre d'images
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Nombre d'images à générer (1-4)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <Select
          value={settings.numOutputs?.toString()}
          onValueChange={(value) => onSettingsChange({ numOutputs: parseInt(value) })}
        >
          <SelectTrigger className="w-full bg-popover border-primary/20">
            <SelectValue placeholder="Sélectionner le nombre d'images" />
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