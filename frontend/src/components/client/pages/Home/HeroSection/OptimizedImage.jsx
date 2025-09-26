import React from 'react';

/**
 * OptimizedImage Component
 * A wrapper for the <picture> and <img> elements to handle modern formats (WebP),
 * responsiveness, lazy loading, and performance attributes (decoding/priority).
 *
 * @param {string} src - The primary image source (usually a high-res JPG or PNG fallback).
 * @param {string} alt - The alternative text for the image (Crucial for SEO/Accessibility).
 * @param {number} width - The intrinsic width of the image (prevents CLS).
 * @param {number} height - The intrinsic height of the image (prevents CLS).
 * @param {string} [srcSetWebP] - A string of WebP source set URLs for different screen sizes/resolutions.
 * @param {boolean} [priority=false] - If true, sets loading='eager' and decoding='sync' for critical LCP images.
 * @param {boolean} [lazy=true] - If true (and not priority), sets loading='lazy'.
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  srcSetWebP,
  priority = false,
  lazy = true,
  ...props // Allows passing any other <img> attributes
}) => {
  // Determine the correct loading and decoding strategy
  const loading = priority ? 'eager' : (lazy ? 'lazy' : undefined);
  const decoding = priority ? 'sync' : 'async';

  // Calculate aspect ratio for initial container height (good practice for CLS, though width/height on <img> helps most)
  const style = {
    aspectRatio: width && height ? `${width} / ${height}` : undefined,
    maxWidth: '100%',
    height: 'auto',
  };

  // The primary goal is to use <picture> to serve the optimized WebP format first.
  return (
    <picture>
      {/* 1. WebP Source (Best performance) */}
      {srcSetWebP && (
        <source
          srcSet={srcSetWebP}
          type="image/webp"
        />
      )}

      {/* 2. Fallback <img> (JPG/PNG) - The browser will only render this if it doesn't support <source> */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        style={style}
        {...props}
      />
    </picture>
  );
};

export default OptimizedImage;