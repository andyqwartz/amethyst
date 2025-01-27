import type { ReplicateInput } from '@/types/replicate';
import { supabase } from '@/integrations/supabase/client';

export async function generateImage(input: ReplicateInput): Promise<string[]> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { input },
    });

    if (error) {
      throw error;
    }

    if (!data.output) {
      throw new Error('No output received from the model');
    }

    return data.output;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}