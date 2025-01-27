import type { ReplicateInput } from '@/types/replicate';

const MODEL_VERSION = "lucataco/flux-dev-multi-lora:2389224e115448d9a77c07d7d45672b3f0aa45acacf1c5bcf51857ac295e3aec";

export async function generateImage(input: ReplicateInput): Promise<string[]> {
  try {
    throw new Error(
      "Due to CORS restrictions, the Replicate API cannot be called directly from the browser. " +
      "To use this feature, you'll need to either:\n\n" +
      "1. Set up a proxy server to handle the API calls\n" +
      "2. Use a serverless function (e.g., Vercel Edge Functions)\n" +
      "3. Use a CORS proxy service (note: not recommended for production)\n\n" +
      "For development purposes, you can find example implementations in the Replicate documentation."
    );
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}