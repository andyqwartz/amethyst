export interface GenerationSettings {
  prompt: string;
  negative_prompt: string;
  guidance_scale: number;
  num_inference_steps: number;
  seed: number;
  num_outputs: number;
  aspect_ratio: string;
  output_format: string;
  output_quality: number;
  prompt_strength: number;
  reference_image_url?: string | null;
  hf_loras?: string[];
  lora_scales?: number[];
  disable_safety_checker?: boolean;
}

export interface GenerationState {
  isLoading: boolean;
  isPaused: boolean;
  error: string | null;
  progress: number;
}