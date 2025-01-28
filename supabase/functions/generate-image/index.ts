import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Replicate from "https://esm.sh/replicate@0.25.2"

const MODEL_VERSION = "2389224e115448d9a77c07d7d45672b3f0aa45acacf1c5bcf51857ac295e3aec";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
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

    if (body.predictionId) {
      console.log("Checking status for prediction:", body.predictionId)
      const prediction = await replicate.predictions.get(body.predictionId)
      console.log("Status check response:", prediction)
      return new Response(JSON.stringify(prediction), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

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

    // Format LoRA inputs correctly
    const formattedLoras = body.input.hf_loras?.map((lora: string, index: number) => ({
      model: lora,
      scale: body.input.lora_scales?.[index] || 1.0
    })) || [];

    // Prepare the input according to the model's schema
    const input = {
      prompt: body.input.prompt,
      negative_prompt: body.input.negative_prompt || "",
      guidance_scale: body.input.guidance_scale || 3.5,
      num_inference_steps: body.input.num_inference_steps || 28,
      num_outputs: body.input.num_outputs || 1,
      aspect_ratio: body.input.aspect_ratio || "1:1",
      output_format: body.input.output_format || "webp",
      output_quality: body.input.output_quality || 80,
      prompt_strength: body.input.prompt_strength || 0.8,
      loras: formattedLoras,
      disable_safety_checker: body.input.disable_safety_checker || false
    }

    if (body.input.image) {
      console.log("Reference image detected")
      input.image = body.input.image
    }

    console.log("Starting generation with input:", {
      ...input,
      image: input.image ? "Image present" : "No image",
      loras: formattedLoras
    })

    try {
      const prediction = await replicate.predictions.create({
        version: MODEL_VERSION,
        input: input
      })

      console.log("Generation started:", prediction)
      return new Response(JSON.stringify(prediction), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    } catch (error) {
      console.error("Error creating prediction:", error)
      return new Response(
        JSON.stringify({ 
          error: "Failed to create prediction", 
          details: error.message 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }
  } catch (error) {
    console.error("Error in generate-image function:", error)
    return new Response(
      JSON.stringify({ 
        error: "An unexpected error occurred", 
        details: error.message 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})