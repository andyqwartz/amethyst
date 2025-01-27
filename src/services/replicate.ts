import { ReplicateInput } from '@/types/replicate';
import { createClient } from '@supabase/supabase-js';

const MODEL_VERSION = "lucataco/flux-dev-multi-lora:2389224e115448d9a77c07d7d45672b3f0aa45acacf1c5bcf51857ac295e3aec";

export async function generateImage(input: ReplicateInput): Promise<string[]> {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  try {
    const { data: { api_key }, error } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'REPLICATE_API_KEY')
      .single();

    if (error) throw new Error('Failed to get API key');

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to generate image');
    }

    const prediction = await response.json();
    return prediction.output || [];
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}