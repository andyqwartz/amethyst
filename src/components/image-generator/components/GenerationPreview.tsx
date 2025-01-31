import React, { useState, useCallback } from 'react';
import { IconButton, Modal, Box, Tooltip } from '@mui/material';
import {
  ZoomIn,
  Download,
  Favorite,
  FavoriteBorder,
  Close
} from '@mui/icons-material';
import styled from '@emotion/styled';

interface GenerationPreviewProps {
  imageUrl: string;
  prompt: string;
  onFavorite?: (isFavorite: boolean) => void;
  isFavorite?: boolean;
}

const PreviewContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
`;

const PreviewImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ControlsOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 8px;
  display: flex;
  gap: 8px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%);
  border-radius: 8px 8px 0 0;
`;

const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  max-width: 90vw;
  max-height: 90vh;
  outline: none;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: calc(90vh - 32px);
  object-fit: contain;
`;

export const GenerationPreview: React.FC<GenerationPreviewProps> = ({
  imageUrl,
  prompt,
  onFavorite,
  isFavorite = false,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  const handleZoomToggle = useCallback(() => {
    setIsZoomed(prev => !prev);
  }, []);

  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  }, [imageUrl]);

  const handleFavoriteToggle = useCallback(() => {
    const newValue = !localFavorite;
    setLocalFavorite(newValue);
    onFavorite?.(newValue);
  }, [localFavorite, onFavorite]);

  return (
    <PreviewContainer>
      <ImageWrapper>
        <PreviewImage
          src={imageUrl}
          alt={prompt}
          loading="lazy"
        />
        <ControlsOverlay>
          <Tooltip title="Zoom">
            <IconButton
              onClick={handleZoomToggle}
              size="small"
              sx={{ color: 'white' }}
            >
              <ZoomIn />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download">
            <IconButton
              onClick={handleDownload}
              size="small"
              sx={{ color: 'white' }}
            >
              <Download />
            </IconButton>
          </Tooltip>
          {onFavorite && (
            <Tooltip title={localFavorite ? 'Remove from favorites' : 'Add to favorites'}>
              <IconButton
                onClick={handleFavoriteToggle}
                size="small"
                sx={{ color: 'white' }}
              >
                {localFavorite ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Tooltip>
          )}
        </ControlsOverlay>
      </ImageWrapper>

      <Modal
        open={isZoomed}
        onClose={handleZoomToggle}
        aria-labelledby="image-preview-modal"
      >
        <ModalContent>
          <Box sx={{ position: 'relative' }}>
            <IconButton
              onClick={handleZoomToggle}
              sx={{
                position: 'absolute',
                right: -8,
                top: -8,
                backgroundColor: 'white',
                '&:hover': { backgroundColor: '#f5f5f5' },
              }}
            >
              <Close />
            </IconButton>
            <ModalImage src={imageUrl} alt={prompt} />
          </Box>
        </ModalContent>
      </Modal>
    </PreviewContainer>
  );
};