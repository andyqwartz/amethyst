import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Mail, Github } from 'lucide-react';

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpModal = ({ open, onOpenChange }: HelpModalProps) => {
  const [emailParts, domain] = ['amethyst', 'serendippo.me'];
  const constructEmail = () => `${emailParts}@${domain}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-screen w-screen max-w-none m-0 p-6 backdrop-blur-xl bg-black/30">
        <div className="max-w-4xl mx-auto h-[calc(100vh-3rem)] flex flex-col">
          <DialogHeader className="flex-shrink-0 mb-6">
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Aide & Crédits
            </DialogTitle>
            <DialogDescription className="text-lg">
              Guide d'utilisation et informations sur l'application
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 min-h-0 pr-6 glass-card rounded-lg">
            <div className="p-6 space-y-8">
              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">Guide d'utilisation</h3>
                <ul className="list-disc pl-5 space-y-3 text-muted-foreground">
                  <li>Décrivez l'image souhaitée de manière détaillée et précise</li>
                  <li>Ajoutez une image de référence pour guider la génération (optionnel)</li>
                  <li>Personnalisez les paramètres avancés selon vos besoins</li>
                  <li>Cliquez sur Générer et patientez quelques secondes</li>
                  <li>Téléchargez ou modifiez les images générées</li>
                </ul>
              </section>
              
              <Separator className="bg-primary/20" />
              
              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">Paramètres avancés</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li><strong>Ratio d'aspect :</strong> Format de l'image (1:1 carré, 16:9 paysage, etc.)</li>
                  <li><strong>Nombre d'images :</strong> Générez jusqu'à 4 variations simultanément</li>
                  <li><strong>Format de sortie :</strong> Choisissez entre WebP (recommandé), JPG ou PNG</li>
                  <li><strong>Échelle de guidage :</strong> Contrôlez l'influence du prompt (7.5 par défaut)</li>
                  <li><strong>Seed :</strong> Utilisez la même seed pour reproduire des résultats similaires</li>
                </ul>
              </section>
              
              <Separator className="bg-primary/20" />
              
              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">Astuces</h3>
                <ul className="list-disc pl-5 space-y-3 text-muted-foreground">
                  <li>Utilisez des descriptions détaillées pour de meilleurs résultats</li>
                  <li>Expérimentez avec différents styles artistiques</li>
                  <li>Sauvegardez vos images préférées dans l'historique</li>
                  <li>Ajustez l'échelle de guidage selon vos besoins créatifs</li>
                </ul>
              </section>

              <Separator className="bg-primary/20" />
              
              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">Contact & Support</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Pour toute question ou suggestion, n'hésitez pas à me contacter :
                  </p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>{constructEmail()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4 text-primary" />
                    <a 
                      href="https://github.com/andyqwartz" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </section>

              <Separator className="bg-primary/20" />
              
              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">Crédits</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    Développé avec ❤️ par l'équipe Serendippo.
                  </p>
                  <p>
                    Propulsé par Stable Diffusion et l'API Replicate.
                  </p>
                  <p className="text-sm mt-4">
                    © 2024 Serendippo. Tous droits réservés.
                  </p>
                </div>
              </section>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};