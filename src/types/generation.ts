export interface GenerationSettings {
  prompt: string;
  negative_prompt: string;
  guidance_scale: number;
  num_inference_steps: number;
  num_outputs: number;
  aspect_ratio: '1:1' | '16:9' | '21:9' | '3:2' | '2:3' | '4:5' | '5:4' | '3:4' | '4:3' | '9:16' | '9:21';
  output_format: 'webp' | 'jpg' | 'png';
  output_quality: number;
  prompt_strength: number;
  steps: number;
  hf_loras: string[];
  lora_scales: number[];
  disable_safety_checker: boolean;
  seed?: number;
  reference_image_url?: string | null;
  reference_image_strength?: number;
  model_version?: string;
  scheduler?: string;
}

export interface ImageSettings extends GenerationSettings {
  width: number;
  height: number;
  img2img: boolean;
  strength: number;
  initImage: string | null;
}

export type GenerationParameters = Omit<GenerationSettings, 'prompt' | 'negative_prompt'>;

export interface GeneratedImage {
  id: string;
  user_id: string;
  image_id: string;
  prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  num_inference_steps: number;
  guidance_scale: number;
  seed: number | null;
  strength: number;
  num_outputs: number;
  output_quality: number;
  prompt_strength: number;
  lora_scales: number[];
  disable_safety_checker: boolean;
  reference_image_id: string | null;
  reference_image_strength: number;
  generation_time: number | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message: string | null;
  raw_parameters: Record<string, any>;
  parameter_history: Record<string, any>[];
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  model_id: string | null;
  model_version: string;
  scheduler: string;
  hf_loras: string[];
  aspect_ratio: string;
  output_format: string;
  output_url: string | null;
  processing_time: number | null;
  credits_cost: number;
}
