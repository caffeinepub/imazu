import type { Order } from '../backend';
import { getPaymentMethodLabel } from './payment';
import { PaymentMethod } from '../backend';

export function buildWhatsAppOrderMessage(order: Order): string {
  const items = order.lineItems
    .map((item, index) => `${index + 1}. Product ID: ${item.productId} - Qty: ${item.quantity} - Price: Rs. ${item.price}`)
    .join('\n');

  // Build payment section - only include Transaction ID for manual payments when present
  let paymentSection = `*Payment Method:* ${getPaymentMethodLabel(order.paymentMethod)}`;
  
  // Only show Transaction ID for manual payments (EasyPaisa/JazzCash) when it exists
  if (
    (order.paymentMethod === PaymentMethod.easyPaisa || order.paymentMethod === PaymentMethod.jazzCash) &&
    order.transactionId &&
    order.transactionId.trim() !== ''
  ) {
    paymentSection += `\nTransaction Id: ${order.transactionId}`;
  }

  const message = `
*New Order from iMazu*

*Order ID:* ${order.id}

*Customer Details:*
Name: ${order.customer.name}
Phone: ${order.customer.phone}
Address: ${order.customer.address}

*Order Items:*
${items}

*Order Summary:*
Subtotal: Rs. ${order.subtotal}
Delivery Fee: Rs. ${order.deliveryFee}
Total: Rs. ${order.total}

${paymentSection}

Thank you for shopping with iMazu!
  `.trim();

  return message;
}

export function getWhatsAppLink(order: Order, phoneNumber: string = '923313995870'): string {
  const message = buildWhatsAppOrderMessage(order);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
