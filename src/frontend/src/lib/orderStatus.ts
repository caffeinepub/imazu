import { OrderStatus } from '../backend';

export function getOrderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.pending:
      return 'Pending';
    case OrderStatus.paymentVerified:
      return 'Payment Verified';
    case OrderStatus.confirmed:
      return 'Confirmed';
    case OrderStatus.delivered:
      return 'Delivered';
    case OrderStatus.cancelled:
      return 'Cancelled';
    default:
      return 'Unknown';
  }
}

export function getOrderStatusBadgeVariant(
  status: OrderStatus
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case OrderStatus.delivered:
      return 'default';
    case OrderStatus.cancelled:
      return 'destructive';
    default:
      return 'outline';
  }
}
