import { useState } from 'react';

export const useImageUpload = (setReferenceImage: (image: string | null) => void) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setReferenceImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      if (e.target instanceof HTMLInputElement) {
        handleImageUpload({ target: e.target } as React.ChangeEvent<HTMLInputElement>);
      }
    };
    fileInput.click();
  };

  return {
    handleImageUpload,
    handleImageClick
  };
};