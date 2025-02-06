import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useImageUpload = (setReferenceImage: (image: string | null) => void) => {
  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('reference-images')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading file:', error);
        return;
      }

      if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from('reference-images')
          .getPublicUrl(data.path);
        
        setReferenceImage(publicUrl);
      }
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
    }
  }, [setReferenceImage]);

  const handleImageClick = useCallback(() => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }, []);

  return {
    handleImageUpload,
    handleImageClick
  };
};