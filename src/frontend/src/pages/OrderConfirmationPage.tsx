import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetOrder } from '../hooks/useQueries';
import { getWhatsAppLink } from '../lib/whatsapp';
import { getPaymentMethodLabel } from '../lib/payment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, MessageCircle, Home } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { PaymentMethod } from '../backend';

export default function OrderConfirmationPage() {
  const { orderId } = useParams({ from: '/order-confirmation/$orderId' });
  const navigate = useNavigate();
  const { data: order, isLoading } = useGetOrder(BigInt(orderId));

  if (isLoading) {
    return (
      <div className="container px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-muted-foreground">Order not found</p>
            <Button onClick={() => navigate({ to: '/' })}>
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const whatsappLink = getWhatsAppLink(order);

  // Only show Transaction ID for manual payments (EasyPaisa/JazzCash) when it exists
  const shouldShowTransactionId =
    (order.paymentMethod === PaymentMethod.easyPaisa || order.paymentMethod === PaymentMethod.jazzCash) &&
    order.transactionId &&
    order.transactionId.trim() !== '';

  return (
    <div className="container px-4 py-8 max-w-2xl mx-auto">
      <div className="text-center mb-8 space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground">Thank you for your order. We'll process it shortly.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Order #{order.id.toString()}</span>
              <Badge>{order.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Name:</span> {order.customer.name}
                </p>
                <p>
                  <span className="text-muted-foreground">Phone:</span> {order.customer.phone}
                </p>
                <p>
                  <span className="text-muted-foreground">Address:</span> {order.customer.address}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Order Items</h3>
              <div className="space-y-2">
                {order.lineItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Product #{item.productId.toString()} × {item.quantity.toString()}
                    </span>
                    <span>Rs. {Number(item.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
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

            <div className="border-t pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium">{getPaymentMethodLabel(order.paymentMethod)}</span>
              </div>
              {shouldShowTransactionId && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-medium">{order.transactionId}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start space-x-3">
              <MessageCircle className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Send Order Details via WhatsApp</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Click below to send your order details to us on WhatsApp for faster processing
                </p>
                <Button asChild className="w-full" size="lg">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <SiWhatsapp className="mr-2 h-5 w-5" />
                    Send Order on WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="flex-1" onClick={() => navigate({ to: '/catalog' })}>
            Continue Shopping
          </Button>
          <Button className="flex-1" onClick={() => navigate({ to: '/' })}>
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
