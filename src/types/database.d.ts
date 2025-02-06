export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          auth_provider: string | null
          provider_id: string | null
          google_id: string | null
          apple_id: string | null
          github_id: string | null
          is_admin: boolean
          is_banned: boolean
          created_at: string
          updated_at: string
          phone_number: string | null
          phone_verified: boolean
          email_verified: boolean
          needs_attention: boolean
          notifications_enabled: boolean
          marketing_emails_enabled: boolean
          ads_enabled: boolean
          ads_credits_earned: number
          ads_watched_today: number
          daily_ads_limit: number
          ads_last_watched: string | null
          credits_balance: number
          lifetime_credits: number
          last_credit_update: string | null
          subscription_tier: string
          subscription_status: string
          subscription_end_date: string | null
          stripe_customer_id: string | null
          language: string
          theme: string
          role: string
          last_sign_in_at: string | null
          total_generations: number
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          auth_provider?: string | null
          provider_id?: string | null
          google_id?: string | null
          apple_id?: string | null
          github_id?: string | null
          is_admin?: boolean
          is_banned?: boolean
          created_at?: string
          updated_at?: string
          phone_number?: string | null
          phone_verified?: boolean
          email_verified?: boolean
          needs_attention?: boolean
          notifications_enabled?: boolean
          marketing_emails_enabled?: boolean
          ads_enabled?: boolean
          ads_credits_earned?: number
          ads_watched_today?: number
          daily_ads_limit?: number
          ads_last_watched?: string | null
          credits_balance?: number
          lifetime_credits?: number
          last_credit_update?: string | null
          subscription_tier?: string
          subscription_status?: string
          subscription_end_date?: string | null
          stripe_customer_id?: string | null
          language?: string
          theme?: string
          role?: string
          last_sign_in_at?: string | null
          total_generations?: number
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          auth_provider?: string | null
          provider_id?: string | null
          google_id?: string | null
          apple_id?: string | null
          github_id?: string | null
          is_admin?: boolean
          is_banned?: boolean
          created_at?: string
          updated_at?: string
          phone_number?: string | null
          phone_verified?: boolean
          email_verified?: boolean
          needs_attention?: boolean
          notifications_enabled?: boolean
          marketing_emails_enabled?: boolean
          ads_enabled?: boolean
          ads_credits_earned?: number
          ads_watched_today?: number
          daily_ads_limit?: number
          ads_last_watched?: string | null
          credits_balance?: number
          lifetime_credits?: number
          last_credit_update?: string | null
          subscription_tier?: string
          subscription_status?: string
          subscription_end_date?: string | null
          stripe_customer_id?: string | null
          language?: string
          theme?: string
          role?: string
          last_sign_in_at?: string | null
          total_generations?: number
        }
      }
      images: {
        Row: {
          id: string;
          width: number;
          height: number;
          file_size_bytes: number;
          format: string;
          hash: string;
          storage_path: string;
          public_url: string | null;
          is_nsfw: boolean | null;
          created_at: string | null;
          metadata: Json | null;
        }
        Insert: {
          id?: string;
          width: number;
          height: number;
          file_size_bytes: number;
          format: string;
          hash: string;
          storage_path: string;
          public_url?: string | null;
          is_nsfw?: boolean | null;
          created_at?: string | null;
          metadata?: Json | null;
        }
        Update: {
          id?: string;
          width?: number;
          height?: number;
          file_size_bytes?: number;
          format?: string;
          hash?: string;
          storage_path?: string;
          public_url?: string | null;
          is_nsfw?: boolean | null;
          created_at?: string | null;
          metadata?: Json | null;
        }
      }
      generated_images: {
        Row: {
          id: string;
          user_id: string | null;
          image_id: string | null;
          prompt: string;
          negative_prompt: string | null;
          width: number | null;
          height: number | null;
          num_inference_steps: number | null;
          guidance_scale: number | null;
          seed: number | null;
          strength: number | null;
          num_outputs: number | null;
          output_quality: number | null;
          prompt_strength: number | null;
          lora_scales: number[] | null;
          disable_safety_checker: boolean | null;
          reference_image_id: string | null;
          reference_image_strength: number | null;
          generation_time: number | null;
          status: string | null;
          raw_parameters: Json | null;
          parameter_history: Json[] | null;
          created_at: string | null;
          started_at: string | null;
          completed_at: string | null;
          model_version: string | null;
          scheduler: string | null;
          hf_loras: string[] | null;
          aspect_ratio: string | null;
          output_format: string | null;
          error_message: string | null;
        }
        Insert: {
          id?: string;
          user_id?: string | null;
          image_id?: string | null;
          prompt: string;
          negative_prompt?: string | null;
          width?: number | null;
          height?: number | null;
          num_inference_steps?: number | null;
          guidance_scale?: number | null;
          seed?: number | null;
          strength?: number | null;
          num_outputs?: number | null;
          output_quality?: number | null;
          prompt_strength?: number | null;
          lora_scales?: number[] | null;
          disable_safety_checker?: boolean | null;
          reference_image_id?: string | null;
          reference_image_strength?: number | null;
          generation_time?: number | null;
          status?: string | null;
          raw_parameters?: Json | null;
          parameter_history?: Json[] | null;
          created_at?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          model_version?: string | null;
          scheduler?: string | null;
          hf_loras?: string[] | null;
          aspect_ratio?: string | null;
          output_format?: string | null;
          error_message?: string | null;
        }
        Update: {
          id?: string;
          user_id?: string | null;
          image_id?: string | null;
          prompt?: string;
          negative_prompt?: string | null;
          width?: number | null;
          height?: number | null;
          num_inference_steps?: number | null;
          guidance_scale?: number | null;
          seed?: number | null;
          strength?: number | null;
          num_outputs?: number | null;
          output_quality?: number | null;
          prompt_strength?: number | null;
          lora_scales?: number[] | null;
          disable_safety_checker?: boolean | null;
          reference_image_id?: string | null;
          reference_image_strength?: number | null;
          generation_time?: number | null;
          status?: string | null;
          raw_parameters?: Json | null;
          parameter_history?: Json[] | null;
          created_at?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          model_version?: string | null;
          scheduler?: string | null;
          hf_loras?: string[] | null;
          aspect_ratio?: string | null;
          output_format?: string | null;
          error_message?: string | null;
        }
      }
      reference_images: {
        Row: {
          id: string;
          user_id: string | null;
          image_id: string | null;
          original_filename: string | null;
          purpose: string | null;
          preprocessing_applied: Json | null;
          created_at: string | null;
          last_used_at: string | null;
          usage_count: number | null;
          width: number | null;
          height: number | null;
          public_url: string | null;
        }
        Insert: {
          id?: string;
          user_id?: string | null;
          image_id?: string | null;
          original_filename?: string | null;
          purpose?: string | null;
          preprocessing_applied?: Json | null;
          created_at?: string | null;
          last_used_at?: string | null;
          usage_count?: number | null;
          width?: number | null;
          height?: number | null;
          public_url?: string | null;
        }
        Update: {
          id?: string;
          user_id?: string | null;
          image_id?: string | null;
          original_filename?: string | null;
          purpose?: string | null;
          preprocessing_applied?: Json | null;
          created_at?: string | null;
          last_used_at?: string | null;
          usage_count?: number | null;
          width?: number | null;
          height?: number | null;
          public_url?: string | null;
        }
      }
      image_metadata: {
        Row: {
          image_id: string;
          vision_text: string | null;
          vision_labels: Json | null;
          vision_objects: Json | null;
          vision_colors: Json | null;
          embedding: string | null;
          style_embedding: string | null;
          content_embedding: string | null;
          confidence_score: number | null;
          nsfw_score: number | null;
          processing_status: string | null;
          processed_at: string | null;
          raw_analysis_result: Json | null;
          error_message: string | null;
        }
        Insert: {
          image_id: string;
          vision_text?: string | null;
          vision_labels?: Json | null;
          vision_objects?: Json | null;
          vision_colors?: Json | null;
          embedding?: string | null;
          style_embedding?: string | null;
          content_embedding?: string | null;
          confidence_score?: number | null;
          nsfw_score?: number | null;
          processing_status?: string | null;
          processed_at?: string | null;
          raw_analysis_result?: Json | null;
          error_message?: string | null;
        }
        Update: {
          image_id?: string;
          vision_text?: string | null;
          vision_labels?: Json | null;
          vision_objects?: Json | null;
          vision_colors?: Json | null;
          embedding?: string | null;
          style_embedding?: string | null;
          content_embedding?: string | null;
          confidence_score?: number | null;
          nsfw_score?: number | null;
          processing_status?: string | null;
          processed_at?: string | null;
          raw_analysis_result?: Json | null;
          error_message?: string | null;
        }
      }
      image_collections: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          description: string | null;
          is_public: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        }
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          description?: string | null;
          is_public?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        }
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          description?: string | null;
          is_public?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        }
      }
      collection_images: {
        Row: {
          collection_id: string;
          image_id: string;
          added_at: string | null;
        }
        Insert: {
          collection_id: string;
          image_id: string;
          added_at?: string | null;
        }
        Update: {
          collection_id?: string;
          image_id?: string;
          added_at?: string | null;
        }
      }
      banned_users: {
        Row: {
          id: string;
          email: string;
          reason: string | null;
          banned_at: string | null;
          banned_by: string | null;
          created_at: string | null;
        }
        Insert: {
          id?: string;
          email: string;
          reason?: string | null;
          banned_at?: string | null;
          banned_by?: string | null;
          created_at?: string | null;
        }
        Update: {
          id?: string;
          email?: string;
          reason?: string | null;
          banned_at?: string | null;
          banned_by?: string | null;
          created_at?: string | null;
        }
      }
      banned_emails: {
        Row: {
          id: string;
          email: string;
          reason: string | null;
          banned_at: string | null;
          banned_by: string | null;
        }
        Insert: {
          id?: string;
          email: string;
          reason?: string | null;
          banned_at?: string | null;
          banned_by?: string | null;
        }
        Update: {
          id?: string;
          email?: string;
          reason?: string | null;
          banned_at?: string | null;
          banned_by?: string | null;
        }
      }
      ad_views: {
        Row: {
          id: string;
          profile_id: string | null;
          ad_id: string;
          view_duration: number | null;
          credits_earned: number | null;
          completed: boolean | null;
          created_at: string | null;
          metadata: Json | null;
        }
        Insert: {
          id?: string;
          profile_id?: string | null;
          ad_id: string;
          view_duration?: number | null;
          credits_earned?: number | null;
          completed?: boolean | null;
          created_at?: string | null;
          metadata?: Json | null;
        }
        Update: {
          id?: string;
          profile_id?: string | null;
          ad_id?: string;
          view_duration?: number | null;
          credits_earned?: number | null;
          completed?: boolean | null;
          created_at?: string | null;
          metadata?: Json | null;
        }
      }
      credit_transactions: {
        Row: {
          id: string;
          profile_id: string | null;
          type: string;
          amount: number;
          description: string | null;
          metadata: Json | null;
          created_at: string | null;
        }
        Insert: {
          id?: string;
          profile_id?: string | null;
          type: string;
          amount: number;
          description?: string | null;
          metadata?: Json | null;
          created_at?: string | null;
        }
        Update: {
          id?: string;
          profile_id?: string | null;
          type?: string;
          amount?: number;
          description?: string | null;
          metadata?: Json | null;
          created_at?: string | null;
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_collection: {
        Args: {
          collection_id: string
        }
        Returns: boolean
      }
      can_watch_ads: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      check_admin_status: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      check_email_status: {
        Args: {
          check_email: string
        }
        Returns: {
          exists_in_auth: boolean
          is_banned: boolean
        }
      }
      create_admin_user: {
        Args: {
          admin_email: string
          admin_password: string
        }
        Returns: string
      }
      get_user_credits: {
        Args: {
          user_id: string
        }
        Returns: number
      }
      handle_ad_view: {
        Args: {
          user_id: string
          ad_id: string
          duration: number
          platform: string
        }
        Returns: number
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      owns_record: {
        Args: {
          record_user_id: string
        }
        Returns: boolean
      }
      record_ad_view: {
        Args: {
          user_id: string
          ad_id: string
          view_duration: number
          credits_earned: number
        }
        Returns: boolean
      }
      reset_daily_ad_counts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_user_credits: {
        Args: {
          user_id: string
          amount: number
          transaction_type: string
          description: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type PublicSchema = Database['public']

export type Table<
  T extends keyof PublicSchema['Tables']
> = PublicSchema['Tables'][T]['Row']

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]
