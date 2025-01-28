import type { ReplicateInput } from '@/types/replicate';
import { supabase } from '@/integrations/supabase/client';

export async function generateImage(params: { input?: ReplicateInput; predictionId?: string }): Promise<any> {
  try {
    console.log('Generating image with params:', {
      ...params,
      input: params.input ? {
        ...params.input,
        image: params.input.image ? 'Present' : 'Not present',
        hf_loras: params.input?.hf_loras
      } : undefined
    });

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

    console.log('Generation API response:', data);

    if (data.error) {
      console.error('API error:', data.error);
      throw new Error(data.error);
    }

    if (params.predictionId) {
      return {
        status: data.status,
        output: data.output,
        error: data.error
      };
    }

    return {
      status: 'started',
      predictionId: data.id
    };
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}