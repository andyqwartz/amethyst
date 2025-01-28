import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HelpCircle } from 'lucide-react';

interface StrengthSliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  tooltip: string;
  min?: number;
  max?: number;
  step?: number;
}

export const StrengthSlider = ({
  value,
  onChange,
  label,
  tooltip,
  min = 0,
  max = 1,
  step = 0.1
}: StrengthSliderProps) => {
  return (
    <div>
      <Label className="flex items-center mb-4 md:mb-3 text-white">
        {label}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="ml-2">
              <HelpCircle className="h-4 w-4 text-white/50" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm text-white">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <div className="space-y-2">
        <Slider
          value={[value]}
          onValueChange={([newValue]) => onChange(newValue)}
          max={max}
          min={min}
          step={step}
          className="[&_[role=slider]]:bg-white"
        />
        <span className="text-xs text-white block mt-2">{value}</span>
      </div>
    </div>
  );
};