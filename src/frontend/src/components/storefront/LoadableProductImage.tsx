import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LoadableProductImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
}

/**
 * A product image component that shows a placeholder until the real image loads,
 * preventing black/blank boxes on mobile Chrome during image decode/render.
 */
export default function LoadableProductImage({
  src,
  alt,
  className,
  placeholderSrc = '/assets/generated/watch-placeholder.dim_800x800.png',
}: LoadableProductImageProps) {
  const [imageSrc, setImageSrc] = useState(placeholderSrc);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Reset to placeholder when src changes
    setImageSrc(placeholderSrc);
    setIsLoaded(false);

    // Preload the actual image
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      // Keep placeholder on error
      setImageSrc(placeholderSrc);
      setIsLoaded(true);
    };
    
    img.src = src;

    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, placeholderSrc]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={cn(
        'w-full h-full object-cover transition-opacity duration-300',
        !isLoaded && 'opacity-70',
        className
      )}
    />
  );
}
