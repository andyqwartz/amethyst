export interface GenerationParameters {
  prompt: string;
  negative_prompt?: string;
  width: number;
  height: number;
  num_inference_steps: number;
  guidance_scale: number;
  seed?: number;
  scheduler?: string;
  strength?: number;
  num_outputs?: number;
  aspect_ratio?: string;
  output_format?: string;
  output_quality?: number;
  prompt_strength?: number;
  hf_loras?: string[];
  lora_scales?: number[];
  disable_safety_checker?: boolean;
  reference_image_id?: string;
  reference_image_strength?: number;
}

export interface GeneratedImage {
  id: string;
  user_id: string;
  image_id: string;
  prompt: string;
  negative_prompt?: string;
  width: number;
  height: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  public_url?: string;
  created_at: string;
  completed_at?: string;
  error_message?: string;
}

export interface ReferenceImage {
  id: string;
  user_id: string;
  image_id: string;
  original_filename: string;
  purpose: string;
  public_url: string;
  created_at: string;
  last_used_at: string;
  usage_count: number;
}

export interface ImageMetadata {
  vision_labels?: Record<string, number>;
  vision_objects?: string[];
  vision_text?: string;
  vision_colors?: string[];
  nsfw_score?: number;
  confidence_score?: number;
} 