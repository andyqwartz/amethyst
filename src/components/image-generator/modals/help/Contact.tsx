import React from 'react';
import { Mail, Github } from 'lucide-react';

export const Contact = () => {
  const [emailParts, domain] = ['amethyst', 'serendippo.me'];
  const constructEmail = () => `${emailParts}@${domain}`;

  return (
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
  );
};