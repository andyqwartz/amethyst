import { useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import type { GenerationParameters, GeneratedImage, ReferenceImage } from '@/types/generation';

interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
}

interface StoredImage {
  id: string;
  hash: string;
  public_url: string;
  storage_path: string;
  width: number;
  height: number;
  format: string;
  file_size_bytes: number;
  metadata: Record<string, any>;
}

export const useImageStorage = () => {
  const computeImageHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const getImageMetadata = async (file: File): Promise<ImageMetadata> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve({
          width: img.width,
          height: img.height,
          format: file.type.split('/')[1],
          size: file.size
        });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const storeImage = async (file: File, type: 'reference' | 'generated' = 'generated'): Promise<StoredImage> => {
    try {
      const hash = await computeImageHash(file);
      
      // Vérifier si l'image existe déjà
      const { data: existingImage } = await supabase
        .from('images')
        .select('id, hash, public_url, storage_path, width, height, format, file_size_bytes, metadata')
        .eq('hash', hash)
        .single();

      if (existingImage) {
        return existingImage;
      }

      // Obtenir les métadonnées de l'image
      const metadata = await getImageMetadata(file);
      
      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const storagePath = `${type}/${fileName}`;

      // Upload de l'image
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(storagePath);

      // Créer l'entrée dans la table images
      const { data: imageData, error: imageError } = await supabase
        .from('images')
        .insert({
          hash,
          storage_path: storagePath,
          public_url: publicUrl,
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          file_size_bytes: metadata.size,
          metadata: {
            original_name: file.name,
            mime_type: file.type
          }
        })
        .select()
        .single();

      if (imageError) throw imageError;

      return imageData;
    } catch (error) {
      console.error('Erreur lors du stockage de l\'image:', error);
      throw error;
    }
  };

  const storeGeneratedImage = useCallback(async (
    imageUrl: string,
    generationParams: GenerationParameters,
    userId: string
  ): Promise<GeneratedImage> => {
    try {
      // Télécharger l'image depuis l'URL
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'generated.png', { type: 'image/png' });

      // Stocker l'image
      const imageData = await storeImage(file, 'generated');

      // Créer l'entrée dans generated_images
      const { data: generatedImage, error } = await supabase
        .from('generated_images')
        .insert({
          user_id: userId,
          image_id: imageData.id,
          prompt: generationParams.prompt,
          negative_prompt: generationParams.negative_prompt,
          width: generationParams.width,
          height: generationParams.height,
          num_inference_steps: generationParams.num_inference_steps,
          guidance_scale: generationParams.guidance_scale,
          seed: generationParams.seed,
          scheduler: generationParams.scheduler,
          strength: generationParams.strength,
          num_outputs: generationParams.num_outputs,
          aspect_ratio: generationParams.aspect_ratio,
          output_format: generationParams.output_format,
          output_quality: generationParams.output_quality,
          prompt_strength: generationParams.prompt_strength,
          hf_loras: generationParams.hf_loras,
          lora_scales: generationParams.lora_scales,
          disable_safety_checker: generationParams.disable_safety_checker,
          reference_image_id: generationParams.reference_image_id,
          reference_image_strength: generationParams.reference_image_strength,
          raw_parameters: generationParams,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return generatedImage;
    } catch (error) {
      console.error('Erreur lors du stockage de l\'image générée:', error);
      throw error;
    }
  }, []);

  const storeReferenceImage = useCallback(async (
    file: File,
    userId: string,
    purpose: string = 'reference'
  ): Promise<ReferenceImage> => {
    try {
      const imageData = await storeImage(file, 'reference');

      const { data: referenceImage, error } = await supabase
        .from('reference_images')
        .insert({
          user_id: userId,
          image_id: imageData.id,
          original_filename: file.name,
          purpose
        })
        .select()
        .single();

      if (error) throw error;

      return referenceImage;
    } catch (error) {
      console.error('Erreur lors du stockage de l\'image de référence:', error);
      throw error;
    }
  }, []);

  return {
    storeImage,
    storeGeneratedImage,
    storeReferenceImage
  };
}; 
