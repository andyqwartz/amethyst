
export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error';

export interface GenerationSettings {
  prompt: string;
  negative_prompt: string;
  guidance_scale: number;
  num_inference_steps: number;
  num_outputs: number;
  width: number;
  height: number;
  steps: number;
  img2img: boolean;
  strength: number;
  aspect_ratio: '1:1' | '16:9' | '21:9' | '3:2' | '2:3' | '4:5' | '5:4' | '3:4' | '4:3' | '9:16' | '9:21';
  output_format: 'webp' | 'jpg' | 'png';
  output_quality: number;
  prompt_strength: number;
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
  initImage: string | null;
}

export interface GenerationButtonsProps {
  onGenerate: () => void;
  isGenerating: boolean;
  showSettings: boolean;
  onToggleSettings: () => void;
}

export interface GenerationHistoryItem {
  id: string;
  url: string;
  settings: ImageSettings;
  timestamp: number;
  output_url: string | null;
  public_url: string | null;
  created_at: string;
  status: GenerationStatus;
  completed_at: string | null;
  error_message: string | null;
  prompt: string;
  parameters: Record<string, any>;
  processing_time: number | null;
  credits_cost: number;
}

export interface ReferenceImage {
  id: string;
  user_id: string;
  image_id: string;
  original_filename: string | null;
  purpose: string;
  public_url: string | null;
  preprocessing_applied: Record<string, any>;
  width: number | null;
  height: number | null;
  usage_count: number;
  created_at: string;
  last_used_at: string;
}

export type GenerationParameters = Omit<GenerationSettings, 'prompt' | 'negative_prompt'>;
