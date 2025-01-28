import type { GenerationSettings } from './replicate';

export type ImageSettings = {
  hf_loras?: string[];
  lora_scales?: number[];
  disable_safety_checker?: boolean;
}

export type ImageHistoryEntry = {
  url: string;
  settings: GenerationSettings;
  timestamp: number;
}

export type ImageHistoryState = {
  history: ImageHistoryEntry[];
  allHistory: ImageHistoryEntry[];
  isLoading: boolean;
}