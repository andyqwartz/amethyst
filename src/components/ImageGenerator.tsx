import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Settings, Image as ImageIcon, Download, Sparkles } from 'lucide-react';
import type { GenerationSettings } from '@/types/replicate';

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

  const aspectRatios = [
    "1:1", "16:9", "21:9", "3:2", "2:3", "4:5", "5:4", "3:4", "4:3", "9:16", "9:21"
  ];

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

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image.${settings.outputFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download the image",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in">
      <Card className="max-w-4xl mx-auto glass-card">
        <div className="p-6 space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">AI Image Generator</h1>
            <p className="text-sm text-foreground/70">Create unique images with Replicate API</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Describe the image you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full pr-32 bg-background/50"
              />
              <div className="absolute right-2 top-2 flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  {isGenerating ? (
                    <Sparkles className="h-4 w-4 animate-spin" />
                  ) : (
                    "Generate"
                  )}
                </Button>
              </div>
            </div>

            <Input
              placeholder="Negative prompt (optional)"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="bg-background/50"
            />

            {showSettings && (
              <div className="space-y-4 p-4 bg-background/30 rounded-lg border border-border/50 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Guidance Scale</label>
                    <Slider
                      value={[settings.guidanceScale]}
                      onValueChange={([value]) => setSettings(s => ({ ...s, guidanceScale: value }))}
                      max={10}
                      step={0.1}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Steps</label>
                    <Slider
                      value={[settings.steps]}
                      onValueChange={([value]) => setSettings(s => ({ ...s, steps: value }))}
                      max={50}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Number of Images</label>
                    <Slider
                      value={[settings.numOutputs]}
                      onValueChange={([value]) => setSettings(s => ({ ...s, numOutputs: value }))}
                      max={4}
                      min={1}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Aspect Ratio</label>
                    <Select
                      value={settings.aspectRatio}
                      onValueChange={(value) => setSettings(s => ({ ...s, aspectRatio: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select aspect ratio" />
                      </SelectTrigger>
                      <SelectContent>
                        {aspectRatios.map((ratio) => (
                          <SelectItem key={ratio} value={ratio}>
                            {ratio}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Generated image ${index + 1}`}
                    className="w-full h-auto rounded-lg"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handleDownload(imageUrl)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {!generatedImages.length && (
                <div className="col-span-full aspect-square rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <ImageIcon className="h-12 w-12 mx-auto text-foreground/30" />
                    <p className="text-sm text-foreground/50">Generated images will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};