import { supabase, checkSession, logSupabaseError } from '@/integrations/supabase/client';
import { StorageError } from '@supabase/supabase-js';

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

/**
 * Generates a unique filename for uploaded reference images
 * Format: reference-{timestamp}-{randomString}.{extension}
 * @param originalName Original file name (used for debugging)
 * @param fileType MIME type of the file
 * @returns Unique filename with appropriate extension
 */
export const generateUniqueFileName = (originalName: string, fileType: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 11);
  const extension = fileType.split('/')[1] || 'webp';
  return `reference-${timestamp}-${randomString}.${extension}`;
};

/**
 * Uploads a reference image to Supabase storage
 * @param file File or Blob to upload
 * @param contentType Optional content type override
 * @returns Object containing public URL and storage path
 * @throws Error if file size exceeds limit or type is not allowed
 */
export const uploadReferenceImage = async (
  file: File | Blob,
  contentType?: string
): Promise<UploadResult> => {
  let retries = 0;
  
  const attemptUpload = async (): Promise<UploadResult> => {
    try {
      // Verify authentication
      await checkSession();

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        const error = new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
        logSupabaseError(error as StorageError, 'uploadReferenceImage-size', 'storage');
        throw error;
      }

      // Validate file type
      const fileType = contentType || file.type;
      if (!ALLOWED_MIME_TYPES.includes(fileType)) {
        const error = new Error(`File type ${fileType} not allowed`);
        logSupabaseError(error as StorageError, 'uploadReferenceImage-type', 'storage');
        throw error;
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
        logSupabaseError(uploadError, 'uploadReferenceImage-upload', 'storage');
        
        // Retry logic for specific error types that might be temporary
        if (retries < MAX_RETRIES && 
            (uploadError.statusCode === 503 || uploadError.statusCode === 429)) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retries));
          return attemptUpload();
        }
        
        throw uploadError;
      }

      if (!uploadData?.path) {
        const error = new Error('Upload successful but no path returned');
        logSupabaseError(error as StorageError, 'uploadReferenceImage-path', 'storage');
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('reference-images')
        .getPublicUrl(uploadData.path);

      if (!publicUrl) {
        const error = new Error('Failed to get public URL for uploaded image');
        logSupabaseError(error as StorageError, 'uploadReferenceImage-url', 'storage');
        throw error;
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

/**
 * Deletes a reference image from Supabase storage
 * @param imageUrl Public URL of the image to delete
 * @throws Error if URL is invalid or deletion fails
 */
export const deleteReferenceImage = async (imageUrl: string): Promise<void> => {
  try {
    // Verify authentication
    await checkSession();

    // Extract filename from URL path
    const url = new URL(imageUrl);
    const path = url.pathname.split('/').pop();

    if (!path) {
      const error = new Error('Invalid image URL: unable to extract path');
      logSupabaseError(error as StorageError, 'deleteReferenceImage-path', 'storage');
      throw error;
    }

    const { error: removeError } = await supabase.storage
      .from('reference-images')
      .remove([path]);

    if (removeError) {
      logSupabaseError(removeError, 'deleteReferenceImage-remove', 'storage');
      throw removeError;
    }
  } catch (error) {
    if (error instanceof Error) {
      logSupabaseError(error as StorageError, 'deleteReferenceImage', 'storage');
      throw new Error(`Failed to delete reference image: ${error.message}`);
    }
    const genericError = new Error('Failed to delete reference image');
    logSupabaseError(genericError as StorageError, 'deleteReferenceImage', 'storage');
    throw genericError;
  }
};

export const fetchAndProcessReferenceImage = async (
  imageUrl: string
): Promise<{ file: File; contentType: string | null }> => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      const error = new Error(`Failed to fetch image: ${response.statusText}`);
      logSupabaseError(error as StorageError, 'fetchAndProcessReferenceImage-fetch', 'storage');
      throw error;
    }

    const contentType = response.headers.get('content-type');
    
    // Validate content type
    if (contentType && !ALLOWED_MIME_TYPES.includes(contentType)) {
      const error = new Error(`Invalid content type: ${contentType}`);
      logSupabaseError(error as StorageError, 'fetchAndProcessReferenceImage-type', 'storage');
      throw error;
    }

    const blob = await response.blob();
    
    // Validate blob size
    if (blob.size > MAX_FILE_SIZE) {
      const error = new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
      logSupabaseError(error as StorageError, 'fetchAndProcessReferenceImage-size', 'storage');
      throw error;
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
