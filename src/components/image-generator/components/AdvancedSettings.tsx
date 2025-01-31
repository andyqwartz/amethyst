import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  Text,
  VStack,
  HStack,
  Divider,
  useColorModeValue,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Icon,
} from '@chakra-ui/react';
import { FaSquare, FaPortrait, FaImage } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { ImageFormat } from '../../../types/image';
import { LoraSelector } from './LoraSelector';
import { ModelSelector } from './ModelSelector';
import { SamplerSelector } from './SamplerSelector';

interface FormatOption {
  value: ImageFormat;
  dimensions: { width: number; height: number };
  descriptionFr: string;
}

const formatOptions: FormatOption[] = [
  {
    value: 'square',
    dimensions: { width: 1024, height: 1024 },
    descriptionFr: 'Format carré (1024×1024) - Idéal pour les portraits et compositions centrées',
    icon: FaSquare,
    iconColor: '#8B5CF6'
  },
  {
    value: 'portrait',
    dimensions: { width: 864, height: 1152 },
    descriptionFr: 'Format portrait (864×1152) - Parfait pour les portraits en pied',
    icon: FaPortrait,
    iconColor: '#7C3AED'
  },
  {
    value: 'landscape',
    dimensions: { width: 1152, height: 864 },
    descriptionFr: 'Format paysage (1152×864) - Optimal pour les paysages',
    icon: FaImage,
    iconColor: '#6D28D9'
  }
];

const outputFormatOptions = [
  { value: 'webp', label: 'WebP (Recommandé)' },
  { value: 'png', label: 'PNG' },
  { value: 'jpg', label: 'JPEG' }
];

const FormatVisualizer: React.FC<{ format: FormatOption; isSelected: boolean }> = ({ format, isSelected }) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.700');
  const ratio = 100;
  const scale = Math.min(ratio / format.dimensions.width, ratio / format.dimensions.height);
  
  return (
    <Box
      p={4}
      borderRadius="md"
      bg={isSelected ? useColorModeValue('purple.50', 'purple.900') : bgColor}
      transition="all 0.2s"
    >
      <HStack spacing={3} mb={2}>
        <Icon
          as={format.icon}
          color={format.iconColor}
          boxSize={6}
        />
        <Box
          border="2px solid"
          borderColor={isSelected ? 'purple.500' : borderColor}
          width={`${format.dimensions.width * scale}px`}
          height={`${format.dimensions.height * scale}px`}
        />
      </HStack>
      <Text fontSize="sm" fontWeight={isSelected ? "medium" : "normal"} color={isSelected ? 'purple.500' : 'gray.500'}>
        {format.dimensions.width} × {format.dimensions.height}
      </Text>
      <Text fontSize="xs" color={isSelected ? 'purple.400' : 'gray.400'} fontStyle="italic">
        {format.descriptionFr}
      </Text>
    </Box>
  );
};

