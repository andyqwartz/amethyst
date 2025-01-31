import { supabase } from '@/integrations/supabase/client';

export const uploadImage = async (file: File): Promise<string> => {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('reference-images')
    .upload(fileName, file);

  if (error) {
    throw error;
  }

  if (!data?.path) {
    throw new Error('Failed to get upload path');
  }

  return data.path;
};

export const getPublicUrl = async (path: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('reference-images')
    .getPublicUrl(path);

  if (error) {
    throw error;
  }

  return data.publicUrl;
};