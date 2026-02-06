import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCartStore } from '../../state/cart';
import { useCreateOrder } from '../../hooks/useQueries';
import { PaymentMethod } from '../../backend';
import { EASYPAYSA_NUMBER, MANUAL_PAYMENT_INSTRUCTION } from '../../lib/payment';
import { calculateDeliveryFee } from '../../lib/deliveryFee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutForm() {
  const navigate = useNavigate();
  const { items, clearCart, getTotal } = useCartStore();
  const createOrderMutation = useCreateOrder();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'cashOnDelivery' as 'cashOnDelivery' | 'easyPaisa',
    transactionId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = getTotal();
  const deliveryFee = calculateDeliveryFee(items);
  const total = subtotal + deliveryFee;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required';
    }

    if (formData.paymentMethod === 'easyPaisa' && !formData.transactionId.trim()) {
      newErrors.transactionId = 'Transaction ID is required for manual payment';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const lineItems = items.map((item) => ({
        productId: item.product.id,
        quantity: BigInt(item.quantity),
        price: item.product.price,
      }));

      const paymentMethod =
        formData.paymentMethod === 'cashOnDelivery' ? PaymentMethod.cashOnDelivery : PaymentMethod.easyPaisa;

      // Only send transactionId for manual payments
      const transactionId =
        formData.paymentMethod === 'easyPaisa' ? formData.transactionId.trim() : null;

      const order = await createOrderMutation.mutateAsync({
        customer: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        },
        lineItems,
        subtotal: BigInt(subtotal),
        deliveryFee: BigInt(deliveryFee),
        paymentMethod,
        transactionId,
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate({ to: '/order-confirmation/$orderId', params: { orderId: order.id.toString() } });
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  const isManualPaymentSelected = formData.paymentMethod === 'easyPaisa';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
          <CardDescription>Please provide your delivery details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="03XX-XXXXXXX"
              className={errors.phone ? 'border-destructive' : ''}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter your complete delivery address"
              className={errors.address ? 'border-destructive' : ''}
            />
            {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Choose your preferred payment method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={formData.paymentMethod}
            onValueChange={(value) =>
              setFormData({ ...formData, paymentMethod: value as 'cashOnDelivery' | 'easyPaisa', transactionId: '' })
            }
          >
            <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent">
              <RadioGroupItem value="cashOnDelivery" id="cod" />
              <Label htmlFor="cod" className="cursor-pointer flex-1">
                Cash on Delivery (COD)
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent">
              <RadioGroupItem value="easyPaisa" id="easypaisa" />
              <Label htmlFor="easypaisa" className="cursor-pointer flex-1">
                EasyPaisa/JazzCash (Manual)
              </Label>
            </div>
          </RadioGroup>

          {isManualPaymentSelected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium mb-2">{MANUAL_PAYMENT_INSTRUCTION}</p>
                <p className="text-lg font-bold text-primary">EasyPaisa Number: {EASYPAYSA_NUMBER}</p>
              </AlertDescription>
            </Alert>
          )}

          {isManualPaymentSelected && (
            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID *</Label>
              <Input
                id="transactionId"
                value={formData.transactionId}
                onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                placeholder="Enter your transaction ID"
                className={errors.transactionId ? 'border-destructive' : ''}
              />
              {errors.transactionId && <p className="text-sm text-destructive">{errors.transactionId}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rs. {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
              {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toLocaleString()}`}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total</span>
            <span className="text-primary">Rs. {total.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={createOrderMutation.isPending}>
        {createOrderMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Placing Order...
          </>
        ) : (
          'Place Order'
        )}
      </Button>
    </form>
  );
}
