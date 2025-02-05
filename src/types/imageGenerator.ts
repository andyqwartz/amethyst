export interface AdvancedSettingsProps {
  settings: {
    imageFormats?: string[];
    loras?: string[];
    numberOfImages?: number;
    promptStrength?: number;
    outputFormat?: string;
    outputQuality?: number;
  };
  onSettingsChange: (settings: any) => void;
  disabled?: boolean;
}