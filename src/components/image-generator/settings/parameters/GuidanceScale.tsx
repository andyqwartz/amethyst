import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HelpCircle } from 'lucide-react';
import type { ImageSettings } from '@/types/generation';

interface GuidanceScaleProps {
  value: number;
  onChange: (value: number) => void;
}

export const GuidanceScale = ({ value, onChange }: GuidanceScaleProps) => {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        Guidance Scale
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Controls how closely the output adheres to the prompt (default: 3.5)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <Slider
        value={[value]}
        onValueChange={([value]) => onChange(value)}
        max={10}
        min={0}
        step={0.1}
        className="[&_[role=slider]]:bg-primary"
      />
      <span className="text-xs text-primary/50">{value}</span>
    </div>
  );
};
