import { useState } from 'react'
import { AuthError, Provider, AuthResponse as SupabaseAuthResponse } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

interface AuthResponse {
  success: boolean
  error: string | null
  data?: SupabaseAuthResponse['data']
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailAuth = async (
    email: string,
    password: string,
    isSignUp: boolean
  ): Promise<AuthResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = isSignUp
        ? await supabase.auth.signUp({
            email,
            password,
          })
        : await supabase.auth.signInWithPassword({
            email,
            password,
          })

      if (error) throw error

      return {
        success: true,
        error: null,
        data: data
      }
    } catch (err) {
      const error = err as AuthError
      setError(error.message)
      return {
        success: false,
        error: error.message,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubAuth = async (): Promise<AuthResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github' as Provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      return {
        success: true,
        error: null,
        data: data
      }
    } catch (err) {
      const error = err as AuthError
      setError(error.message)
      return {
        success: false,
        error: error.message,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async (): Promise<AuthResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      return {
        success: true,
        error: null,
      }
    } catch (err) {
      const error = err as AuthError
      setError(error.message)
      return {
        success: false,
        error: error.message,
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    handleEmailAuth,
    handleGithubAuth,
    signOut,
  }
}
