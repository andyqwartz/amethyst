import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Settings, Key, Image, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AccountPage = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: <User className="w-5 h-5" />,
      title: "Informations personnelles",
      description: "Gérez vos informations de profil",
      placeholder: true
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Préférences de génération",
      description: "Personnalisez vos paramètres par défaut",
      placeholder: true
    },
    {
      icon: <Key className="w-5 h-5" />,
      title: "API Keys",
      description: "Gérez vos clés d'API pour la génération",
      placeholder: true
    },
    {
      icon: <Image className="w-5 h-5" />,
      title: "Galerie",
      description: "Accédez à vos images générées",
      placeholder: true
    },
    {
      icon: <History className="w-5 h-5" />,
      title: "Historique",
      description: "Consultez votre historique de génération",
      placeholder: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background/50 to-background p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-8 hover:bg-primary/10 -ml-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <div className="space-y-8">
          {/* En-tête */}
          <div className="glass-card p-8 text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Profil Utilisateur</h1>
              <p className="text-muted-foreground mt-2">
                Gérez vos informations et préférences
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, index) => (
              <Card 
                key={index}
                className="glass-card border-none p-6 hover:bg-[#1A1F2C]/60 transition-all duration-300 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="mt-1 text-primary group-hover:scale-110 transition-transform">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                    <p className="text-muted-foreground text-sm mb-4">
                      {section.description}
                    </p>
                    {section.placeholder && (
                      <div className="space-y-3">
                        <div className="h-8 bg-primary/5 rounded-lg animate-pulse" />
                        <div className="h-8 bg-primary/5 rounded-lg animate-pulse w-3/4" />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 
