import React, { memo, useCallback, useEffect } from 'react';
import { PromptInput } from '../controls/PromptInput';
import { GenerationButtons } from '../controls/GenerationButtons';
import { AdvancedSettings } from '../settings/AdvancedSettings';
import { useImageGeneratorStore } from '@/state/imageGeneratorStore';

const AdvancedSettingsWrapper = memo(({ disabled }: { disabled: boolean }) => {
  return (
    <div 
      id="advanced-settings-panel"
      role="region"
      aria-label="Paramètres avancés"
      className="px-4 pb-4 animate-in slide-in-from-top duration-200"
      data-state="visible"
      tabIndex={0}
    >
      <AdvancedSettings disabled={disabled} />
    </div>
  );
});

AdvancedSettingsWrapper.displayName = 'AdvancedSettingsWrapper';

export const GenerationControls: React.FC = () => {
  const isGenerating = useImageGeneratorStore((state) => state.ui.isGenerating);
  const showSettings = useImageGeneratorStore((state) => state.ui.showSettings);
  const setShowSettings = useImageGeneratorStore((state) => state.setShowSettings);

  // Log l'état des paramètres avancés à chaque changement
  useEffect(() => {
    console.log('État des paramètres avancés:', { showSettings, isGenerating });
  }, [showSettings, isGenerating]);

  const handleGenerationStart = useCallback(() => {
    if (showSettings) {
      setShowSettings(false);
    }
  }, [showSettings, setShowSettings]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-4 p-4">
        <PromptInput />
        <GenerationButtons onGenerationStart={handleGenerationStart} />
      </div>
      
      <div 
        className={`relative overflow-hidden transition-all duration-200 ${
          showSettings ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        data-generating={isGenerating}
        aria-hidden={!showSettings || isGenerating}
      >
        <div className="animate-in slide-in-from-top duration-200">
          <AdvancedSettingsWrapper disabled={isGenerating} />
        </div>
      </div>
    </div>
  );
};