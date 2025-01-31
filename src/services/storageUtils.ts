import { supabase, checkSession } from '@/integrations/supabase/client';
import { StorageError } from '@supabase/storage-js';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Maximum file size in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed MIME types for reference images
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
];

interface UploadResult {
  publicUrl: string;
  path: string;
}

export const generateUniqueFileName = (originalName: string, fileType: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 11);
  const extension = fileType.split('/')[1] || 'webp';
  return `reference-${timestamp}-${randomString}.${extension}`;
};

export const uploadReferenceImage = async (
  file: File | Blob,
  contentType?: string
): Promise<UploadResult> => {
  let retries = 0;
  
  const attemptUpload = async (): Promise<UploadResult> => {
    try {
      await checkSession();

      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
      }

      const fileType = contentType || file.type;
      if (!ALLOWED_MIME_TYPES.includes(fileType)) {
        throw new Error(`File type ${fileType} not allowed`);
      }

      const fileName = generateUniqueFileName(
        file instanceof File ? file.name : 'reference',
        fileType
      );

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('reference-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: contentType || file.type
        });

      if (uploadError) {
        if (retries < MAX_RETRIES && 
            (uploadError.statusCode === 503 || uploadError.statusCode === 429)) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retries));
          return attemptUpload();
        }
        throw uploadError;
      }

      if (!uploadData?.path) {
        throw new Error('Upload successful but no path returned');
      }

      const { data: { publicUrl } } = supabase.storage
        .from('reference-images')
        .getPublicUrl(uploadData.path);

      if (!publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }

      return {
        publicUrl,
        path: uploadData.path
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to upload reference image: ${error.message}`);
      }
      throw new Error('Failed to upload reference image');
    }
  };

  return attemptUpload();
};

export const deleteReferenceImage = async (imageUrl: string): Promise<void> => {
  try {
    await checkSession();

    const url = new URL(imageUrl);
    const path = url.pathname.split('/').pop();

    if (!path) {
      throw new Error('Invalid image URL: unable to extract path');
    }

    const { error: removeError } = await supabase.storage
      .from('reference-images')
      .remove([path]);

    if (removeError) {
      throw removeError;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete reference image: ${error.message}`);
    }
    throw new Error('Failed to delete reference image');
  }
};

export const fetchAndProcessReferenceImage = async (
  imageUrl: string
): Promise<{ file: File; contentType: string | null }> => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    
    if (contentType && !ALLOWED_MIME_TYPES.includes(contentType)) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    const blob = await response.blob();
    
    if (blob.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
    }

    const fileName = `reference-${Date.now()}.${contentType?.split('/')[1] || 'webp'}`;
    const file = new File([blob], fileName, { type: contentType || blob.type });

    return {
      file,
      contentType
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to process reference image: ${error.message}`);
    }
    throw new Error('Failed to process reference image');
  }
};