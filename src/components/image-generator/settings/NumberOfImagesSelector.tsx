import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NumberOfImagesSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export const NumberOfImagesSelector = ({ value, onChange }: NumberOfImagesSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Nombre d'images</Label>
      <Select 
        value={value.toString()} 
        onValueChange={(val) => onChange(parseInt(val))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner le nombre d'images" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1 image</SelectItem>
          <SelectItem value="2">2 images</SelectItem>
          <SelectItem value="4">4 images</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default NumberOfImagesSelector;