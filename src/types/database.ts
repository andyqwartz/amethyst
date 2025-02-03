export type ImageStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  credits: number;
  total_generations: number;
  subscription_tier: string;
  subscription_expires_at: string | null;
  created_at: string;
  updated_at: string;
  role: 'user' | 'admin';
}

export interface Image {
  id: string;
  hash: string;
  storage_path: string;
  public_url: string | null;
  width: number;
  height: number;
  format: string;
  file_size_bytes: number;
  is_nsfw: boolean;
  created_at: string;
  metadata: Record<string, unknown>;
}

export interface ImageMetadata {
  image_id: string;
  vision_labels: Record<string, unknown>;
  vision_objects: Record<string, unknown>;
  vision_text: string | null;
  vision_colors: Record<string, unknown>;
  embedding: number[];
  style_embedding: number[];
  content_embedding: number[];
  confidence_score: number | null;
  nsfw_score: number | null;
  processing_status: ImageStatus;
  processed_at: string | null;
  error_message: string | null;
  raw_analysis_result: Record<string, unknown>;
}

export interface GeneratedImage {
  id: string;
  user_id: string;
  image_id: string;
  prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  num_inference_steps: number;
  guidance_scale: number;
  seed: number | null;
  scheduler: string;
  strength: number;
  num_outputs: number;
  aspect_ratio: string;
  output_format: string;
  output_quality: number;
  prompt_strength: number;
  hf_loras: string[];
  lora_scales: number[];
  disable_safety_checker: boolean;
  reference_image_id: string | null;
  reference_image_strength: number;
  model_version: string;
  generation_time: number | null;
  status: ImageStatus;
  error_message: string | null;
  raw_parameters: Record<string, unknown>;
  parameter_history: Record<string, unknown>[];
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export interface ReferenceImage {
  id: string;
  user_id: string;
  image_id: string;
  original_filename: string | null;
  purpose: string;
  preprocessing_applied: Record<string, unknown>;
  created_at: string;
  last_used_at: string;
  usage_count: number;
}

export interface ImageCollection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface CollectionImage {
  collection_id: string;
  image_id: string;
  added_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at' | 'credits' | 'total_generations'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      images: {
        Row: Image;
        Insert: Omit<Image, 'id' | 'created_at'>;
        Update: Partial<Omit<Image, 'id'>>;
      };
      image_metadata: {
        Row: ImageMetadata;
        Insert: Omit<ImageMetadata, 'processed_at'>;
        Update: Partial<Omit<ImageMetadata, 'image_id'>>;
      };
      generated_images: {
        Row: GeneratedImage;
        Insert: Omit<GeneratedImage, 'id' | 'created_at' | 'started_at' | 'completed_at'>;
        Update: Partial<Omit<GeneratedImage, 'id' | 'user_id'>>;
      };
      reference_images: {
        Row: ReferenceImage;
        Insert: Omit<ReferenceImage, 'id' | 'created_at' | 'last_used_at' | 'usage_count'>;
        Update: Partial<Omit<ReferenceImage, 'id' | 'user_id'>>;
      };
      image_collections: {
        Row: ImageCollection;
        Insert: Omit<ImageCollection, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ImageCollection, 'id' | 'user_id'>>;
      };
      collection_images: {
        Row: CollectionImage;
        Insert: Omit<CollectionImage, 'added_at'>;
        Update: Partial<CollectionImage>;
      };
    };
    Views: {
      active_reference_images: {
        Row: ReferenceImage & Pick<Image, 'public_url' | 'width' | 'height'>;
      };
      user_generation_stats: {
        Row: {
          user_id: string;
          total_generations: number;
          active_days: number;
          avg_generation_time: number;
          successful_generations: number;
          failed_generations: number;
        };
      };
    };
    Functions: {
      update_updated_at_column: {
        Args: Record<string, never>;
        Returns: unknown;
      };
      update_reference_image_usage: {
        Args: Record<string, never>;
        Returns: unknown;
      };
      update_user_stats: {
        Args: Record<string, never>;
        Returns: unknown;
      };
      handle_new_user: {
        Args: Record<string, never>;
        Returns: unknown;
      };
    };
  };
} 