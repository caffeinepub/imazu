import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import LoadableProductImage from './LoadableProductImage';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Reset selected index when images change to prevent out-of-bounds
  useEffect(() => {
    if (selectedIndex >= images.length) {
      setSelectedIndex(0);
    }
  }, [images, selectedIndex]);
  
  // Ensure we always have at least one image to display
  const displayImages = images.length > 0 ? images : ['/assets/generated/watch-placeholder.dim_800x800.png'];
  
  // If only one image, show it without thumbnails
  if (displayImages.length <= 1) {
    return (
      <div className="aspect-square overflow-hidden rounded-lg bg-muted">
        <LoadableProductImage
          src={displayImages[0]}
          alt={productName}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square overflow-hidden rounded-lg bg-muted">
        <LoadableProductImage
          src={displayImages[selectedIndex]}
          alt={`${productName} - Image ${selectedIndex + 1}`}
        />
      </div>

      {/* Thumbnail Strip */}
      <div className="grid grid-cols-5 gap-2">
        {displayImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "aspect-square overflow-hidden rounded-md bg-muted border-2 transition-all",
              selectedIndex === index 
                ? "border-primary ring-2 ring-primary ring-offset-2" 
                : "border-transparent hover:border-muted-foreground/30"
            )}
          >
            <LoadableProductImage
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
