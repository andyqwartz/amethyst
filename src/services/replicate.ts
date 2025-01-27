import type { ReplicateInput } from '@/types/replicate';

const MODEL_VERSION = "lucataco/flux-dev-multi-lora:2389224e115448d9a77c07d7d45672b3f0aa45acacf1c5bcf51857ac295e3aec";

export async function generateImage(input: ReplicateInput): Promise<string[]> {
  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input,
      }),
    });

    if (!response.ok) {
      throw new Error(
        "Due to CORS restrictions, you'll need to implement one of these solutions:\n\n" +
        "1. Create a proxy server (e.g., using Express.js):\n" +
        "   - Set up a server that forwards requests to Replicate\n" +
        "   - Add proper CORS headers in your server\n\n" +
        "2. Use serverless functions (e.g., Vercel Edge Functions):\n" +
        "   - Create an API route that handles the Replicate requests\n" +
        "   - Deploy your app to Vercel\n\n" +
        "3. Use a CORS proxy service (for development only):\n" +
        "   - Use a service like cors-anywhere\n" +
        "   - Update the API URL to go through the proxy\n\n" +
        "For production, option 1 or 2 is recommended."
      );
    }

    const prediction = await response.json();
    
    // Poll for the result
    let result = prediction;
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: {
          'Authorization': `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`,
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