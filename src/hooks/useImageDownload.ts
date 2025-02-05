import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useImageDownload = () => {
  const { toast } = useToast();

  const downloadImage = useCallback(async (url: string, format: string = 'webp') => {
    let objectUrl: string | null = null;
    
    try {
      if (!url) {
        throw new Error('URL is required');
      }

      const validFormats = ['webp', 'png', 'jpg', 'jpeg'];
      const safeFormat = format.toLowerCase();
      if (!validFormats.includes(safeFormat)) {
        throw new Error('Invalid image format');
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) {
        throw new Error('Invalid image content');
      }

      objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      
      // Generate a unique filename with date and sanitize it
      const date = new Date().toISOString().split('T')[0];
      const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
      const fileName = `amethyst_${date}_${time}.${safeFormat}`
        .replace(/[/\\?%*:|"<>]/g, '-'); // Remove invalid filename characters
      
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);

      toast({
        title: "Image téléchargée",
        description: `L'image a été téléchargée sous le nom "${fileName}"`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de télécharger l'image",
        variant: "destructive"
      });
    } finally {
      // Clean up the object URL if it was created
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    }
  }, [toast]);

  return { downloadImage };
}; 
