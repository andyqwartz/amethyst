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
  action?: 'cancel';
}

export interface GenerationSettings {
  prompt: string;
  negativePrompt: string;
  guidanceScale: number;
  steps: number;
  seed?: number;
  numOutputs: number;
  aspectRatio: string;
  outputFormat: 'webp' | 'jpg' | 'png';
  outputQuality: number;
  promptStrength: number;
  hfLoras: string[];
  loraScales: number[];
  disableSafetyChecker: boolean;
}

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ReplicatePrediction {
  id: string;
  version: string;
  input: ReplicateInput;
  output: string[] | null;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  error: string | null;
  logs: string;
  metrics: {
    predict_time: number;
  };
}