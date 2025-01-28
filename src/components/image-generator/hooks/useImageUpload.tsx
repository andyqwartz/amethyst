import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

export const useImageUpload = (setReferenceImage: (image: string | null) => void) => {
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;

        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Erreur d'authentification",
            description: "Vous devez être connecté pour uploader une image",
            variant: "destructive"
          });
          return;
        }

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('reference-images')
          .upload(filePath, file, {
            upsert: false
          });

        if (error) {
          console.error('Error uploading file:', error);
          toast({
            title: "Erreur d'upload",
            description: "Une erreur est survenue lors de l'upload de l'image",
            variant: "destructive"
          });
          return;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('reference-images')
          .getPublicUrl(filePath);

        setReferenceImage(publicUrl);
        
        toast({
          title: "Upload réussi",
          description: "L'image a été uploadée avec succès",
        });
      } catch (error) {
        console.error('Error in handleImageUpload:', error);
        toast({
          title: "Erreur",
          description: "Une erreur inattendue est survenue",
          variant: "destructive"
        });
      }
    }
  };

  const handleImageClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      if (e.target instanceof HTMLInputElement) {
        handleImageUpload({ target: e.target } as React.ChangeEvent<HTMLInputElement>);
      }
    };
    fileInput.click();
  };

  return {
    handleImageUpload,
    handleImageClick
  };
};