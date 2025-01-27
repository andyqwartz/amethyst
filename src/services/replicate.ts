import type { ReplicateInput } from '@/types/replicate';
import { supabase } from '@/integrations/supabase/client';

export async function generateImage(params: { input?: ReplicateInput; predictionId?: string }): Promise<any> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: params,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}