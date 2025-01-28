import type { ReplicateInput } from '@/types/replicate';
import { supabase } from '@/integrations/supabase/client';

export async function generateImage(params: { input?: ReplicateInput; predictionId?: string }): Promise<any> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: params,
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message || 'Failed to generate image');
    }

    if (!data) {
      throw new Error('No data received from generation endpoint');
    }

    // Vérification supplémentaire pour les erreurs de l'API
    if (data.error) {
      console.error('API error:', data.error);
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}