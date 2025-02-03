import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import useModalStore, { ModalId } from '@/state/modalStore';
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Sparkles, Github, Mail, Heart, Wand2, Image, Settings2, Download, Share2, History, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const HelpModal = () => {
  const { getModalState, closeModal } = useModalStore();
  const isOpen = getModalState(ModalId.HELP);

  const handleOpenChange = (open: boolean) => {
    if (!open) closeModal(ModalId.HELP);
  };

  const [emailParts, domain] = ['contact', 'serendippo.me'];
  const constructEmail = () => `${emailParts}@${domain}`;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="w-screen h-screen max-w-none m-0 p-0 bg-black/30 backdrop-blur-xl"
      >
        <DialogTitle className="sr-only">Aide et Crédits Amethyst</DialogTitle>
        <DialogDescription className="sr-only">Guide d'utilisation et informations sur Amethyst</DialogDescription>
        
        <div className="max-w-4xl mx-auto h-full flex flex-col bg-background rounded-xl relative overflow-hidden">
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 z-50 rounded-full opacity-70 hover:opacity-100 hover:bg-primary/20 transition-all duration-200"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </Button>
          </DialogClose>

          <ScrollArea className="flex-grow h-full">
            <div className="p-6">
              <motion.div 
                className="space-y-16"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {/* Logo et Titre */}
                <motion.div variants={item} className="flex flex-col items-center text-center space-y-8 pt-12">
                  <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse rounded-full group-hover:scale-125 transition-transform duration-700"></div>
                    <Sparkles className="h-24 w-24 text-primary relative animate-pulse group-hover:animate-[pulse_2s_ease-in-out_infinite]" />
                  </div>
                  <div className="space-y-4">
                    <h1 className="text-5xl sm:text-6xl font-bold font-outfit title-gradient tracking-tight group-hover:tracking-normal transition-all duration-500">
                      Amethyst
                    </h1>
                    <p className="text-xl text-muted-foreground">
                      Générateur d'images alimenté par l'IA
                    </p>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="outline"
                      className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={() => window.open('https://github.com/serendippo/amethyst', '_blank')}
                    >
                      <Github className="h-5 w-5 mr-2" />
                      GitHub
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={() => window.location.href = `mailto:${constructEmail()}`}
                    >
                      <Mail className="h-5 w-5 mr-2" />
                      Contact
                    </Button>
                  </div>
                </motion.div>

                {/* Crédits */}
                <motion.section variants={item} className="space-y-8">
                  <h2 className="text-3xl font-semibold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    À propos
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary">
                        <Heart className="h-5 w-5" />
                        <h3 className="font-medium">Équipe</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Développé avec passion par l'équipe Serendippo, Amethyst est né de notre volonté de rendre la génération d'images par IA accessible à tous.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary">
                        <Star className="h-5 w-5" />
                        <h3 className="font-medium">Technologies</h3>
                      </div>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <Wand2 className="h-4 w-4 text-primary" />
                          <span>Stable Diffusion XL - Génération d'images</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Settings2 className="h-4 w-4 text-primary" />
                          <span>React & TypeScript - Interface utilisateur</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Image className="h-4 w-4 text-primary" />
                          <span>Replicate - API d'inférence</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.section>

                {/* Guide d'utilisation */}
                <motion.section variants={item} className="space-y-8">
                  <h2 className="text-3xl font-semibold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Guide d'utilisation
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                          <Wand2 className="h-5 w-5" />
                          <h3 className="font-medium">Génération d'images</h3>
                        </div>
                        <ul className="space-y-3 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">1.</span>
                            Décrivez précisément l'image souhaitée dans le champ de texte
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">2.</span>
                            Utilisez le prompt négatif pour exclure des éléments indésirables
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">3.</span>
                            Ajustez les paramètres avancés selon vos besoins créatifs
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                          <Settings2 className="h-5 w-5" />
                          <h3 className="font-medium">Paramètres avancés</h3>
                        </div>
                        <ul className="space-y-3 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">•</span>
                            Guidance Scale : Contrôle l'influence du prompt (7-8.5 recommandé)
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">•</span>
                            Steps : Nombre d'étapes de génération (20-30 optimal)
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">•</span>
                            Seed : Reproduisez exactement la même image
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                          <Image className="h-5 w-5" />
                          <h3 className="font-medium">Images de référence</h3>
                        </div>
                        <ul className="space-y-3 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">1.</span>
                            Glissez-déposez une image ou utilisez le sélecteur
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">2.</span>
                            Ajustez la force d'influence de l'image (0.5-0.8 recommandé)
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">3.</span>
                            Combinez avec un prompt descriptif pour de meilleurs résultats
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                          <Share2 className="h-5 w-5" />
                          <h3 className="font-medium">Gestion des images</h3>
                        </div>
                        <ul className="space-y-3 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <Download className="h-4 w-4 text-primary mt-1" />
                            Téléchargez vos créations en haute qualité
                          </li>
                          <li className="flex items-start gap-2">
                            <History className="h-4 w-4 text-primary mt-1" />
                            Retrouvez votre historique de génération
                          </li>
                          <li className="flex items-start gap-2">
                            <Wand2 className="h-4 w-4 text-primary mt-1" />
                            Modifiez et réutilisez les paramètres
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.section>

                {/* Astuces */}
                <motion.section variants={item} className="space-y-8">
                  <h2 className="text-3xl font-semibold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Astuces pour de meilleurs résultats
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-muted-foreground">
                    <div className="space-y-4">
                      <h3 className="font-medium text-primary">Prompts efficaces</h3>
                      <ul className="space-y-2">
                        <li>• Soyez précis dans vos descriptions</li>
                        <li>• Spécifiez le style artistique souhaité</li>
                        <li>• Utilisez des adjectifs descriptifs</li>
                        <li>• Mentionnez l'ambiance et l'éclairage</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-medium text-primary">Optimisation</h3>
                      <ul className="space-y-2">
                        <li>• Commencez avec les paramètres par défaut</li>
                        <li>• Ajustez progressivement les valeurs</li>
                        <li>• Sauvegardez vos meilleurs paramètres</li>
                        <li>• Expérimentez avec différents styles</li>
                      </ul>
                    </div>
                  </div>
                </motion.section>

                <motion.footer variants={item} className="text-center space-y-4 pt-8 border-t">
                  <p className="text-muted-foreground">
                    Amethyst est un projet open source sous licence MIT.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    © 2024 Serendippo. Tous droits réservés.
                  </p>
                </motion.footer>
              </motion.div>
            </div>
        </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
