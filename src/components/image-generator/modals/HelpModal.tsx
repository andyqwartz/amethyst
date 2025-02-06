import React, { useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sparkles, X, Github, Mail, Twitter } from 'lucide-react';

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  open,
  onOpenChange
}) => {
  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-screen h-screen max-w-none m-0 p-0 bg-background/95 backdrop-blur-xl" 
        onClick={handleBackdropClick}
        onEscapeKeyDown={handleClose}
        onInteractOutside={handleClose}
      >
        <DialogTitle className="sr-only">Help and Credits</DialogTitle>
        <DialogDescription className="sr-only">
          User guide and information about Amethyst
        </DialogDescription>
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="relative hover:bg-primary/10 active:bg-primary/20 transition-all duration-300 hover:scale-105 touch-manipulation rounded-xl"
          >
            <X className="h-5 w-5 text-primary" />
          </Button>
        </div>

        <ScrollArea className="h-screen w-full" onClick={e => e.stopPropagation()}>
          <div className="flex flex-col items-center p-6 space-y-12 max-w-3xl mx-auto pb-24">
            {/* Logo and Title */}
            <div 
              className="flex flex-col items-center space-y-4 animate-in fade-in-0 duration-500 pt-12 cursor-pointer group"
              onClick={handleClose}
            >
              <div className="relative transition-transform duration-300 group-hover:scale-105">
                <div className="absolute inset-0 bg-[#D6BCFA]/20 blur-xl animate-pulse rounded-full group-hover:bg-[#D6BCFA]/30"></div>
                <Sparkles className="h-20 w-20 text-[#D6BCFA] relative animate-pulse group-hover:text-[#D6BCFA]/80" />
              </div>
              <h1 className="text-5xl font-bold font-outfit title-gradient group-hover:opacity-80">
                Amethyst
              </h1>
              <p className="text-xl text-muted-foreground text-center max-w-lg group-hover:text-[#D6BCFA]/80">
                A new generation of creative AI to transform your ideas into images
              </p>
            </div>

            {/* Contact & Links */}
            <section className="text-center space-y-6 animate-in fade-in-50 duration-700 w-full">
              <h2 className="text-3xl font-semibold text-[#D6BCFA]">Contact & Links</h2>
              <div className="flex justify-center gap-6">
                <a href="https://github.com/joachimcohen" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center gap-2 px-6 py-3 bg-card hover:bg-card/80 rounded-lg transition-all hover:scale-105">
                  <Github className="h-5 w-5" />
                  <span>GitHub</span>
                </a>
                <a href="mailto:joachim.cohen@outlook.fr" 
                   className="flex items-center gap-2 px-6 py-3 bg-card hover:bg-card/80 rounded-lg transition-all hover:scale-105">
                  <Mail className="h-5 w-5" />
                  <span>Contact</span>
                </a>
                <a href="https://twitter.com/joachimcohen" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-6 py-3 bg-card hover:bg-card/80 rounded-lg transition-all hover:scale-105">
                  <Twitter className="h-5 w-5" />
                  <span>Twitter</span>
                </a>
              </div>
            </section>

            {/* User Guide */}
            <section className="space-y-6 animate-in fade-in-50 duration-1000 w-full">
              <h2 className="text-3xl font-semibold text-[#D6BCFA] text-center">User Guide</h2>
              <div className="space-y-6 text-muted-foreground">
                <div className="bg-card/50 rounded-xl p-6 space-y-4">
                  <h3 className="text-xl font-medium text-foreground">Getting Started with Amethyst</h3>
                  <p>
                    Amethyst is designed to be both intuitive and powerful. Here's how to get started:
                  </p>
                  <ol className="list-decimal list-inside space-y-3 pl-4">
                    <li>Sign in with your Google account to access all features</li>
                    <li>In the main text field, describe the image you want to generate</li>
                    <li>Use the advanced settings button to fine-tune your generation</li>
                    <li>Click "Generate" and let the AI create your vision</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Advanced Settings */}
            <section className="space-y-6 animate-in fade-in-50 duration-1000 w-full">
              <h2 className="text-3xl font-semibold text-[#D6BCFA] text-center">Advanced Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card/50 rounded-xl p-6 space-y-4">
                  <h3 className="text-xl font-medium text-foreground">LoRA (Low-Rank Adaptation)</h3>
                  <p className="text-muted-foreground">
                    LoRAs are adaptation modules that allow you to customize the style
                    and content of your generations. Each LoRA can be combined and adjusted:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                    <li>Artistic style (anime, photorealistic, painting...)</li>
                    <li>Specific content (characters, objects, environments)</li>
                    <li>Scale adjustment (0.1 to 1.0) to control influence</li>
                  </ul>
                </div>

                <div className="bg-card/50 rounded-xl p-6 space-y-4">
                  <h3 className="text-xl font-medium text-foreground">Generation Pipeline</h3>
                  <p className="text-muted-foreground">
                    Our pipeline uses the latest advances in stable diffusion:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                    <li>SDXL 1.0 base model</li>
                    <li>LoRA support for customization</li>
                    <li>Optimizations for quality and speed</li>
                    <li>Advanced post-processing pipeline</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Advanced Tips */}
            <section className="space-y-6 animate-in fade-in-50 duration-1000 w-full">
              <h2 className="text-3xl font-semibold text-[#D6BCFA] text-center">Advanced Tips</h2>
              <div className="bg-card/50 rounded-xl p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-foreground">Effective Prompts</h3>
                  <p className="text-muted-foreground">
                    For best results, follow these prompting tips:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                    <li>Be specific in your descriptions (composition, lighting, style)</li>
                    <li>Use specific artistic terms</li>
                    <li>Balance positive and negative details</li>
                    <li>Experiment with different LoRA combinations</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-foreground">Parameter Optimization</h3>
                  <p className="text-muted-foreground">
                    Adjust these parameters to refine your results:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                    <li>Steps: 30-50 for good quality/speed balance</li>
                    <li>CFG Scale: 7-8 for fidelity/creativity balance</li>
                    <li>Seed: Fix it to reproduce results</li>
                    <li>Size: Adapt to your needs (optimized for 1024x1024)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Credits */}
            <section className="space-y-6 animate-in fade-in-50 duration-1000 w-full">
              <h2 className="text-3xl font-semibold text-[#D6BCFA] text-center">Credits</h2>
              <div className="bg-card/50 rounded-xl p-6 space-y-4">
                <p className="text-muted-foreground text-center">
                  Developed with passion by Joachim Cohen. Powered by the following technologies:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm text-muted-foreground">
                  <div className="p-3 bg-card/50 rounded-lg">React + TypeScript</div>
                  <div className="p-3 bg-card/50 rounded-lg">Supabase</div>
                  <div className="p-3 bg-card/50 rounded-lg">Stable Diffusion XL</div>
                  <div className="p-3 bg-card/50 rounded-lg">Replicate API</div>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
