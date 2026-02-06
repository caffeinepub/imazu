/**
 * Utility functions for handling product image URLs
 */

/**
 * Get the primary product image URL with fallback to placeholder
 * @param images - Array of image URLs from product
 * @returns The first valid image URL or placeholder
 */
export function getPrimaryProductImage(images: string[]): string {
  if (images.length === 0) {
    return '/assets/generated/watch-placeholder.dim_800x800.png';
  }
  
  const firstImage = images[0].trim();
  
  // Ensure local assets have leading slash
  if (firstImage && !firstImage.startsWith('http') && !firstImage.startsWith('/')) {
    return `/${firstImage}`;
  }
  
  return firstImage || '/assets/generated/watch-placeholder.dim_800x800.png';
}

/**
 * Normalize all product images to ensure proper URL format
 * @param images - Array of image URLs from product
 * @returns Array of normalized image URLs
 */
export function normalizeProductImages(images: string[]): string[] {
  if (images.length === 0) {
    return ['/assets/generated/watch-placeholder.dim_800x800.png'];
  }
  
  return images.map(img => {
    const trimmed = img.trim();
    // Ensure local assets have leading slash
    if (trimmed && !trimmed.startsWith('http') && !trimmed.startsWith('/')) {
      return `/${trimmed}`;
    }
    return trimmed;
  }).filter(Boolean);
}

/**
 * Override images for specific products with known broken paths
 * @param productName - Name of the product
 * @param images - Original image array
 * @returns Corrected image array for known products, or normalized original images
 */
export function getProductImages(productName: string, images: string[]): string[] {
  // Override for "Classy Watch For Men" with new working image set
  if (productName === "Classy Watch For Men") {
    return [
      '/assets/generated/imazu-classy-watch-01-front.dim_1000x1000.png',
      '/assets/generated/imazu-classy-watch-02-angle.dim_1000x1000.png',
      '/assets/generated/imazu-classy-watch-03-side.dim_1000x1000.png',
      '/assets/generated/imazu-classy-watch-04-dial-closeup.dim_1000x1000.png',
      '/assets/generated/imazu-classy-watch-05-strap-closeup.dim_1000x1000.png',
    ];
  }
  
  // For all other products including "Brown leather Luxury Watch For Unisex Rs. 19",
  // use the product's own images array from backend (no override)
  return normalizeProductImages(images);
}
