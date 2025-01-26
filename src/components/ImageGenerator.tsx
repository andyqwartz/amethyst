import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Settings, Image as ImageIcon, Sparkles } from 'lucide-react';

export const ImageGenerator = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    guidanceScale: 3.5,
    steps: 28,
    quality: 80,
    aspectRatio: "1:1"
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
    // API call would go here
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in">
      <Card className="max-w-4xl mx-auto backdrop-blur-lg bg-card border border-border/50">
        <div className="p-6 space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">Image Generator</h1>
            <p className="text-sm text-foreground/70">Create unique images with AI</p>
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

            {showSettings && (
              <div className="space-y-4 p-4 bg-background/30 rounded-lg border border-border/50 animate-fade-in">
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
                  <label className="text-sm font-medium">Quality</label>
                  <Slider
                    value={[settings.quality]}
                    onValueChange={([value]) => setSettings(s => ({ ...s, quality: value }))}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            )}

            <div className="aspect-square rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center">
              <div className="text-center space-y-2">
                <ImageIcon className="h-12 w-12 mx-auto text-foreground/30" />
                <p className="text-sm text-foreground/50">Generated image will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};