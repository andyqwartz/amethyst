import React from 'react';

export const Credits = () => {
  return (
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
  );
};