import type { ReplicateInput } from '@/types/replicate';

const MODEL_VERSION = "lucataco/flux-dev-multi-lora:2389224e115448d9a77c07d7d45672b3f0aa45acacf1c5bcf51857ac295e3aec";
const API_BASE_URL = 'http://localhost:3001/api';

export async function generateImage(input: ReplicateInput): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      const pollResponse = await fetch(`${API_BASE_URL}/predictions/${prediction.id}`);
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