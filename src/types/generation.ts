
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

export interface ReplicateGenerationParameters {
  prompt: string;
  seed?: number;
  image?: string;
  hf_loras: string[];
  lora_scales: number[];
  num_outputs: number;
  aspect_ratio: string;
  output_format: string;
  guidance_scale: number;
  output_quality: number;
  prompt_strength: number;
  num_inference_steps: number;
  disable_safety_checker: boolean;
}

export interface GeneratedImage {
  id: string;
  url: string;
  public_url: string;
  timestamp: number;
  created_at: string;
  settings: ImageSettings;
  user_id: string;
  image_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  completed_at?: string;
  error_message?: string;
}

export interface GenerationHistoryItem {
  id: string;
  url: string | null;
  output_url: string | null;
  public_url: string | null;
  timestamp: number;
  created_at: string;
  settings: ImageSettings;
  user_id: string;
  image_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  completed_at?: string;
  error_message?: string;
  prompt: string;
  parameters: Record<string, any>;
  processing_time?: number;
  credits_cost: number;
}

export interface GenerationButtonsProps {
  onGenerate: () => void;
  isGenerating: boolean;
  onGenerationStart?: () => void;
}

export interface PromptInputProps {
  settings: ImageSettings;
  onSettingsChange: (settings: Partial<ImageSettings>) => void;
  onGenerate: () => void;
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
  width: number;
  height: number;
  preprocessing_applied?: Record<string, any>;
}

export interface ImageMetadata {
  vision_labels?: Record<string, number>;
  vision_objects?: string[];
  vision_text?: string;
  vision_colors?: string[];
  nsfw_score?: number;
  confidence_score?: number;
  embedding?: number[];
  style_embedding?: number[];
  content_embedding?: number[];
  processing_status?: string;
  processed_at?: string;
  error_message?: string;
  raw_analysis_result?: Record<string, any>;
}

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error';

export const defaultSettings: ImageSettings = {
  prompt: '',
  negative_prompt: '',
  aspect_ratio: '1:1',
  prompt_strength: 0.8,
  steps: 28,
  guidance_scale: 3.5,
  num_inference_steps: 28,
  num_outputs: 1,
  seed: -1,
  output_format: 'webp',
  output_quality: 80,
  disable_safety_checker: false,
  hf_loras: ['lucataco/flux-dev-multi-lora:2389224e115448d9a77c07d7d45672b3f0aa45acacf1c5bcf51857ac295e3aec'],
  lora_scales: [0.8],
  width: 512,
  height: 512,
  img2img: false,
  strength: 0.75,
  initImage: null,
  reference_image_url: null,
  reference_image_strength: 0.5,
  model_version: 'latest',
  scheduler: 'DPMSolverMultistepScheduler'
};
