export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Profile;
        Update: Partial<Profile>;
      };
      generated_images: {
        Row: GeneratedImage;
        Insert: GeneratedImage;
        Update: Partial<GeneratedImage>;
      };
      image_metadata: {
        Row: ImageMetadata;
        Insert: ImageMetadata;
        Update: Partial<ImageMetadata>;
      };
      user_generation_stats: {
        Row: UserGenerationStats;
        Insert: UserGenerationStats;
        Update: Partial<UserGenerationStats>;
      };
    };
    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
      };
    };
    Functions: {
      [key: string]: unknown;
    };
  };
};

import type { Profile, GeneratedImage, ImageMetadata, UserGenerationStats } from './database';
