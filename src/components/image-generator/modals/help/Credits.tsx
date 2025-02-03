import React from 'react';

export const Credits = () => {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-4 text-primary">Crédits</h3>
      <div className="space-y-4 text-muted-foreground">
        <div>
          <h4 className="font-medium mb-2">Équipe</h4>
          <p>
            Développé avec ❤️ par l'équipe Serendippo.
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-2">Technologies</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">Stable Diffusion XL</span> - Modèle de génération d'images
            </li>
            <li>
              <span className="font-medium">Replicate</span> - API d'inférence
            </li>
            <li>
              <span className="font-medium">React & TypeScript</span> - Framework frontend
            </li>
            <li>
              <span className="font-medium">Tailwind CSS</span> - Styles et composants UI
            </li>
            <li>
              <span className="font-medium">Supabase</span> - Base de données et authentification
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">Licences</h4>
          <p>
            Cette application est open source sous licence MIT.
            Les images générées sont soumises aux conditions d'utilisation de Stable Diffusion.
          </p>
        </div>

        <p className="text-sm mt-6 pt-4 border-t">
          © 2024 Serendippo. Tous droits réservés.
        </p>
      </div>
    </section>
  );
};