/**
 * Delivery fee calculation utilities
 */

import type { Product } from '../backend';

// Standard delivery fee in Rs.
export const STANDARD_DELIVERY_FEE = 200;

/**
 * Calculate delivery fee based on cart items
 * Returns Rs. 200 for all orders
 */
export function calculateDeliveryFee(cartItems: Array<{ product: Product; quantity: number }>): number {
  return STANDARD_DELIVERY_FEE;
}
