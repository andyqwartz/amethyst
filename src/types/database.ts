export type ImageStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  auth_provider: string | null
  provider_id: string | null
  google_id: string | null
  apple_id: string | null
  github_id: string | null
  stripe_customer_id: string | null
  phone_number: string | null
  language: string
  theme: string
  is_admin: boolean
  is_banned: boolean
  email_verified: boolean
  phone_verified: boolean
  needs_attention: boolean
  notifications_enabled: boolean
  marketing_emails_enabled: boolean
  ads_enabled: boolean
  subscription_tier: string
  subscription_status: string
  subscription_end_date: string | null
  credits_balance: number
  lifetime_credits: number
  ads_credits_earned: number
  ads_watched_today: number
  daily_ads_limit: number
  last_credit_update: string
  ads_last_watched: string | null
  created_at: string
  last_sign_in_at: string
  updated_at: string
}

export interface Image {
  id: string
  hash: string
  storage_path: string
  public_url: string | null
  format: string
  width: number
  height: number
  file_size_bytes: number
  is_nsfw: boolean
  metadata: Record<string, any>
  created_at: string
}

export interface ImageMetadata {
  image_id: string
  embedding: number[] | null
  style_embedding: number[] | null
  content_embedding: number[] | null
  vision_text: string | null
  vision_labels: Record<string, any>
  vision_objects: Record<string, any>
  vision_colors: Record<string, any>
  confidence_score: number | null
  nsfw_score: number | null
  processing_status: ImageStatus
  processed_at: string | null
  error_message: string | null
  raw_analysis_result: Record<string, any>
  // New fields for enhanced image analysis
  vision_api_provider: string
  vision_api_version: string | null
  vision_api_model: string | null
  vision_api_cost: number
  vision_api_response_time: number | null
  content_moderation_score: number | null
  content_categories: any[]
  detected_faces: any[]
  detected_text_blocks: any[]
  image_quality_score: number | null
  technical_metadata: Record<string, any>
  similarity_search_enabled: boolean
  last_embedding_update: string | null
}

export interface Prompt {
  id: string
  user_id: string
  prompt: string
  negative_prompt: string
  prompt_strength: number
  steps: number
  guidance_scale: number
  aspect_ratio: string
  num_outputs: number
  seed: number
  output_quality: number
  output_format: string
  safety_checker: boolean
  hf_loras: string[]
  lora_scales: number[]
  created_at: string
}

export interface GeneratedImage {
  id: string
  user_id: string
  image_id: string
  prompt: string
  negative_prompt: string
  model_version: string
  scheduler: string
  width: number
  height: number
  num_inference_steps: number
  guidance_scale: number
  prompt_strength: number
  seed: number | null
  strength: number
  num_outputs: number
  output_quality: number
  output_format: string
  aspect_ratio: string
  lora_scales: number[]
  hf_loras: string[]
  disable_safety_checker: boolean
  reference_image_id: string | null
  reference_image_strength: number
  generation_time: number | null
  status: ImageStatus
  error_message: string | null
  raw_parameters: Record<string, any>
  parameter_history: Record<string, any>[]
  created_at: string
  started_at: string | null
  completed_at: string | null
}

export interface ReferenceImage {
  id: string
  user_id: string
  image_id: string
  original_filename: string | null
  purpose: string
  public_url: string | null
  preprocessing_applied: Record<string, any>
  width: number | null
  height: number | null
  usage_count: number
  created_at: string
  last_used_at: string
}

