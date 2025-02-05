export interface Database {
  public: {
    Tables: {
      images: {
        Row: {
          id: string
          created_at: string
          url: string
          user_id: string
          settings: any
          prompt: string | null
          negative_prompt: string | null
          guidance_scale: number | null
          steps: number | null
          seed: number | null
          num_outputs: number | null
          aspect_ratio: string | null
          output_format: string | null
          output_quality: number | null
          prompt_strength: number | null
          reference_image_url: string | null
          generation_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          url: string
          user_id: string
          settings?: any
          prompt?: string | null
          negative_prompt?: string | null
          guidance_scale?: number | null
          steps?: number | null
          seed?: number | null
          num_outputs?: number | null
          aspect_ratio?: string | null
          output_format?: string | null
          output_quality?: number | null
          prompt_strength?: number | null
          reference_image_url?: string | null
          generation_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          url?: string
          user_id?: string
          settings?: any
          prompt?: string | null
          negative_prompt?: string | null
          guidance_scale?: number | null
          steps?: number | null
          seed?: number | null
          num_outputs?: number | null
          aspect_ratio?: string | null
          output_format?: string | null
          output_quality?: number | null
          prompt_strength?: number | null
          reference_image_url?: string | null
          generation_id?: string | null
        }
      }
    }
  }
}