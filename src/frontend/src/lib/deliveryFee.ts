/**
 * Delivery fee calculation utilities
 */

import type { Product } from '../backend';

// Standard delivery fee in Rs.
export const STANDARD_DELIVERY_FEE = 200;

// Product name that qualifies for free delivery when purchased exclusively
const FREE_DELIVERY_PRODUCT_NAME = "Brown leather Luxury Watch For Unisex Rs. 19";

/**
 * Calculate delivery fee based on cart items
 * Returns Rs. 0 if cart contains only the free delivery product
 * Returns Rs. 200 otherwise
 */
export function calculateDeliveryFee(cartItems: Array<{ product: Product; quantity: number }>): number {
  if (cartItems.length === 0) {
    return STANDARD_DELIVERY_FEE;
  }

  // Check if cart contains only the free delivery product
  const hasOnlyFreeDeliveryProduct =
    cartItems.length === 1 && cartItems[0].product.name === FREE_DELIVERY_PRODUCT_NAME;

  return hasOnlyFreeDeliveryProduct ? 0 : STANDARD_DELIVERY_FEE;
}