export interface ImageCollection {
  id: string
  user_id: string
  name: string
  description: string | null
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface CollectionImage {
  collection_id: string
  image_id: string
  added_at: string
}

export interface CreditTransaction {
  id: string
  profile_id: string
  type: string
  amount: number
  description: string | null
  metadata: Record<string, any>
  created_at: string
}

export interface SubscriptionHistory {
  id: string
  profile_id: string
  tier: string
  status: string
  payment_method: string | null
  currency: string
  amount: number | null
  start_date: string
  end_date: string | null
  metadata: Record<string, any> | null
}

export interface CreditSource {
  id: string
  profile_id: string
  type: string
  amount: number
  created_at: string
  expires_at: string | null
  metadata: Record<string, any> | null
}

export interface AdView {
  id: string
  profile_id: string
  ad_id: string
  view_duration: number | null
  credits_earned: number
  completed: boolean
  metadata: Record<string, any> | null
  created_at: string
}

export interface AdsHistory {
  id: string
  profile_id: string
  ad_id: string
  platform: string | null
  credits_earned: number
  watched_duration: number | null
  completed: boolean
  watched_at: string
  metadata: Record<string, any> | null
}

export interface OAuthToken {
  profile_id: string
  provider: string
  access_token: string | null
  refresh_token: string | null
  scope: string[] | null
  expires_at: string | null
}

export interface BannedEmail {
  id: string
  email: string
  reason: string | null
  banned_at: string
  banned_by: string | null
}

export interface BannedUser {
  id: string
  email: string
  reason: string | null
  banned_at: string
  banned_by: string | null
  created_at: string
}

export interface UserGenerationStats {
  user_id: string
  total_generations: number | null
  active_days: number | null
  avg_generation_time: number | null
  successful_generations: number | null
  failed_generations: number | null
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at' | 'last_sign_in_at'>
        Update: Partial<Profile>
      }
      images: {
        Row: Image
        Insert: Omit<Image, 'created_at'>
        Update: Partial<Image>
      }
      image_metadata: {
        Row: ImageMetadata
        Insert: Omit<ImageMetadata, 'processed_at'>
        Update: Partial<ImageMetadata>
      }
      prompts: {
        Row: Prompt
        Insert: Omit<Prompt, 'created_at'>
        Update: Partial<Prompt>
      }
      generated_images: {
        Row: GeneratedImage
        Insert: Omit<GeneratedImage, 'created_at' | 'started_at' | 'completed_at'>
        Update: Partial<GeneratedImage>
      }
      reference_images: {
        Row: ReferenceImage
        Insert: Omit<ReferenceImage, 'created_at' | 'last_used_at'>
        Update: Partial<ReferenceImage>
      }
      image_collections: {
        Row: ImageCollection
        Insert: Omit<ImageCollection, 'created_at' | 'updated_at'>
        Update: Partial<ImageCollection>
      }
      collection_images: {
        Row: CollectionImage
        Insert: Omit<CollectionImage, 'added_at'>
        Update: Partial<CollectionImage>
      }
      credit_transactions: {
        Row: CreditTransaction
        Insert: Omit<CreditTransaction, 'created_at'>
        Update: Partial<CreditTransaction>
      }
      subscription_history: {
        Row: SubscriptionHistory
        Insert: Omit<SubscriptionHistory, 'start_date'>
        Update: Partial<SubscriptionHistory>
      }
      credit_sources: {
        Row: CreditSource
        Insert: Omit<CreditSource, 'created_at'>
        Update: Partial<CreditSource>
      }
      ad_views: {
        Row: AdView
        Insert: Omit<AdView, 'created_at'>
        Update: Partial<AdView>
      }
      ads_history: {
        Row: AdsHistory
        Insert: Omit<AdsHistory, 'watched_at'>
        Update: Partial<AdsHistory>
      }
      oauth_tokens: {
        Row: OAuthToken
        Insert: OAuthToken
        Update: Partial<OAuthToken>
      }
      banned_emails: {
        Row: BannedEmail
        Insert: Omit<BannedEmail, 'banned_at'>
        Update: Partial<BannedEmail>
      }
      banned_users: {
        Row: BannedUser
        Insert: Omit<BannedUser, 'banned_at' | 'created_at'>
        Update: Partial<BannedUser>
      }
      user_generation_stats: {
        Row: UserGenerationStats
        Insert: UserGenerationStats
        Update: Partial<UserGenerationStats>
      }
    }
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      is_email_banned: {
        Args: { check_email: string }
        Returns: boolean
      }
      is_user_banned: {
        Args: { user_id: string }
        Returns: boolean
      }
      add_user_credits: {
        Args: {
          target_user_id: string
          credit_amount: number
          credit_type: string
          credit_description?: string
        }
        Returns: void
      }
      handle_ad_view_credits: {
        Args: {
          user_id: string
          ad_id: string
          view_duration: number
          platform?: string
        }
        Returns: void
      }
      calculate_image_similarity: {
        Args: {
          embedding1: number[]
          embedding2: number[]
        }
        Returns: number
      }
      find_similar_images: {
        Args: {
          target_embedding: number[]
          similarity_threshold?: number
          max_results?: number
        }
        Returns: {
          image_id: string
          similarity: number
        }[]
      }
      schedule_image_analysis: {
        Args: Record<string, never>
        Returns: ImageMetadata
      }
      check_content_moderation: {
        Args: Record<string, never>
        Returns: void
      }
    }
  }
}
