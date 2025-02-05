import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface OutputQualitySelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export const OutputQualitySelector = ({ value, onChange }: OutputQualitySelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Qualité ({value}%)</Label>
      <Slider
        value={[value]}
        onValueChange={([val]) => onChange(val)}
        min={1}
        max={100}
        step={1}
      />
    </div>
  );
};

export default OutputQualitySelector;