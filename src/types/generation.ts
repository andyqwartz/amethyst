<<<<<<< HEAD
export interface ImageSettings {
  prompt: string;
  negative_prompt: string;
  guidance_scale: number;
  num_inference_steps: number;
  aspect_ratio: '1:1' | '16:9';
  prompt_strength: number;
  steps: number;
  num_outputs: number;
  seed: number;
  output_format: 'webp' | 'png' | 'jpg';
  output_quality: number;
  safety_checker: boolean;
  hf_loras: string[];
  lora_scales: number[];
}

export interface GenerationSettings {
  prompt: string;
  negative_prompt: string;
  aspect_ratio: '1:1' | '16:9';
  prompt_strength: number;
  steps: number;
  guidance_scale: number;
  num_outputs: number;
  seed: number;
  output_format: 'webp' | 'png' | 'jpg';
  output_quality: number;
  safety_checker: boolean;
  hf_loras: string[];
  lora_scales: number[];
}

export interface GenerationButtonsProps {
  onGenerate: () => void;
  isGenerating?: boolean;
}

export interface UserProfileProps {
  profile: {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    credits_balance: number;
    subscription_tier: string;
    language: string;
  };
}

export interface GenerationParameters {
  prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  num_inference_steps: number;
  guidance_scale: number;
  seed: number;
  scheduler: string;
  strength: number;
  num_outputs: number;
  aspect_ratio: string;
  output_format: string;
=======
export interface GenerationSettings {
  prompt: string;
  negative_prompt: string;
  guidance_scale: number;
  num_inference_steps: number;
  num_outputs: number;
  aspect_ratio: string;
  output_format: 'webp' | 'jpg' | 'png';
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
  output_quality: number;
  prompt_strength: number;
  hf_loras: string[];
  lora_scales: number[];
  disable_safety_checker: boolean;
<<<<<<< HEAD
  reference_image_id?: string;
  reference_image_strength: number;
  model_version: string;
=======
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
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
}

export interface GeneratedImage {
  id: string;
<<<<<<< HEAD
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

export const defaultSettings: ImageSettings = {
  prompt: '',
  negative_prompt: '',
  aspect_ratio: '1:1',
  prompt_strength: 0.8,
  steps: 28,
  guidance_scale: 7.5,
  num_inference_steps: 50,
  num_outputs: 1,
  seed: -1,
  output_format: 'webp',
  output_quality: 90,
  safety_checker: true,
  hf_loras: ['AndyVampiro/fog'],
  lora_scales: [1.0]
}; 
=======
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
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
