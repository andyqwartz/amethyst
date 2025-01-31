import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ImageFormatsSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const ImageFormatsSelector = ({ value, onChange }: ImageFormatsSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Format d'image</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="webp">WebP</SelectItem>
          <SelectItem value="png">PNG</SelectItem>
          <SelectItem value="jpeg">JPEG</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ImageFormatsSelector;