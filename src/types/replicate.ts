export interface ReplicateInput {
  prompt: string;
  negative_prompt?: string;
  seed?: number;
  image?: string;
  hf_loras?: string[];
  lora_scales?: number[];
  num_outputs?: number;
  aspect_ratio?: string;
  output_format?: 'webp' | 'jpg' | 'png';
  guidance_scale?: number;
  output_quality?: number;
  prompt_strength?: number;
  num_inference_steps?: number;
  disable_safety_checker?: boolean;
}

export interface GenerationSettings {
  guidanceScale: number;
  steps: number;
  seed?: number;
  numOutputs: number;
  aspectRatio: string;
  outputFormat: 'webp' | 'jpg' | 'png';
  outputQuality: number;
  promptStrength?: number;
  hfLoras?: string[];
  loraScales?: number[];
  disableSafetyChecker?: boolean;
}