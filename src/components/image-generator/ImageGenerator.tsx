import React from 'react';
import { useImageGeneratorStore } from '../../state/imageGeneratorStore';
import { v4 as uuidv4 } from 'uuid';

export const ImageGenerator: React.FC = () => {
  const settings = useImageGeneratorStore((state) => state.settings);
  const currentImage = useImageGeneratorStore((state) => state.currentImage);
  const isGenerating = useImageGeneratorStore((state) => state.ui.isGenerating);
  const error = useImageGeneratorStore((state) => state.error);
  
  const setIsGenerating = useImageGeneratorStore((state) => state.setIsGenerating);
  const setCurrentImage = useImageGeneratorStore((state) => state.setCurrentImage);
  const addGeneratedImage = useImageGeneratorStore((state) => state.addGeneratedImage);
  const addToHistory = useImageGeneratorStore((state) => state.addToHistory);
  const setError = useImageGeneratorStore((state) => state.setError);
  const clearError = useImageGeneratorStore((state) => state.clearError);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      clearError();

      // Mock API call - replace with actual API integration
<<<<<<< HEAD
      const response = await fetch('/api/generate-image', {
=======
      const response = await fetch('/api/generate', {
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      const generatedImage = {
        id: uuidv4(),
        url: data.imageUrl,
        timestamp: Date.now(),
        settings: { ...settings },
      };

      setCurrentImage(generatedImage);
      addGeneratedImage(generatedImage);
      addToHistory(generatedImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="image-generator">
      {error.hasError && (
        <div className="error-message">
          {error.errorMessage}
        </div>
      )}
      
      <div className="settings-display">
        <h3>Current Settings</h3>
        <div>Prompt: {settings.prompt}</div>
        <div>Width: {settings.width}</div>
        <div>Height: {settings.height}</div>
        <div>Steps: {settings.steps}</div>
      </div>

      <button 
        onClick={handleGenerate}
        disabled={isGenerating || !settings.prompt}
      >
        {isGenerating ? 'Generating...' : 'Generate Image'}
      </button>

      {currentImage && (
        <div className="generated-image">
          <img 
            src={currentImage.url} 
            alt={currentImage.settings.prompt}
            style={{ 
              maxWidth: '100%', 
              height: 'auto' 
            }}
          />
        </div>
      )}
    </div>
  );
<<<<<<< HEAD
};
=======
};
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
