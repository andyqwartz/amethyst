import React, { useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import type { ImageSettings } from '@/types/generation';
import { useImageGeneratorStore } from '@/state/imageGeneratorStore';

interface PromptInputProps {
  settings: ImageSettings;
  onSettingsChange: (settings: Partial<ImageSettings>) => void;
  onGenerate: () => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  settings,
  onSettingsChange,
  onGenerate,
}) => {
  const { ui, setShowSettings } = useImageGeneratorStore();
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
        setShowSettings(false);
      }
      onGenerate();
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onSettingsChange({ prompt: e.target.value });
  };

  return (
    <div className="w-full">
      <Textarea
        ref={textareaRef}
        placeholder="Describe the image you want to generate..."
        value={settings.prompt || ''}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        className="prompt-input resize-none min-h-[3rem] py-2 px-4"
        rows={1}
      />
    </div>
  );
};
