import { ReplicateInput } from '@/types/replicate';

const REPLICATE_API_URL = 'https://api.replicate.com/v1';

interface PredictionResponse {
  id: string;
  status: string;
  output?: string[];
  error?: string;
}

export class ReplicateClient {
  private readonly apiToken: string;
  private readonly modelVersion: string;

  constructor(apiToken: string, modelVersion: string) {
    this.apiToken = apiToken;
    this.modelVersion = modelVersion;
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
      'Authorization': `Token ${this.apiToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }

  async createPrediction(input: ReplicateInput): Promise<PredictionResponse> {
    try {
      const response = await this.fetchWithAuth(`${REPLICATE_API_URL}/predictions`, {
        method: 'POST',
        body: JSON.stringify({
          version: this.modelVersion,
          input: {
            ...input,
            hf_loras: input.hf_loras || [],
            image: input.image || null,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create prediction');
      }

      const data = await response.json();
      return {
        id: data.id,
        status: data.status,
      };
    } catch (error) {
      console.error('Error creating prediction:', error);
      throw error;
    }
  }

  async getPredictionStatus(predictionId: string): Promise<PredictionResponse> {
    try {
      const response = await this.fetchWithAuth(
        `${REPLICATE_API_URL}/predictions/${predictionId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get prediction status');
      }

      const data = await response.json();
      return {
        id: data.id,
        status: data.status,
        output: data.output,
        error: data.error,
      };
    } catch (error) {
      console.error('Error getting prediction status:', error);
      throw error;
    }
  }

  async cancelPrediction(predictionId: string): Promise<void> {
    try {
      const response = await this.fetchWithAuth(
        `${REPLICATE_API_URL}/predictions/${predictionId}/cancel`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to cancel prediction');
      }
    } catch (error) {
      console.error('Error canceling prediction:', error);
      throw error;
    }
  }
}

export const createReplicateClient = (apiToken: string, modelVersion: string): ReplicateClient => {
  return new ReplicateClient(apiToken, modelVersion);
};