import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Admin from '@/pages/Admin';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';
import type { Profile, GeneratedImage } from '@/types/database';
import type { TestUser, TestAuthHook, PostgrestResponse, PostgrestMockBuilder } from '@/test/test-types';
import { useNavigate } from 'react-router-dom';
import type { PostgrestQueryBuilder } from '@supabase/postgrest-js';

// Mock the hooks
vi.mock('@/hooks/use-auth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Mock data
const mockProfiles: Profile[] = [
  {
    id: '1',
    email: 'user@example.com',
    full_name: 'Test User',
    avatar_url: null,
    auth_provider: 'email',
    provider_id: null,
    google_id: null,
    apple_id: null,
    github_id: null,
    stripe_customer_id: null,
    phone_number: null,
    language: 'fr',
    theme: 'dark',
    is_admin: false,
    is_banned: false,
    email_verified: true,
    phone_verified: false,
    needs_attention: false,
    notifications_enabled: true,
    marketing_emails_enabled: true,
    ads_enabled: false,
    subscription_tier: 'free',
    subscription_status: 'active',
    subscription_end_date: null,
    credits_balance: 100,
    lifetime_credits: 200,
    ads_credits_earned: 0,
    ads_watched_today: 0,
    daily_ads_limit: 5,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    last_sign_in_at: null,
    role: 'user',
    username: 'testuser',
    last_credit_update: '2025-01-01T00:00:00Z',
    ads_last_watched: null,
    last_login: null
  }
];

const mockImages: GeneratedImage[] = [
  {
    id: '1',
    user_id: '1',
    image_id: 'img-1',
    created_at: '2025-01-01T00:00:00Z',
    started_at: '2025-01-01T00:00:00Z',
    completed_at: '2025-01-01T00:00:01Z',
    prompt: 'Test prompt',
    negative_prompt: '',
    width: 512,
    height: 512,
    num_inference_steps: 20,
    guidance_scale: 7.5,
    prompt_strength: 1,
    seed: null,
    status: 'completed',
    error_message: null,
    output_format: 'png',
    output_quality: 90,
    credits_cost: 1,
    scheduler: 'DPMSolverMultistepScheduler',
    strength: 0.75,
    num_outputs: 1,
    aspect_ratio: '1:1',
    hf_loras: [],
    lora_scales: [],
    disable_safety_checker: false,
    reference_image_id: null,
    reference_image_strength: 0,
    model_version: 'latest',
    generation_time: null,
    raw_parameters: {},
    parameter_history: [],
    // Legacy properties
    output_url: null,
    model_id: 'test-model',
    processing_time: null
  },
];

const mockUser: TestUser = {
  id: 'admin-id',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2025-01-01T00:00:00Z',
  role: 'authenticated',
  updated_at: '2025-01-01T00:00:00Z',
  email: 'admin@example.com',
  phone: null,
  confirmation_sent_at: null,
  confirmed_at: null,
  last_sign_in_at: null,
  email_confirmed_at: null,
  phone_confirmed_at: null,
  factors: [],
};

describe('Admin Component', () => {
  beforeEach(() => {
    // Setup default mocks
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      isAdmin: true,
      isLoading: false,
      isAuthenticated: true,
      handleEmailAuth: vi.fn(),
      handleGithubAuth: vi.fn(),
      handleGoogleAuth: vi.fn(),
      checkAdminStatus: vi.fn(),
      signOut: vi.fn(),
    } as unknown as TestAuthHook);

    vi.mocked(useToast).mockReturnValue({
      toast: vi.fn(),
      dismiss: vi.fn(),
      toasts: [],
    });

    // Reset Supabase mock
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<Admin />);
    expect(screen.getByText('Chargement des données...')).toBeInTheDocument();
  });

  it('redirects if user is not admin', () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    vi.mocked(useAuth).mockReturnValue({
      user: { ...mockUser, id: 'user-id' },
      isAdmin: false,
      isLoading: false,
      isAuthenticated: false,
      handleEmailAuth: vi.fn(),
      handleGithubAuth: vi.fn(),
      checkAdminStatus: vi.fn(),
      signOut: vi.fn(),
    } as unknown as TestAuthHook);

    render(<Admin />);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('fetches and displays data', async () => {
    const mockResponse: PostgrestResponse<Profile[]> = {
      data: mockProfiles,
      error: null,
    };

    const mockBuilder = {
      select: () => ({
        order: () => Promise.resolve(mockResponse),
        eq: () => Promise.resolve(mockResponse),
      }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    } as unknown as PostgrestQueryBuilder<any, any, any, any>;

    vi.mocked(supabase.from).mockReturnValue(mockBuilder);

    render(<Admin />);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  it('handles ban user action', async () => {
    const mockUpdate = vi.fn().mockResolvedValue({ data: null, error: null });
    const mockBuilder = {
      select: () => ({
        order: () => Promise.resolve({ data: mockProfiles, error: null }),
        eq: () => Promise.resolve({ data: mockProfiles, error: null }),
      }),
      update: () => ({
        eq: mockUpdate,
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    } as unknown as PostgrestQueryBuilder<any, any, any, any>;

    vi.mocked(supabase.from).mockReturnValue(mockBuilder);

    render(<Admin />);

    await waitFor(() => {
      const banButton = screen.getByRole('button', { name: /bannir/i });
      fireEvent.click(banButton);
    });

    const confirmButton = screen.getByRole('button', { name: /confirmer/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  it('handles delete image action', async () => {
    const mockDelete = vi.fn().mockResolvedValue({ data: null, error: null });
    const mockBuilder = {
      select: () => ({
        order: () => Promise.resolve({ data: mockImages, error: null }),
        eq: () => Promise.resolve({ data: mockImages, error: null }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
      delete: () => ({
        eq: mockDelete,
      }),
    } as unknown as PostgrestQueryBuilder<any, any, any, any>;

    vi.mocked(supabase.from).mockReturnValue(mockBuilder);

    render(<Admin />);

    // Switch to images tab
    const imagesTab = screen.getByRole('tab', { name: /images/i });
    fireEvent.click(imagesTab);

    await waitFor(() => {
      const deleteButton = screen.getByRole('button', { name: /supprimer/i });
      fireEvent.click(deleteButton);
    });

    const confirmButton = screen.getByRole('button', { name: /confirmer/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalled();
    });
  });

  it('handles filter changes', async () => {
    render(<Admin />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Chargement des données...')).not.toBeInTheDocument();
    });

    // Test user filter
    const filterSelect = screen.getByRole('combobox', { name: /filtrer/i });
    fireEvent.change(filterSelect, { target: { value: 'admin' } });

    // Test search
    const searchInput = screen.getByPlaceholderText(/rechercher/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });

    // Verify filtered results are displayed
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('displays error toast on API failure', async () => {
    const mockToast = vi.fn();
    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });

    const mockBuilder = {
      select: () => ({
        order: () => Promise.resolve({
          data: null,
          error: new Error('API Error'),
        }),
        eq: () => Promise.resolve({
          data: null,
          error: new Error('API Error'),
        }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    } as unknown as PostgrestQueryBuilder<any, any, any, any>;

    vi.mocked(supabase.from).mockReturnValue(mockBuilder);

    render(<Admin />);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        variant: 'destructive',
        title: 'Erreur',
      }));
    });
  });
});
