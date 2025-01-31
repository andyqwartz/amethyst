import React, { useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import type { GenerationSettings } from '@/types/replicate';

interface PromptInputProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
  onGenerate: () => void;
  showSettings?: boolean;
  onToggleSettings?: () => void;
}

export const PromptInput = ({
  settings,
  onSettingsChange,
  onGenerate,
  showSettings,
  onToggleSettings
}: PromptInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const resizeTextarea = () => {
        const textarea = textareaRef.current;
        if (textarea) {
          textarea.style.height = 'auto';
          textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
      };

      resizeTextarea();
      textareaRef.current.addEventListener('input', resizeTextarea);
      return () => {
        if (textareaRef.current) {
          textareaRef.current.removeEventListener('input', resizeTextarea);
        }
      };
    }
  }, [settings.prompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (showSettings && onToggleSettings) {
        onToggleSettings();
      }
      onGenerate();
    }
  };

  return (
    <div className="w-full">
      <Textarea
        ref={textareaRef}
        placeholder="Décrivez l'image que vous souhaitez générer..."
        value={settings.prompt || ''}
        onChange={(e) => onSettingsChange({ prompt: e.target.value })}
        onKeyDown={handleKeyDown}
        className="prompt-input resize-none min-h-[3rem] py-2 px-4"
        rows={1}
      />
    </div>
  );
};