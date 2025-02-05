export interface Profile {
  // User Identity
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  created_at: string;

  // Authentication
  auth_provider: 'email' | 'google' | 'apple' | 'github' | null;
  provider_id: string | null;
  github_id: string | null;
  google_id: string | null;
  apple_id: string | null;
  email_verified: boolean;
  phone_verified: boolean;
  last_sign_in_at: string | null;
  last_login: string | null;

  // Subscription
  subscription_tier: 'free' | 'premium' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'canceled' | 'expired' | null;
  subscription_end_date: string | null;
  stripe_customer_id: string | null;

  // Credits
  credits_balance: number;
  lifetime_credits: number;
  last_credit_update: string | null;
  last_generation: string | null;

  // Advertising
  ads_enabled: boolean;
  ads_credits_earned: number;
  ads_watched_today: number;
  daily_ads_limit: number;
  ads_last_watched: string | null;

  // Preferences
  notifications_enabled: boolean;
  marketing_emails_enabled: boolean;
  language: 'fr' | 'en';
  theme: 'dark' | 'light' | 'system';

  // Status
  is_admin: boolean;
  is_banned: boolean;
  needs_attention: boolean;
}

export interface GeneratedImage {
  id: string;
  created_at: string;
  user_id: string;
  prompt: string;
  negative_prompt: string | null;
  model_id: string;
  width: number;
  height: number;
  num_inference_steps: number;
  guidance_scale: number;
  prompt_strength: number;
  seed: number | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message: string | null;
  output_format: 'png' | 'jpg' | 'webp';
  output_url: string | null;
  processing_time: number | null;
  credits_cost: number;
}

export interface ImageMetadata {
  id: string;
  image_id: string;
  created_at: string;
  nsfw_score: number | null;
  confidence_score: number | null;
  vision_labels: Record<string, number> | null;
  technical_info: {
    model_hash: string;
    pipeline_version: string;
    safety_checker_version: string;
  } | null;
}

export interface UserGenerationStats {
  user_id: string;
  total_generations: number;
  successful_generations: number;
  failed_generations: number;
  avg_generation_time: number;
  total_credits_spent: number;
  active_days: number;
  last_30_days_generations: number;
  favorite_models: Record<string, number>;
  common_resolutions: Record<string, number>;
  created_at: string;
  updated_at: string;
}

export interface GenerationSettings {
  width: number;
  height: number;
  num_inference_steps: number;
  guidance_scale: number;
  prompt_strength: number;
  use_seed: boolean;
  seed: number | null;
  output_format: 'png' | 'jpg' | 'webp';
  safety_checker: boolean;
  enhance_prompt: boolean;
  use_negative_prompt: boolean;
}

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  version: string;
  type: 'text2img' | 'img2img' | 'inpainting' | 'controlnet';
  status: 'active' | 'deprecated' | 'maintenance';
  credits_cost: number;
  avg_generation_time: number;
  supported_features: string[];
  default_settings: Partial<GenerationSettings>;
  max_resolution: {
    width: number;
    height: number;
  };
}
