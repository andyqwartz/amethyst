import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface PromptStrengthSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export const PromptStrengthSelector = ({ value, onChange }: PromptStrengthSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Force du prompt ({value})</Label>
      <Slider
        value={[value]}
        onValueChange={([val]) => onChange(val)}
        min={0}
        max={1}
        step={0.1}
      />
    </div>
  );
};

export default PromptStrengthSelector;