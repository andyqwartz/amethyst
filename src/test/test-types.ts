import type { User } from '@supabase/supabase-js';

export interface TestAuthHook {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  handleEmailAuth: (email: string, password: string, isSignUp: boolean) => Promise<any>;
  handleGithubAuth: () => Promise<any>;
  handleGoogleAuth: () => Promise<any>;
  checkAdminStatus: (userId: string | undefined) => Promise<boolean>;
  signOut: () => Promise<void>;
}

export interface TestUser extends User {
  factors: any[];
}

export type PostgrestResponse<T> = {
  data: T | null;
  error: Error | null;
};

export type PostgrestMockBuilder<T> = {
  select: (query?: string) => {
    order: (column: string, options?: { ascending?: boolean }) => Promise<PostgrestResponse<T[]>>;
    eq: (column: string, value: any) => Promise<PostgrestResponse<T[]>>;
  };
  update: (data: Partial<T>) => {
    eq: (column: string, value: any) => Promise<PostgrestResponse<T | null>>;
  };
  delete: () => {
    eq: (column: string, value: any) => Promise<PostgrestResponse<T | null>>;
  };
};

export type SupabaseMock = {
  from: <T>(table: string) => PostgrestMockBuilder<T>;
};
