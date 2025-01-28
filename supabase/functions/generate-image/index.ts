import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Replicate from "https://esm.sh/replicate@0.25.2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY')
    if (!REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY is not set')
    }

    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    })

    const body = await req.json()

    // If it's a status check request
    if (body.predictionId) {
      console.log("Checking status for prediction:", body.predictionId)
      const prediction = await replicate.predictions.get(body.predictionId)
      console.log("Status check response:", prediction)
      return new Response(JSON.stringify(prediction), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // If it's a generation request
    if (!body.input?.prompt) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required field: prompt is required" 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log("Generating image with input:", body.input)
    
    const prediction = await replicate.predictions.create({
      version: "a738942df15c8c788b076ddd052256ba7923aade687b12109ccc64b2c3483aa1",
      input: {
        prompt: body.input.prompt,
        negative_prompt: body.input.negative_prompt,
        guidance_scale: body.input.guidance_scale,
        num_inference_steps: body.input.num_inference_steps,
        seed: body.input.seed,
        num_outputs: body.input.num_outputs,
        aspect_ratio: body.input.aspect_ratio,
        output_format: body.input.output_format,
        output_quality: body.input.output_quality,
        prompt_strength: body.input.prompt_strength,
        hf_loras: body.input.hf_loras || [],
        lora_scales: body.input.lora_scales || [],
        disable_safety_checker: body.input.disable_safety_checker,
        image: body.input.image
      }
    })

    console.log("Generation response:", prediction)
    return new Response(JSON.stringify(prediction), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("Error in generate-image function:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})