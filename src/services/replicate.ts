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

    // Log the response for debugging
    console.log('Generation API response:', data);

    // Vérification supplémentaire pour les erreurs de l'API
    if (data.error) {
      console.error('API error:', data.error);
      throw new Error(data.error);
    }

    // Si c'est un status check, on retourne directement la réponse
    if (params.predictionId) {
      return {
        status: data.status,
        output: data.output,
        error: data.error
      };
    }

    // Si c'est une nouvelle génération, on retourne l'ID de prédiction
    return {
      status: 'started',
      predictionId: data.id
    };
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}