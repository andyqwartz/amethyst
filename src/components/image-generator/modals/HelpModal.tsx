import React, { useCallback } from 'react';
import AmethystLogo from '@/components/ui/icons/AmethystLogo';
import { Button } from "@/components/ui/button";
import { Sparkles, Mail, Github, Image, Wand2, Download, Settings2 } from 'lucide-react';
import ModalComponent from '@/components/ModalComponent';

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpModal = ({
  open,
  onOpenChange
}: HelpModalProps) => {
  const features = [
    {
      icon: <Image className="w-5 h-5" />,
      title: "Génération d'images",
      description: "Créez des images uniques à partir de vos descriptions textuelles grâce à l'IA."
    },
    {
      icon: <Wand2 className="w-5 h-5" />,
      title: "Personnalisation avancée",
      description: "Ajustez les paramètres de génération pour obtenir exactement le résultat souhaité."
    },
    {
      icon: <Download className="w-5 h-5" />,
      title: "Exportation flexible",
      description: "Téléchargez vos créations dans différents formats et résolutions."
    },
    {
      icon: <Settings2 className="w-5 h-5" />,
      title: "Paramètres de génération",
      description: "Contrôlez finement le processus de génération avec des options avancées."
    }
  ];

  // Email protection with base64 encoding
  const encodedEmail = "Y29udGFjdEBhbWV0aHlzdC5haQ=="; // Base64 encoded email
  const decodeEmail = useCallback(() => {
    return atob(encodedEmail);
  }, [encodedEmail]);

  const handleEmailClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = `mailto:${decodeEmail()}`;
  }, [decodeEmail]);

  return (
    <ModalComponent
      open={open}
      onClose={onOpenChange}
      maxWidth="100vw"
      maxHeight="100vh"
      fullScreen
      title="Amethyst"
    >
      <div className="bg-background/98 backdrop-blur-2xl">
          <div className="max-w-4xl mx-auto space-y-12 pt-8">
            {/* En-tête avec logo et titre */}
            <div className="text-center space-y-8">
              <div className="relative w-40 h-40 mx-auto">
                <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-20 blur-3xl animate-[pulse_20s_ease-in-out_infinite]"></div>
                <div className="absolute inset-[-2rem] bg-primary/5 blur-[60px] rounded-full animate-[pulse_18s_ease-in-out_infinite]"></div>
                <div className="relative flex items-center justify-center h-full">
                  <Sparkles 
                    className="w-32 h-32 text-primary/60 animate-[pulse_15s_ease-in-out_infinite] transition-all duration-1000 hover:scale-105" 
                    style={{
                      filter: 'drop-shadow(0 0 40px rgba(147,112,219,0.15))',
                      transformOrigin: 'center',
                    }}
                  />
                </div>
              </div>
              <div className="space-y-6 animate-fade-in duration-1000 delay-300">
                <h1 className="text-6xl font-bold font-outfit title-gradient tracking-tight group-hover:tracking-normal transition-all duration-500">
                  Amethyst
                </h1>
                <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto">
                  Une interface moderne pour la génération d'images par intelligence artificielle
                </p>
              </div>
            </div>

            {/* Crédits et liens */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 py-12">
              <Button
                variant="ghost"
                size="lg"
                className="text-muted-foreground hover:text-primary transition-colors group relative overflow-hidden"
                onClick={() => window.open('https://github.com/andyqwartz/amethyst.git', '_blank')}
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                <Github className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                GitHub
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-muted-foreground hover:text-primary transition-colors group relative overflow-hidden"
                onClick={handleEmailClick}
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                <Mail className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Contact
              </Button>
            </div>

            {/* Fonctionnalités principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all duration-300 group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 text-primary group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Crédits */}
            <div className="space-y-6 bg-primary/5 p-8 rounded-2xl">
              <h3 className="text-xl font-semibold text-primary">Crédits</h3>
              <div className="space-y-2 text-muted-foreground">
                <p className="flex items-center gap-1">
                  Développé avec <AmethystLogo className="w-4 h-4 inline-block" /> par l'équipe Serendippo.
                </p>
                <p>Propulsé par Stable Diffusion et l'API Replicate.</p>
                <p className="text-sm mt-4">© 2024 Serendippo. Tous droits réservés.</p>
              </div>
            </div>

            {/* Guide d'utilisation */}
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary/80 to-secondary/80 bg-clip-text text-transparent">
                Guide rapide
              </h2>
              <div className="grid gap-4 sm:gap-6 text-muted-foreground">
                <div className="p-4 rounded-lg bg-primary/5">
                  <h3 className="font-medium mb-2">1. Description de l'image</h3>
                  <p>Entrez une description détaillée de l'image que vous souhaitez générer. Plus votre description est précise, meilleurs seront les résultats.</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/5">
                  <h3 className="font-medium mb-2">2. Paramètres avancés</h3>
                  <p>Ajustez les paramètres de génération selon vos besoins : ratio d'aspect, nombre d'images, format de sortie, etc.</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/5">
                  <h3 className="font-medium mb-2">3. Génération</h3>
                  <p>Lancez la génération et laissez l'IA créer votre image. Le processus prend généralement quelques secondes.</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/5">
                  <h3 className="font-medium mb-2">4. Résultats</h3>
                  <p>Téléchargez vos images, modifiez-les ou générez de nouvelles variations à partir des résultats obtenus.</p>
                </div>
              </div>
            </div>
          </div>
      </div>
    </ModalComponent>
  );
};
