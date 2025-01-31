export interface GenerationSettings {
  prompt: string;
  negative_prompt: string;
  guidance_scale: number;
  num_inference_steps: number;
  num_outputs: number;
  aspect_ratio: string;
  output_format: string;
  output_quality: number;
  prompt_strength: number;
  hf_loras: string[];
  lora_scales: number[];
  disable_safety_checker: boolean;
  reference_image_url?: string | null;
  seed?: number;
}

export interface GenerationState {
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  isPaused: boolean;
  isGenerating: boolean;
}

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ReplicateInput {
  prompt: string;
  negative_prompt?: string;
  guidance_scale?: number;
  num_inference_steps?: number;
  seed?: number;
  width?: number;
  height?: number;
  num_outputs?: number;
  scheduler?: string;
  safety_checker?: boolean;
  image?: string;
  prompt_strength?: number;
}

export interface ToastOptions {
  duration?: number;
  variant?: 'default' | 'destructive';
}

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
}

export interface ToasterToast extends Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  dismiss: () => void;
}