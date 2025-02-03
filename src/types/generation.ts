export interface GenerationSettings {
  prompt: string;
  negative_prompt: string;
  guidance_scale: number;
  num_inference_steps: number;
  seed?: number;
  num_outputs: number;
  aspect_ratio: string;
  output_format: 'webp' | 'jpg' | 'png';
  output_quality: number;
  prompt_strength: number;
  reference_image_url?: string | null;
  reference_image_strength?: number;
  hf_loras?: string[];
  lora_scales?: number[];
  disable_safety_checker?: boolean;
}

export interface ImageSettings extends Omit<GenerationSettings, 'aspect_ratio'> {
  width: number;
  height: number;
  steps: number;
  img2img: boolean;
  strength: number;
  initImage: string | null;
}

export interface GenerationParameters extends GenerationSettings {
  width: number;
  height: number;
  scheduler?: string;
  model_version?: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  timestamp: number;
  settings: ImageSettings;
}

export interface ReferenceImage {
  id: string;
  url: string;
  filename: string;
  width: number;
  height: number;
}