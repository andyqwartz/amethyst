export interface ImageSettings {
  prompt: string;
  negative_prompt: string;
  guidance_scale: number;
  steps: number;
  width: number;
  height: number;
  seed: number;
  num_outputs: number;
  aspect_ratio: string;
  output_format: string;
  output_quality: number;
  prompt_strength: number;
  reference_image_url?: string;
  reference_image_strength?: number;
  hf_loras?: string[];
  lora_scales?: number[];
  disable_safety_checker?: boolean;
}

export interface GenerationButtonsProps {
  onGenerate: () => void;
  onGenerationStart?: () => void;
  isGenerating: boolean;
  showSettings?: boolean;
}

export interface UserProfileProps {
  user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, any>;
  };
}