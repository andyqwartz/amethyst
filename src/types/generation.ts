export interface GenerationSettings {
  prompt: string;
  negative_prompt: string;
  guidance_scale: number;
  num_inference_steps: number;
  num_outputs: number;
  aspect_ratio: string;
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
  strength?: number;
  reference_image_id?: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  public_url: string;
  timestamp: number;
  created_at: string;
  settings: ImageSettings;
}

export interface GenerationHistoryItem {
  id: string;
  url: string;
  settings: GenerationSettings;
  timestamp: number;
}

export interface GenerationButtonsProps {
  onGenerate: () => void;
  isGenerating: boolean;
  onGenerationStart?: () => void;
}

export interface PromptInputProps {
  settings: ImageSettings;
  updateSettings: (settings: Partial<ImageSettings>) => void;
}

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error';