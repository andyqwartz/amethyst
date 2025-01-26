import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { History, Settings, Sparkles, HelpCircle, ImagePlus } from 'lucide-react';
import type { GenerationSettings } from '@/types/replicate';
import { ParameterInputs } from './image-generator/ParameterInputs';
import { ImagePreview } from './image-generator/ImagePreview';
import { ThemeToggle } from './image-generator/ThemeToggle';

export const ImageGenerator = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [settings, setSettings] = useState<GenerationSettings>({
    guidanceScale: 3.5,
    steps: 28,
    numOutputs: 1,
    aspectRatio: "1:1",
    outputFormat: "webp",
    outputQuality: 80,
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "The prompt cannot be empty",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          negativePrompt,
          ...settings,
        }),
      });

      if (!response.ok) throw new Error('Generation failed');
      
      const images = await response.json();
      setGeneratedImages(images);
      toast({
        title: "Images generated successfully",
        description: `Generated ${images.length} image(s)`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-primary/5 p-4 rounded-xl flex justify-between items-center mb-4 glass-card">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Amethyst
          </h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <History className="h-5 w-5 text-primary" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <Settings className="h-5 w-5 text-primary" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <HelpCircle className="h-5 w-5 text-primary" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Card className="border-none glass-card shadow-xl">
          <div className="p-6 space-y-6">
            {/* Image Upload Area */}
            <button className="w-full p-6 border-2 border-dashed border-primary/30 rounded-xl hover:bg-primary/5 transition-colors">
              <div className="flex flex-col items-center gap-2 text-primary/70">
                <ImagePlus className="h-6 w-6" />
                <span>Add a reference image</span>
              </div>
            </button>

            {/* Prompt Input */}
            <div className="space-y-2">
              <Input
                placeholder="Describe the image you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-white/50 border-primary/20 text-foreground placeholder:text-primary/50 focus:border-primary/50"
              />
              <div className="text-sm text-primary/70">
                {prompt.length} characters
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={() => setShowSettings(!showSettings)}
                className="w-full bg-white/50 hover:bg-white/70 text-foreground border border-primary/20"
                variant="secondary"
              >
                <Settings className="h-4 w-4 mr-2" />
                Options
              </Button>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isGenerating ? (
                  <Sparkles className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Generate
              </Button>
            </div>

            {showSettings && (
              <div className="space-y-4 p-4 bg-white/50 rounded-xl animate-fade-in">
                <ParameterInputs
                  settings={settings}
                  onSettingsChange={(newSettings) => setSettings(s => ({ ...s, ...newSettings }))}
                />
              </div>
            )}

            <ImagePreview
              images={generatedImages}
              onDownload={() => {}}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};