import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetOrder } from '../../hooks/useQueries';
import {
  useVerifyPayment,
  useConfirmOrder,
  useMarkOrderDelivered,
  useCancelOrder,
} from '../../hooks/useAdmin';
import { getPaymentMethodLabel } from '../../lib/payment';
import { getOrderStatusLabel, getOrderStatusBadgeVariant } from '../../lib/orderStatus';
import { OrderStatus } from '../../backend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, CheckCircle, Truck, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams({ from: '/admin/orders/$orderId' });
  const navigate = useNavigate();
  const { data: order, isLoading } = useGetOrder(BigInt(orderId));
  const verifyPaymentMutation = useVerifyPayment();
  const confirmOrderMutation = useConfirmOrder();
  const markDeliveredMutation = useMarkOrderDelivered();
  const cancelMutation = useCancelOrder();
  const [transactionId, setTransactionId] = useState('');

  const handleVerifyPayment = async () => {
    if (!transactionId.trim()) {
      toast.error('Please enter a transaction ID');
      return;
    }

    try {
      await verifyPaymentMutation.mutateAsync({ id: BigInt(orderId), transactionId });
      toast.success('Payment verified successfully');
      setTransactionId('');
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Failed to verify payment');
    }
  };

  const handleConfirmOrder = async () => {
    try {
      await confirmOrderMutation.mutateAsync(BigInt(orderId));
      toast.success('Order confirmed successfully');
    } catch (error) {
      console.error('Error confirming order:', error);
      toast.error('Failed to confirm order');
    }
  };

  const handleMarkDelivered = async () => {
    try {
      await markDeliveredMutation.mutateAsync(BigInt(orderId));
      toast.success('Order marked as delivered');
    } catch (error) {
      console.error('Error marking order as delivered:', error);
      toast.error('Failed to update order');
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await cancelMutation.mutateAsync(BigInt(orderId));
      toast.success('Order cancelled');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/admin/orders' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Order not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPending = order.status === OrderStatus.pending;
  const isPaymentVerified = order.status === OrderStatus.paymentVerified;
  const isConfirmed = order.status === OrderStatus.confirmed;
  const isDelivered = order.status === OrderStatus.delivered;
  const isCancelled = order.status === OrderStatus.cancelled;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate({ to: '/admin/orders' })}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.id.toString()}</h1>
          <p className="text-muted-foreground">
            Placed on {new Date(Number(order.createdAt) / 1000000).toLocaleDateString()}
          </p>
        </div>
        <Badge variant={getOrderStatusBadgeVariant(order.status)}>
          {getOrderStatusLabel(order.status)}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{order.customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{order.customer.phone}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Delivery Address</p>
            <p className="font-medium">{order.customer.address}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.lineItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">Product #{item.productId.toString()}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity.toString()}</p>
                </div>
                <p className="font-medium">Rs. {Number(item.price).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>Rs. {Number(order.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery Fee</span>
              <span>Rs. {Number(order.deliveryFee).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">Rs. {Number(order.total).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Payment Method</p>
            <p className="font-medium">{getPaymentMethodLabel(order.paymentMethod)}</p>
          </div>
          {order.transactionId && (
            <div>
              <p className="text-sm text-muted-foreground">Transaction ID</p>
              <p className="font-medium">{order.transactionId}</p>
            </div>
          )}

          {isPending && (
            <div className="space-y-2 pt-4 border-t">
              <Label htmlFor="txnId">Verify Payment (Enter Transaction ID)</Label>
              <div className="flex space-x-2">
                <Input
                  id="txnId"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Transaction ID"
                />
                <Button onClick={handleVerifyPayment} disabled={verifyPaymentMutation.isPending}>
                  {verifyPaymentMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {!isCancelled && !isDelivered && (
        <Card>
          <CardHeader>
            <CardTitle>Order Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            {isPaymentVerified && (
              <Button onClick={handleConfirmOrder} disabled={confirmOrderMutation.isPending}>
                {confirmOrderMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Confirm Order
              </Button>
            )}
            {isConfirmed && (
              <Button onClick={handleMarkDelivered} disabled={markDeliveredMutation.isPending}>
                {markDeliveredMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Truck className="mr-2 h-4 w-4" />
                )}
                Mark as Delivered
              </Button>
            )}
            <Button variant="destructive" onClick={handleCancel} disabled={cancelMutation.isPending}>
              {cancelMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="mr-2 h-4 w-4" />
              )}
              Cancel Order
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
