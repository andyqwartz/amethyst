import React, { useRef, useEffect } from 'react';
<<<<<<< HEAD
import { Textarea } from '@/components/ui/textarea';
import type { GenerationSettings } from '@/types/replicate';

interface PromptInputProps {
  settings: GenerationSettings;
  updateSettings: (settings: Partial<GenerationSettings>) => void;
  onGenerate: () => void;
=======
import { Textarea } from "@/components/ui/textarea";
import { useImageGeneratorStore } from '@/state/imageGeneratorStore';
import { ImageSettings } from '@/types/generation';

interface PromptInputProps {
  settings: ImageSettings;
  updateSettings: (settings: Partial<ImageSettings>) => void;
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
}

export const PromptInput: React.FC<PromptInputProps> = ({
  settings,
<<<<<<< HEAD
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
=======
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
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
      };
    }
  }, [settings.prompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
<<<<<<< HEAD
    e.preventDefault();
    onGenerate();
  }
=======
      e.preventDefault();
      if (ui.showSettings) {
        updateSettings({ showSettings: false });
      }
    }
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
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
<<<<<<< HEAD
};
=======
};
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
