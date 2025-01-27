import { ReplicateInput } from '@/types/replicate';
import { createClient } from '@supabase/supabase-js';

const MODEL_VERSION = "lucataco/flux-dev-multi-lora:2389224e115448d9a77c07d7d45672b3f0aa45acacf1c5bcf51857ac295e3aec";

export async function generateImage(input: ReplicateInput): Promise<string[]> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate image');
    }

    const images = await response.json();
    return images;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}