interface AdvancedSettingsProps {
  format: ImageFormat;
  onFormatChange: (format: ImageFormat) => void;
  model: string;
  onModelChange: (model: string) => void;
  sampler: string;
  onSamplerChange: (sampler: string) => void;
  loras: string[];
  onLorasChange: (loras: string[]) => void;
  numOutputs: number;
  onNumOutputsChange: (value: number) => void;
  promptStrength: number;
  onPromptStrengthChange: (value: number) => void;
  outputFormat: string;
  onOutputFormatChange: (format: string) => void;
  outputQuality: number;
  onOutputQualityChange: (quality: number) => void;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  format,
  onFormatChange,
  model,
  onModelChange,
  sampler,
  onSamplerChange,
  loras,
  onLorasChange,
  numOutputs,
  onNumOutputsChange,
  promptStrength,
  onPromptStrengthChange,
  outputFormat,
  onOutputFormatChange,
  outputQuality,
  onOutputQualityChange,
}) => {
  const { t } = useTranslation();
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <VStack
      spacing={8}
      w="full"
      bg={bgColor}
      p={6}
      borderRadius="lg"
      shadow="sm"
    >
      {/* 1. Image Format Selection */}
      <FormControl as={VStack} spacing={4} width="full">
        <FormLabel fontWeight="semibold" fontSize="lg" mb={0}>
          {t('imageGenerator.format.label')}
        </FormLabel>
        <Box width="full">
          <HStack spacing={4} justify="center" width="full">
            {formatOptions.map((option) => (
              <Box
                key={option.value}
                cursor="pointer"
                onClick={() => onFormatChange(option.value)}
                transition="all 0.2s"
                flex="1"
                maxW="250px"
              >
                <FormatVisualizer
                  format={option}
                  isSelected={format === option.value}
                />
              </Box>
            ))}
          </HStack>
        </Box>
      </FormControl>

      <Divider />

      {/* 2. LoRA Selection */}
      <FormControl as={VStack} spacing={4} width="full">
        <FormLabel fontWeight="semibold" fontSize="lg" mb={0}>
          {t('imageGenerator.loras.label')}
        </FormLabel>
        <LoraSelector
          selectedLoras={loras}
          onLorasChange={onLorasChange}
        />
      </FormControl>

      <Divider />

      {/* 3. Number of Outputs */}
      <FormControl as={VStack} spacing={4} width="full">
        <FormLabel fontWeight="semibold" fontSize="lg" mb={0}>
          {t('imageGenerator.numOutputs.label')}
        </FormLabel>
        <HStack width="full" spacing={4}>
          <NumberInput
            value={numOutputs}
            min={1}
            max={4}
            onChange={(_, value) => onNumOutputsChange(value)}
            size="lg"
            flex={1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text fontSize="md" color="gray.500">
            {t('imageGenerator.images')}
          </Text>
        </HStack>
      </FormControl>

      <Divider />

      {/* 4. Prompt Strength */}
      <FormControl as={VStack} spacing={4} width="full">
        <FormLabel fontWeight="semibold" fontSize="lg" mb={0}>
          {t('imageGenerator.promptStrength.label')}
        </FormLabel>
        <Box width="full" px={4}>
          <Slider
            value={promptStrength}
            min={0}
            max={1}
            step={0.1}
            onChange={onPromptStrengthChange}
            size="lg"
          >
            <SliderTrack bg="purple.100">
              <SliderFilledTrack bg="purple.500" />
            </SliderTrack>
            <SliderThumb boxSize={6} />
          </Slider>
          <Text fontSize="md" color="purple.500" mt={2} textAlign="center" fontWeight="medium">
            {promptStrength.toFixed(1)}
          </Text>
        </Box>
      </FormControl>

      <Divider />

      {/* 5. Output Format and Quality */}
      <FormControl as={VStack} spacing={6} width="full">
        <Box width="full">
          <FormLabel fontWeight="semibold" fontSize="lg" mb={4}>
            {t('imageGenerator.outputFormat.label')}
          </FormLabel>
          <Select
            value={outputFormat}
            onChange={(e) => onOutputFormatChange(e.target.value)}
            size="lg"
          >
            {outputFormatOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Box>
        
        <Box width="full">
          <FormLabel fontWeight="semibold" fontSize="lg" mb={4}>
            {t('imageGenerator.outputQuality.label')}
          </FormLabel>
          <Box px={4}>
            <Slider
              value={outputQuality}
              min={1}
              max={100}
              step={1}
              onChange={onOutputQualityChange}
              size="lg"
            >
              <SliderTrack bg="purple.100">
                <SliderFilledTrack bg="purple.500" />
              </SliderTrack>
              <SliderThumb boxSize={6} />
            </Slider>
            <Text fontSize="md" color="purple.500" mt={2} textAlign="center" fontWeight="medium">
              {outputQuality}%
            </Text>
          </Box>
        </Box>
      </FormControl>

      <Divider />

      {/* Other Parameters */}
      <FormControl>
        <FormLabel fontWeight="medium">
          {t('imageGenerator.model.label')}
        </FormLabel>
        <ModelSelector
          selectedModel={model}
          onModelChange={onModelChange}
        />
      </FormControl>

      <Divider />

      <FormControl>
        <FormLabel fontWeight="medium">
          {t('imageGenerator.sampler.label')}
        </FormLabel>
        <SamplerSelector
          selectedSampler={sampler}
          onSamplerChange={onSamplerChange}
        />
      </FormControl>
    </VStack>
  );
};
