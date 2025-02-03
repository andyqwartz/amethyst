export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  is_admin: boolean;
  credits_balance: number;
  subscription_tier: string;
  language: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
} 