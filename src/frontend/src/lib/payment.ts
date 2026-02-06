import { PaymentMethod } from '../backend';

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cashOnDelivery: 'Cash on Delivery (COD)',
  easyPaisa: 'EasyPaisa/JazzCash (Manual)',
  jazzCash: 'EasyPaisa/JazzCash (Manual)',
};

export const EASYPAYSA_NUMBER = '0331-3995870';

export const MANUAL_PAYMENT_INSTRUCTION =
  'Please send payment to our EasyPaisa/JazzCash number and enter Transaction ID below to confirm your order.';

export function isManualPayment(method: PaymentMethod): boolean {
  return method === PaymentMethod.easyPaisa || method === PaymentMethod.jazzCash;
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  return PAYMENT_METHOD_LABELS[method] || method;
}
