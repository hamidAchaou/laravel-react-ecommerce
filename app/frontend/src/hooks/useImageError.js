// src/hooks/useImageError.js
import { useState, useCallback } from "react";

export const useImageError = () => {
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = useCallback((imageKey, fallbackUrl) => {
    setImageErrors(prevErrors => ({
      ...prevErrors,
      [imageKey]: fallbackUrl
    }));
  }, []);

  const getImageSource = useCallback((imageKey, originalSrc, fallbackSrc) => {
    return imageErrors[imageKey] || originalSrc;
  }, [imageErrors]);

  return {
    handleImageError,
    getImageSource
  };
};