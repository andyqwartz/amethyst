import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus } from 'lucide-react';

interface LoraFieldProps {
  lora: string;
  scale: number;
  loraHistory: string[];
  onLoraChange: (value: string) => void;
  onScaleChange: (value: number) => void;
  onRemove: () => void;
}

export const LoraField = ({
  lora,
  scale,
  loraHistory,
  onLoraChange,
  onScaleChange,
  onRemove
}: LoraFieldProps) => {
  return (
    <div className="flex items-center gap-2 md:gap-4">
      <Select
        value={lora}
        onValueChange={onLoraChange}
      >
        <SelectTrigger className="bg-card border-primary/20 flex-1 min-w-0 whitespace-normal break-words">
          <SelectValue className="text-wrap" />
        </SelectTrigger>
        <SelectContent className="bg-card border-primary/20 max-w-[90vw] md:max-w-[40vw]">
          {loraHistory.filter(item => item && item.trim()).map((historyLora) => (
            <SelectItem 
              key={historyLora} 
              value={historyLora}
              className="whitespace-normal break-words pr-6"
            >
              {historyLora}
            </SelectItem>
          ))}
          <div className="px-2 py-2">
            <Input
              value={lora}
              onChange={(e) => {
                const value = e.target.value.trim();
                if (value) {
                  onLoraChange(value);
                }
              }}
              placeholder="Custom HuggingFace path or URL"
              className="bg-card border-primary/20"
            />
          </div>
        </SelectContent>
      </Select>
      <Input
        type="number"
        value={scale}
        onChange={(e) => onScaleChange(parseFloat(e.target.value))}
        className="bg-card border-primary/20 w-16 md:w-24 shrink-0"
        step={0.1}
        min={0}
        max={1}
      />
      <Button
        onClick={onRemove}
        variant="ghost"
        size="icon"
        className="text-primary hover:bg-primary/10 shrink-0"
      >
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  );
};