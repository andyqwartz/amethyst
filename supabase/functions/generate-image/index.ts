import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Replicate from "https://esm.sh/replicate@0.25.2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY')
    if (!REPLICATE_API_KEY) {
      console.error('REPLICATE_API_KEY is not set')
      throw new Error('REPLICATE_API_KEY is not set')
    }

    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    })

    const { input } = await req.json()
    console.log("Received input:", input)

    if (!input || !input.prompt) {
      console.error('Missing required field: prompt')
      throw new Error('Missing required field: prompt')
    }

    console.log("Starting image generation with input:", {
      ...input,
      prompt: input.prompt.substring(0, 100) + "..." // Truncate long prompts in logs
    })

    const output = await replicate.run(
      "lucataco/flux-dev-multi-lora:2389224e115448d9a77c07d7d45672b3f0aa45acacf1c5bcf51857ac295e3aec",
      {
        input: {
          prompt: input.prompt,
          negative_prompt: input.negative_prompt,
          guidance_scale: input.guidance_scale,
          num_inference_steps: input.num_inference_steps,
          num_outputs: input.num_outputs,
          seed: input.seed,
          aspect_ratio: input.aspect_ratio,
          output_format: input.output_format,
          output_quality: input.output_quality,
          prompt_strength: input.prompt_strength,
          hf_loras: input.hf_loras,
          lora_scales: input.lora_scales,
          disable_safety_checker: input.disable_safety_checker,
        }
      }
    )

    console.log("Generation successful, output:", output)
    return new Response(JSON.stringify({ output }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error("Error in generate-image function:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})