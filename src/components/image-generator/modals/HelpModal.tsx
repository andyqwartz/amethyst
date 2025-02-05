import React, { useCallback } from 'react';
import {
  Dialog,
  DialogContent,
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
      <DialogContent className="w-screen h-screen max-w-none m-0 p-0 bg-black/30 backdrop-blur-xl" onClick={handleBackdropClick}>
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="relative hover:bg-primary/10 active:bg-primary/20 transition-all duration-300 hover-scale touch-manipulation rounded-xl"
          >
            <X className="h-5 w-5 text-primary" />
          </Button>
        </div>

        <ScrollArea className="h-screen w-full" onClick={e => e.stopPropagation()}>
          <div className="flex flex-col items-center p-6 space-y-12 max-w-3xl mx-auto pb-24">
            {/* Logo et Titre */}
            <div 
              className="flex flex-col items-center space-y-4 animate-in fade-in-0 duration-500 pt-12 cursor-pointer group"
              onClick={handleClose}
            >
              <div className="relative transition-transform duration-300 group-hover:scale-105">
                <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full group-hover:bg-primary/30"></div>
                <Sparkles className="h-20 w-20 text-primary relative animate-pulse group-hover:text-primary/80" />
              </div>
              <h1 className="text-5xl font-bold font-outfit title-gradient group-hover:opacity-80">
                Amethyst
              </h1>
              <p className="text-xl text-muted-foreground text-center max-w-lg group-hover:text-primary/80">
                Une nouvelle génération d'IA créative pour transformer vos idées en images
              </p>
            </div>

            {/* Contact et Liens */}
            <section className="text-center space-y-6 animate-in fade-in-50 duration-700 w-full">
              <h2 className="text-3xl font-semibold text-primary">Contact & Liens</h2>
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

            {/* Guide d'utilisation */}
            <section className="space-y-6 animate-in fade-in-50 duration-1000 w-full">
              <h2 className="text-3xl font-semibold text-primary text-center">Guide d'utilisation</h2>
              <div className="space-y-6 text-muted-foreground">
                <div className="bg-card/50 rounded-xl p-6 space-y-4">
                  <h3 className="text-xl font-medium text-foreground">Commencer avec Amethyst</h3>
                  <p>
                    Amethyst est conçu pour être intuitif et puissant. Voici comment commencer :
                  </p>
                  <ol className="list-decimal list-inside space-y-3 pl-4">
                    <li>Connectez-vous avec votre compte Google pour accéder à toutes les fonctionnalités</li>
                    <li>Dans le champ de texte principal, décrivez l'image que vous souhaitez générer</li>
                    <li>Utilisez le bouton des paramètres avancés pour affiner votre génération</li>
                    <li>Cliquez sur "Générer" et laissez l'IA créer votre vision</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Paramètres avancés */}
            <section className="space-y-6 animate-in fade-in-50 duration-1000 w-full">
              <h2 className="text-3xl font-semibold text-primary text-center">Paramètres avancés</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card/50 rounded-xl p-6 space-y-4">
                  <h3 className="text-xl font-medium text-foreground">LoRA (Low-Rank Adaptation)</h3>
                  <p className="text-muted-foreground">
                    Les LoRA sont des modules d'adaptation qui permettent de personnaliser le style
                    et le contenu de vos générations. Chaque LoRA peut être combiné et ajusté :
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                    <li>Style artistique (anime, photoréaliste, peinture...)</li>
                    <li>Contenu spécifique (personnages, objets, environnements)</li>
                    <li>Ajustement par échelle (0.1 à 1.0) pour contrôler l'influence</li>
                  </ul>
                </div>

                <div className="bg-card/50 rounded-xl p-6 space-y-4">
                  <h3 className="text-xl font-medium text-foreground">Pipeline de génération</h3>
                  <p className="text-muted-foreground">
                    Notre pipeline utilise les dernières avancées en matière de diffusion stable :
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                    <li>Modèle de base SDXL 1.0</li>
                    <li>Support des LoRA pour la personnalisation</li>
                    <li>Optimisations pour la qualité et la vitesse</li>
                    <li>Pipeline de post-traitement avancé</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Conseils avancés */}
            <section className="space-y-6 animate-in fade-in-50 duration-1000 w-full">
              <h2 className="text-3xl font-semibold text-primary text-center">Conseils avancés</h2>
              <div className="bg-card/50 rounded-xl p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-foreground">Prompts efficaces</h3>
                  <p className="text-muted-foreground">
                    Pour obtenir les meilleurs résultats, suivez ces conseils pour vos prompts :
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                    <li>Soyez précis dans vos descriptions (composition, éclairage, style)</li>
                    <li>Utilisez des termes artistiques spécifiques</li>
                    <li>Équilibrez les détails positifs et négatifs</li>
                    <li>Expérimentez avec différentes combinaisons de LoRA</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-foreground">Optimisation des paramètres</h3>
                  <p className="text-muted-foreground">
                    Ajustez ces paramètres pour affiner vos résultats :
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                    <li>Steps : 30-50 pour un bon équilibre qualité/vitesse</li>
                    <li>CFG Scale : 7-8 pour un équilibre fidélité/créativité</li>
                    <li>Seed : Fixez-la pour reproduire des résultats</li>
                    <li>Taille : Adaptez selon vos besoins (optimisé pour 1024x1024)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Crédits */}
            <section className="space-y-6 animate-in fade-in-50 duration-1000 w-full">
              <h2 className="text-3xl font-semibold text-primary text-center">Crédits</h2>
              <div className="bg-card/50 rounded-xl p-6 space-y-4">
                <p className="text-muted-foreground text-center">
                  Développé avec passion par Joachim Cohen. Propulsé par les technologies suivantes :
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