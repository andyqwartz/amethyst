import type { ReplicateInput } from '@/types/replicate';

const MODEL_VERSION = "lucataco/flux-dev-multi-lora:2389224e115448d9a77c07d7d45672b3f0aa45acacf1c5bcf51857ac295e3aec";
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

export async function generateImage(input: ReplicateInput): Promise<string[]> {
  try {
    const response = await fetch(CORS_PROXY + 'https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate image. Please check your API token and try again.');
    }

    const prediction = await response.json();
    
    // Poll for the result
    let result = prediction;
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const pollResponse = await fetch(CORS_PROXY + `https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: {
          'Authorization': `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`,
          'Origin': window.location.origin
        },
      });
      result = await pollResponse.json();
    }

    if (result.status === 'failed') {
      throw new Error(result.error);
    }

    return result.output;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}