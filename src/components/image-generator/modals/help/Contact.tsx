import React from 'react';
import { Mail, Github, MessageCircle, Bug, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Contact = () => {
  const [emailParts, domain] = ['amethyst', 'serendippo.me'];
  const constructEmail = () => `${emailParts}@${domain}`;

  return (
    <section>
      <h3 className="text-xl font-semibold mb-4 text-primary">Contact & Support</h3>
      <div className="space-y-6 text-muted-foreground">
        <div>
          <h4 className="font-medium mb-2">Nous contacter</h4>
          <p className="mb-3">
            Pour toute question, suggestion ou signalement de bug, n'hésitez pas à nous contacter :
          </p>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => window.location.href = `mailto:${constructEmail()}`}
            >
              <Mail className="h-4 w-4" />
              <span>{constructEmail()}</span>
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => window.open('https://github.com/andyqwartz', '_blank')}
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </Button>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Types de demandes</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-destructive" />
              <span>Signalement de bugs</span>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span>Questions et support</span>
            </li>
            <li className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              <span>Suggestions d'amélioration</span>
            </li>
          </ul>
        </div>

        <div className="text-sm">
          <p>
            Temps de réponse moyen : 24-48h
          </p>
          <p className="mt-1">
            Pour les demandes urgentes, merci de le préciser dans l'objet de votre message.
          </p>
        </div>
      </div>
    </section>
  );
};