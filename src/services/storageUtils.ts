import { StorageError } from '@supabase/storage-js';
import { supabase } from '@/integrations/supabase/client';

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) throw error;
    if (!data) throw new Error('Upload failed - no data returned');

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    if (error instanceof StorageError) {
      throw new Error(`Storage error: ${error.message}`);
    }
    throw error;
  }
}

export async function deleteFile(
  bucket: string,
  path: string
): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    if (error instanceof StorageError) {
      throw new Error(`Storage error: ${error.message}`);
    }
    throw error;
  }
}