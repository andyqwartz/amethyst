import { useToast } from "@/components/ui/use-toast";

export const useImageGeneratorLogic = () => {
  const { toast } = useToast();

  const handleDownload = async (imageUrl: string, outputFormat: string) => {
    try {
      // Créer un élément temporaire pour le téléchargement
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.download = `generated-image-${Date.now()}.${outputFormat}`;
      
      // Ajouter le lien au document, déclencher le téléchargement, puis nettoyer
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      // Afficher une notification de succès
      toast({
        title: "Téléchargement réussi",
        description: "L'image a été téléchargée avec succès",
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive"
      });
    }
  };

  // ... rest of the hook
}; 
