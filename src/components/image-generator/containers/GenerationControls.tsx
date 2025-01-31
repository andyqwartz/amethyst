import React from 'react';
import { PromptInput } from '../controls/PromptInput';
import { GenerationButtons } from '../controls/GenerationButtons';
import { AdvancedSettings } from '../settings/AdvancedSettings';
import { useImageGeneratorStore } from '@/state/imageGeneratorStore';

export const GenerationControls: React.FC = () => {
  const isGenerating = useImageGeneratorStore((state) => state.ui.isGenerating);
  const isSettingsModalOpen = useImageGeneratorStore((state) => state.ui.isSettingsModalOpen);

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-col gap-4 p-4">
        <PromptInput />
        <GenerationButtons />
      </div>
      
      {isSettingsModalOpen && (
        <div className="px-4 pb-4">
          <AdvancedSettings disabled={isGenerating} />
        </div>
      )}
    </div>
  );
};