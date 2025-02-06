import React from 'react';
import { useToast } from "@/components/ui/use-toast";
import type { GenerationSettings } from '@/types/replicate';

interface PromptInputProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
  onGenerate: () => void;
}

export const PromptInput = ({ settings, onSettingsChange, onGenerate }: PromptInputProps) => {
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    const lines = Math.ceil(textarea.value.length / 50);
    const lineHeight = 24;
    textarea.style.height = `${Math.max(40, lines * lineHeight)}px`;
    
    onSettingsChange({ 
      prompt: textarea.value,
      hf_loras: [],
      lora_scales: []
    });
  };

  return (
    <div className="flex justify-center items-center my-6">
      <div className="inline-flex items-center max-w-[90vw]">
        <div className="
          relative 
          inline-block
          p-1
          rounded-full
          bg-gradient-to-br 
          from-primary/5 
          to-primary/10 
          animate-float
          shadow-lg
          backdrop-blur-sm
        ">
          <textarea
            placeholder="Imagine..."
            value={settings.prompt}
            onChange={handleTextareaInput}
            className="
              block
              min-w-[200px]
              max-w-[80vw]
              h-10
              bg-card/80 
              border 
              border-primary/20 
              text-foreground 
              placeholder:text-primary/50 
              focus:border-primary/50 
              rounded-full
              px-4
              py-2
              text-center
              text-sm
              transition-all 
              duration-300
              shadow-inner
              leading-6
              overflow-hidden
              focus:outline-none
              focus:ring-2
              focus:ring-primary/20
              hover:border-primary/30
              resize-none
              whitespace-normal
              text-align-center
            "
            style={{
              transform: settings.prompt ? 'scale(1.02)' : 'scale(1)',
              textAlignLast: 'center',
              textAlign: 'center'
            }}
            rows={1}
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