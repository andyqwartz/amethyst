import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { History, Settings, Sparkles, HelpCircle, ImagePlus } from 'lucide-react';
import type { GenerationSettings, GenerationStatus } from '@/types/replicate';
import { AdvancedSettings } from './image-generator/AdvancedSettings';
import { ImagePreview } from './image-generator/ImagePreview';
import { ThemeToggle } from './image-generator/ThemeToggle';
import { generateImage } from '@/services/replicate';
import { useImageHistory } from '@/hooks/useImageHistory';

export const ImageGenerator = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [showSettings, setShowSettings] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const { history, addToHistory } = useImageHistory();
  const [settings, setSettings] = useState<GenerationSettings>(() => {
    const saved = localStorage.getItem('last_settings');
    return saved ? JSON.parse(saved) : {
      prompt: '',
      negativePrompt: '',
      guidanceScale: 3.5,
      steps: 28,
      numOutputs: 1,
      aspectRatio: "1:1",
      outputFormat: "webp",
      outputQuality: 80,
      promptStrength: 0.8,
      hfLoras: [],
      loraScales: [],
      disableSafetyChecker: false
    };
  });

  useEffect(() => {
    localStorage.setItem('last_settings', JSON.stringify(settings));
  }, [settings]);

  const handleGenerate = async () => {
    if (!settings.prompt.trim()) {
      toast({
        title: "Veuillez entrer un prompt",
        description: "Le prompt ne peut pas être vide",
        variant: "destructive"
      });
      return;
    }

    console.log('Starting generation with settings:', settings);
    setStatus('loading');
    
    try {
      const images = await generateImage({
        prompt: settings.prompt,
        negative_prompt: settings.negativePrompt,
        guidance_scale: settings.guidanceScale,
        num_inference_steps: settings.steps,
        num_outputs: settings.numOutputs,
        seed: settings.seed,
        aspect_ratio: settings.aspectRatio,
        output_format: settings.outputFormat,
        output_quality: settings.outputQuality,
        prompt_strength: settings.promptStrength,
        hf_loras: settings.hfLoras,
        lora_scales: settings.loraScales,
        disable_safety_checker: settings.disableSafetyChecker,
      });
      
      console.log('Generation successful:', images);
      setGeneratedImages(images);
      images.forEach(url => addToHistory(url, settings));
      setStatus('success');
      
      toast({
        title: "Images générées avec succès",
        description: `${images.length} image(s) générée(s)`,
      });
    } catch (error) {
      console.error('Generation failed:', error);
      setStatus('error');
      toast({
        title: "Erreur CORS",
        description: error.message,
        variant: "destructive",
        duration: 10000,
      });
    }
  };

  const handleDownload = (imageUrl: string) => {
    console.log('Downloading image:', imageUrl);
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-image-${Date.now()}.${settings.outputFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTweak = (imageSettings: GenerationSettings) => {
    console.log('Tweaking settings:', imageSettings);
    setSettings(imageSettings);
    setShowSettings(true);
    toast({
      title: "Paramètres importés",
      description: "Les paramètres de l'image ont été chargés",
    });
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
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-primary/10"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-5 w-5 text-primary" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-primary/10"
              onClick={() => {
                toast({
                  title: "Note de développement",
                  description: "Cette application nécessite un serveur proxy ou une fonction serverless pour gérer les appels API Replicate en raison des restrictions CORS.",
                  duration: 5000,
                });
              }}
            >
              <HelpCircle className="h-5 w-5 text-primary" />
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Main Content */}
        <Card className="border-none glass-card shadow-xl">
          <div className="p-6 space-y-6">
            {/* Image Upload Area */}
            <button className="w-full p-6 border-2 border-dashed border-primary/30 rounded-xl hover:bg-primary/5 transition-colors">
              <div className="flex flex-col items-center gap-2 text-primary/70">
                <ImagePlus className="h-6 w-6" />
                <span>Ajouter une image de référence</span>
              </div>
            </button>

            {/* Prompt Input */}
            <div className="space-y-2">
              <Input
                placeholder="Décrivez l'image que vous souhaitez générer..."
                value={settings.prompt}
                onChange={(e) => setSettings(s => ({ ...s, prompt: e.target.value }))}
                className="bg-white/50 border-primary/20 text-foreground placeholder:text-primary/50 focus:border-primary/50"
              />
              <div className="text-sm text-primary/70">
                {settings.prompt.length} caractères
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
                Paramètres avancés
              </Button>

              <Button
                onClick={handleGenerate}
                disabled={status === 'loading'}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {status === 'loading' ? (
                  <Sparkles className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Générer
              </Button>
            </div>

            {showSettings && (
              <AdvancedSettings
                settings={settings}
                onSettingsChange={(newSettings) => setSettings(s => ({ ...s, ...newSettings }))}
              />
            )}

            <ImagePreview
              images={generatedImages}
              onDownload={handleDownload}
              onTweak={handleTweak}
              settings={settings}
              className="mt-8"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
