import { supabase } from '@/integrations/supabase/client';
import type { StorageError } from '@supabase/storage-js';

export const handleStorageError = (error: StorageError) => {
  if ('error' in error) {
    return `Storage error: ${error.message}`;
  }
  return 'An unknown storage error occurred';
};

export const uploadFile = async (file: File) => {
  const { data, error } = await supabase.storage.from('uploads').upload(`public/${file.name}`, file);
  if (error) {
    throw handleStorageError(error);
  }
  return data;
};

export const deleteFile = async (path: string) => {
  const { error } = await supabase.storage.from('uploads').remove([path]);
  if (error) {
    throw handleStorageError(error);
  }
};

export const getFileUrl = (path: string) => {
  return supabase.storage.from('uploads').getPublicUrl(path).publicURL;
};
