import Replicate from "replicate";
import type { ReplicateInput } from "@/types/replicate";

const MODEL_VERSION = "lucataco/flux-dev-multi-lora:2389224e115448d9a77c07d7d45672b3f0aa45acacf1c5bcf51857ac295e3aec";

export async function generateImage(input: ReplicateInput): Promise<string[]> {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY,
  });

  try {
    const output = await replicate.run(MODEL_VERSION, { input });
    return output as string[];
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}