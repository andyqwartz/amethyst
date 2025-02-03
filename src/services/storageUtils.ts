import { supabase } from '@/lib/supabase/client';

export async function uploadToStorage(file: File, bucket: string): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  if (!data?.path) {
    throw new Error('Failed to get upload path');
  }

  const { data: urlData } = await supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  if (!urlData?.publicUrl) {
    throw new Error('Failed to get public URL');
  }

  return urlData.publicUrl;
}