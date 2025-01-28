import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { corsHeaders } from "../_shared/cors.ts";

const REPLICATE_API_TOKEN = Deno.env.get('REPLICATE_API_TOKEN');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_ANON_KEY!
    );

    const { data: { user } } = await supabase.auth.getUser(
      req.headers.get('Authorization')?.split(' ')[1] ?? ''
    );

    if (!user) {
      throw new Error('Not authenticated');
    }

    const {
      prompt,
      negativePrompt,
      guidanceScale,
      steps,
      seed,
      numOutputs,
      aspectRatio,
      outputFormat,
      outputQuality,
      promptStrength,
      hfLoras,
      loraScales,
      disableSafetyChecker,
      image
    } = await req.json();

    console.log('Received parameters:', {
      prompt,
      guidanceScale,
      steps,
      numOutputs,
      aspectRatio,
      hfLoras,
      loraScales
    });

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "2389224e115448d9a77c07d7d45672b3f0aa45acacf1c5bcf51857ac295e3aec",
        input: {
          prompt,
          image,
          num_inference_steps: steps,
          guidance_scale: guidanceScale,
          num_outputs: numOutputs,
          aspect_ratio: aspectRatio,
          output_format: outputFormat,
          output_quality: outputQuality,
          prompt_strength: promptStrength,
          hf_loras: hfLoras,
          lora_scales: loraScales,
          disable_safety_checker: disableSafetyChecker
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Replicate API error:', error);
      throw new Error(`Replicate API error: ${JSON.stringify(error)}`);
    }

    const prediction = await response.json();
    console.log('Prediction created:', prediction);

    return new Response(JSON.stringify(prediction), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ status: 'error', error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});