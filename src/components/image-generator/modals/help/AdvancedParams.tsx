import React from 'react';

export const AdvancedParams = () => {
  return (
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
  );
};