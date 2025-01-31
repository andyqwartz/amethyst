import React from 'react';
import { Box, Stack } from '@mui/material';
import ImageFormatsSelector from './ImageFormatsSelector';
import LoraSelector from './LoraSelector';
import NumberOfImagesSelector from './NumberOfImagesSelector';
import PromptStrengthSelector from './PromptStrengthSelector';
import OutputFormatSelector from './OutputFormatSelector';
import OutputQualitySelector from './OutputQualitySelector';
import { AdvancedSettingsProps } from '../../../types/imageGenerator';

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  settings,
  onSettingsChange,
  disabled = false,
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {/* Image Formats */}
        <ImageFormatsSelector
          selectedFormats={settings.imageFormats}
          onChange={(formats) =>
            onSettingsChange({ ...settings, imageFormats: formats })
          }
          disabled={disabled}
        />

        {/* Loras */}
        <LoraSelector
          selectedLoras={settings.loras}
          onChange={(loras) => onSettingsChange({ ...settings, loras })}
          disabled={disabled}
        />

        {/* Number of Images */}
        <NumberOfImagesSelector
          value={settings.numberOfImages}
          onChange={(numberOfImages) =>
            onSettingsChange({ ...settings, numberOfImages })
          }
          disabled={disabled}
        />

        {/* Prompt Strength */}
        <PromptStrengthSelector
          value={settings.promptStrength}
          onChange={(promptStrength) =>
            onSettingsChange({ ...settings, promptStrength })
          }
          disabled={disabled}
        />

        {/* Output Format */}
        <OutputFormatSelector
          value={settings.outputFormat}
          onChange={(outputFormat) =>
            onSettingsChange({ ...settings, outputFormat })
          }
          disabled={disabled}
        />

        {/* Output Quality */}
        <OutputQualitySelector
          value={settings.outputQuality}
          onChange={(outputQuality) =>
            onSettingsChange({ ...settings, outputQuality })
          }
          disabled={disabled}
        />
      </Stack>
    </Box>
  );
};

export default AdvancedSettings;