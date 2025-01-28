import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface StepsProps {
  value: number;
  onChange: (value: number) => void;
}

export const Steps = ({ value, onChange }: StepsProps) => {
  return (
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
        value={[value]}
        onValueChange={([value]) => onChange(value)}
        max={50}
        min={1}
        step={1}
        className="[&_[role=slider]]:bg-primary"
      />
      <span className="text-xs text-primary/50">{value}</span>
    </div>
  );
};