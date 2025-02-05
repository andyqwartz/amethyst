import React from 'react';

export const UsageGuide = () => {
  return (
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
  );
};