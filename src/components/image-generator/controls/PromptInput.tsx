import React, { useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import type { GenerationSettings } from '@/types/replicate';

interface PromptInputProps {
  settings: GenerationSettings;
  updateSettings: (settings: Partial<GenerationSettings>) => void;
  onGenerate: () => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  settings,
  updateSettings,
  onGenerate,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const resizeTextarea = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
      }
    };

    resizeTextarea();
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('input', resizeTextarea);
      return () => {
        textarea.removeEventListener('input', resizeTextarea);
      };
    }
  }, [settings.prompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    onGenerate();
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
