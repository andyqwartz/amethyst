import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useImageUpload = (setReferenceImage: (image: string | null) => void) => {
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('reference-images')
          .upload(filePath, file);

        if (error) {
          console.error('Error uploading file:', error);
          return;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('reference-images')
          .getPublicUrl(filePath);

        setReferenceImage(publicUrl);
      } catch (error) {
        console.error('Error in handleImageUpload:', error);
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