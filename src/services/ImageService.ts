import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { supabase } from '@/lib/supabase/client';

interface GenerationResponse {
  id: string;
  status: string;
  output?: string[];
  error?: string;
}

interface HistoryEntry {
  id: string;
  created_at: string;
  prompt: string;
  image_url: string;
  user_id: string;
  model: string;
}

export class ImageService {
  private supabase;
  private replicateApiKey: string;
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    this.supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    this.replicateApiKey = process.env.REPLICATE_API_TOKEN || '';
    this.supabase = supabase;
  }

  private async getAuthHeaders(): Promise<Headers> {
    const headers = new Headers();
    headers.append('Authorization', `Token ${this.replicateApiKey}`);
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  async generateImage(prompt: string, model: string): Promise<GenerationResponse> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        version: model,
        input: { prompt }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to generate image: ${response.statusText}`);
    }

    return response.json();
  }

  async checkGenerationProgress(id: string): Promise<GenerationResponse> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers
    });

    if (!response.ok) {
      throw new Error(`Failed to check generation progress: ${response.statusText}`);
    }

    return response.json();
  }

  async saveToHistory(entry: Omit<HistoryEntry, 'id' | 'created_at'>): Promise<void> {
    const { error } = await this.supabase
      .from('image_history')
      .insert([entry]);

    if (error) {
      throw new Error(`Failed to save to history: ${error.message}`);
    }
  }

  async fetchHistory(userId: string): Promise<HistoryEntry[]> {
    const { data, error } = await this.supabase
      .from('image_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch history: ${error.message}`);
    }

    return data || [];
  }

  async deleteFromHistory(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('image_history')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete from history: ${error.message}`);
    }
  }

  private transformHistoryEntry(data: any): HistoryEntry {
    return {
      id: data.id,
      created_at: data.created_at,
      prompt: data.prompt,
      image_url: data.image_url,
      user_id: data.user_id,
      model: data.model
    };
  }

  async getCurrentUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser();
    
    if (error) {
      throw new Error(`Failed to get current user: ${error.message}`);
    }

    return user;
  }
}