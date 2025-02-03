export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Amethyst: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      collection_images: {
        Row: {
          added_at: string
          collection_id: string
          image_id: string
        }
        Insert: {
          added_at?: string
          collection_id: string
          image_id: string
        }
        Update: {
          added_at?: string
          collection_id?: string
          image_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_images_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "image_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_images_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_images: {
        Row: {
          aspect_ratio: string | null
          completed_at: string | null
          created_at: string
          disable_safety_checker: boolean | null
          error_message: string | null
          generation_time: number | null
          guidance_scale: number
          height: number
          hf_loras: string[] | null
          id: string
          image_id: string | null
          lora_scales: number[] | null
          model_version: string | null
          negative_prompt: string | null
          num_inference_steps: number
          num_outputs: number | null
          output_format: string
          output_quality: number | null
          parameter_history: Json[] | null
          prompt: string
          prompt_strength: number | null
          raw_parameters: Json | null
          reference_image_id: string | null
          reference_image_strength: number | null
          scheduler: string | null
          seed: number | null
          started_at: string | null
          status: Database["public"]["Enums"]["image_status"] | null
          strength: number | null
          user_id: string | null
          width: number
        }
        Insert: {
          aspect_ratio?: string | null
          completed_at?: string | null
          created_at?: string
          disable_safety_checker?: boolean | null
          error_message?: string | null
          generation_time?: number | null
          guidance_scale?: number
          height?: number
          hf_loras?: string[] | null
          id?: string
          image_id?: string | null
          lora_scales?: number[] | null
          model_version?: string | null
          negative_prompt?: string | null
          num_inference_steps?: number
          num_outputs?: number | null
          output_format?: string
          output_quality?: number | null
          parameter_history?: Json[] | null
          prompt: string
          prompt_strength?: number | null
          raw_parameters?: Json | null
          reference_image_id?: string | null
          reference_image_strength?: number | null
          scheduler?: string | null
          seed?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["image_status"] | null
          strength?: number | null
          user_id?: string | null
          width?: number
        }
        Update: {
          aspect_ratio?: string | null
          completed_at?: string | null
          created_at?: string
          disable_safety_checker?: boolean | null
          error_message?: string | null
          generation_time?: number | null
          guidance_scale?: number
          height?: number
          hf_loras?: string[] | null
          id?: string
          image_id?: string | null
          lora_scales?: number[] | null
          model_version?: string | null
          negative_prompt?: string | null
          num_inference_steps?: number
          num_outputs?: number | null
          output_format?: string
          output_quality?: number | null
          parameter_history?: Json[] | null
          prompt?: string
          prompt_strength?: number | null
          raw_parameters?: Json | null
          reference_image_id?: string | null
          reference_image_strength?: number | null
          scheduler?: string | null
          seed?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["image_status"] | null
          strength?: number | null
          user_id?: string | null
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "generated_images_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_images_reference_image_id_fkey"
            columns: ["reference_image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
      image_collections: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      image_metadata: {
        Row: {
          confidence_score: number | null
          content_embedding: string | null
          embedding: string | null
          error_message: string | null
          image_id: string
          nsfw_score: number | null
          processed_at: string | null
          processing_status: Database["public"]["Enums"]["image_status"] | null
          raw_analysis_result: Json | null
          style_embedding: string | null
          vision_colors: Json | null
          vision_labels: Json | null
          vision_objects: Json | null
          vision_text: string | null
        }
        Insert: {
          confidence_score?: number | null
          content_embedding?: string | null
          embedding?: string | null
          error_message?: string | null
          image_id: string
          nsfw_score?: number | null
          processed_at?: string | null
          processing_status?: Database["public"]["Enums"]["image_status"] | null
          raw_analysis_result?: Json | null
          style_embedding?: string | null
          vision_colors?: Json | null
          vision_labels?: Json | null
          vision_objects?: Json | null
          vision_text?: string | null
        }
        Update: {
          confidence_score?: number | null
          content_embedding?: string | null
          embedding?: string | null
          error_message?: string | null
          image_id?: string
          nsfw_score?: number | null
          processed_at?: string | null
          processing_status?: Database["public"]["Enums"]["image_status"] | null
          raw_analysis_result?: Json | null
          style_embedding?: string | null
          vision_colors?: Json | null
          vision_labels?: Json | null
          vision_objects?: Json | null
          vision_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "image_metadata_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: true
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
        Row: {
          created_at: string
          file_size_bytes: number
          format: string
          hash: string
          height: number
          id: string
          is_nsfw: boolean | null
          metadata: Json | null
          public_url: string | null
          storage_path: string
          width: number
        }
        Insert: {
          created_at?: string
          file_size_bytes: number
          format: string
          hash: string
          height: number
          id?: string
          is_nsfw?: boolean | null
          metadata?: Json | null
          public_url?: string | null
          storage_path: string
          width: number
        }
        Update: {
          created_at?: string
          file_size_bytes?: number
          format?: string
          hash?: string
          height?: number
          id?: string
          is_nsfw?: boolean | null
          metadata?: Json | null
          public_url?: string | null
          storage_path?: string
          width?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: number | null
          full_name: string | null
          id: string
          role: string | null
          subscription_expires_at: string | null
          subscription_tier: string | null
          total_generations: number | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: number | null
          full_name?: string | null
          id: string
          role?: string | null
          subscription_expires_at?: string | null
          subscription_tier?: string | null
          total_generations?: number | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: number | null
          full_name?: string | null
          id?: string
          role?: string | null
          subscription_expires_at?: string | null
          subscription_tier?: string | null
          total_generations?: number | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      reference_images: {
        Row: {
          created_at: string
          id: string
          image_id: string | null
          last_used_at: string
          original_filename: string | null
          preprocessing_applied: Json | null
          purpose: string | null
          usage_count: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_id?: string | null
          last_used_at?: string
          original_filename?: string | null
          preprocessing_applied?: Json | null
          purpose?: string | null
          usage_count?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_id?: string | null
          last_used_at?: string
          original_filename?: string | null
          preprocessing_applied?: Json | null
          purpose?: string | null
          usage_count?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reference_images_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      active_reference_images: {
        Row: {
          created_at: string | null
          height: number | null
          id: string | null
          image_id: string | null
          last_used_at: string | null
          original_filename: string | null
          preprocessing_applied: Json | null
          public_url: string | null
          purpose: string | null
          usage_count: number | null
          user_id: string | null
          width: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reference_images_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
      user_generation_stats: {
        Row: {
          active_days: number | null
          avg_generation_time: number | null
          failed_generations: number | null
          successful_generations: number | null
          total_generations: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      image_status: "pending" | "processing" | "completed" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
