import React, { useEffect, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import type { GenerationSettings } from '@/types/replicate';

interface PromptInputProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
  onGenerate: () => void;
}

export const PromptInput = ({ settings, onSettingsChange, onGenerate }: PromptInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [settings.prompt]);

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    
    onSettingsChange({ 
      prompt: textarea.value,
      hf_loras: settings.hf_loras || [],
      lora_scales: settings.lora_scales || []
    });

    // Save to localStorage
    const currentSettings = localStorage.getItem('generation_settings');
    if (currentSettings) {
      const parsedSettings = JSON.parse(currentSettings);
      localStorage.setItem('generation_settings', JSON.stringify({
        ...parsedSettings,
        prompt: textarea.value
      }));
    }
  };

  return (
    <div className="flex justify-center items-center my-6">
      <div className="inline-flex items-center w-full max-w-[90vw]">
        <div className="
          relative 
          w-full
          p-1
          rounded-2xl
          bg-gradient-to-br 
          from-primary/5 
          to-primary/10 
          animate-float
          shadow-lg
          backdrop-blur-sm
        ">
          <Textarea
            ref={textareaRef}
            placeholder="Imagine..."
            value={settings.prompt}
            onChange={handleTextareaInput}
            className="
              min-h-[40px]
              max-h-[200px]
              w-full
              bg-card/80 
              border 
              border-primary/20 
              text-foreground 
              placeholder:text-primary/50 
              focus:border-primary/50 
              rounded-xl
              px-4
              py-2
              text-center
              text-sm
              transition-all 
              duration-300
              shadow-inner
              leading-6
              resize-none
              focus:outline-none
              focus:ring-2
              focus:ring-primary/20
              hover:border-primary/30
            "
            style={{
              transform: settings.prompt ? 'scale(1.02)' : 'scale(1)',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onGenerate();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};