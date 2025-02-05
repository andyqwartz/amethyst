import type { ReplicateInput } from '@/types/replicate';
import { supabase } from '@/lib/supabase/client';

interface GenerationResponse {
  status: 'starting' | 'started' | 'succeeded' | 'failed' | 'canceled';
  id?: string;
  output?: string[];
  error?: string;
}

export async function generateImage(params: { input?: ReplicateInput; predictionId?: string }): Promise<{
  status: string;
  predictionId?: string;
  output?: string[];
  error?: string;
}> {
  try {
    console.log('Generating image with params:', {
      ...params,
      input: params.input ? {
        ...params.input,
        image: params.input.image ? 'Present' : 'Not present',
        hf_loras: params.input?.hf_loras
      } : undefined
    });

    const { data, error } = await supabase.functions.invoke<GenerationResponse>('generate-image', {
      body: params,
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`Supabase function error: ${error.message || 'Failed to generate image'}`);
    }

    if (!data) {
      throw new Error('No data received from generation endpoint');
    }

    console.log('Generation API response:', {
      status: data.status,
      hasOutput: !!data.output,
      error: data.error
    });

    if (data.error) {
      console.error('API error:', data.error);
      throw new Error(`Generation API error: ${data.error}`);
    }

    // Validate response structure
    if (!data.status) {
      throw new Error('Invalid API response: missing status');
    }

    if (data.status === 'failed') {
      throw new Error(data.error || 'Generation failed without specific error message');
    }

    if (params.predictionId) {
      return {
        status: data.status,
        output: Array.isArray(data.output) ? data.output : undefined,
        error: data.error
      };
    }

    if (!data.id) {
      throw new Error('Invalid API response: missing prediction ID');
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
