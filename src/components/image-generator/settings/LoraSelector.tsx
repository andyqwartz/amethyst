import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LoraSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const LoraSelector = ({ value, onChange }: LoraSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>LoRA Models</Label>
      <Select 
        value={value[0]} 
        onValueChange={(val) => onChange([val])}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un modèle LoRA" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AndyVampiro/joa">JOA</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LoraSelector;