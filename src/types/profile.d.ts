
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

