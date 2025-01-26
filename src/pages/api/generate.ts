import { generateImage } from '@/lib/replicate';
import type { ReplicateInput } from '@/types/replicate';

export async function POST(req: Request) {
  try {
    const input: ReplicateInput = await req.json();
    const images = await generateImage(input);
    return new Response(JSON.stringify(images), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}