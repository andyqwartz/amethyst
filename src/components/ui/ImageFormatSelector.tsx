import React from 'react';

interface ImageFormat {
  id: string;
  label: string;
  value: string;
}

interface ImageFormatSelectorProps {
  selectedFormat: string;
  onFormatChange: (format: string) => void;
  formats: ImageFormat[];
  className?: string;
}

const ImageFormatSelector: React.FC<ImageFormatSelectorProps> = ({
  selectedFormat,
  onFormatChange,
  formats,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {formats.map((format) => (
          <button
            key={format.id}
            onClick={() => onFormatChange(format.value)}
            className={`
              px-4 py-2 rounded-lg transition-all duration-200
              flex items-center justify-center
              border-2 
              ${
                selectedFormat === format.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50 hover:bg-primary/5'
              }
              focus:outline-none focus:ring-2 focus:ring-primary/30
            `}
            type="button"
            aria-label={`Select ${format.label} format`}
          >
            <span className="text-sm font-medium">{format.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageFormatSelector;