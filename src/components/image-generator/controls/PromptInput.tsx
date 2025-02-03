import React, { useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { useImageGeneratorStore } from '@/state/imageGeneratorStore';
import { ImageSettings } from '@/types/generation';

interface PromptInputProps {
  settings: ImageSettings;
  updateSettings: (settings: Partial<ImageSettings>) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  settings,
  updateSettings
}) => {
  const { ui } = useImageGeneratorStore();
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
      if (ui.showSettings) {
        updateSettings({ showSettings: false });
      }
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSettings({ prompt: e.target.value });
  };

  return (
    <div className="w-full">
      <Textarea
        ref={textareaRef}
        placeholder="Décrivez l'image que vous souhaitez générer..."
        value={settings.prompt || ''}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        className="prompt-input resize-none min-h-[3rem] py-2 px-4"
        rows={1}
      />
    </div>
  );
};