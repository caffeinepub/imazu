import { useNavigate } from '@tanstack/react-router';
import { useCartStore } from '../state/cart';
import CheckoutForm from '../components/checkout/CheckoutForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);

  if (items.length === 0) {
    return (
      <div className="container px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-muted-foreground">Add items to your cart before checking out</p>
            <Button onClick={() => navigate({ to: '/catalog' })}>Browse Catalog</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 max-w-2xl mx-auto">
      <Button variant="ghost" onClick={() => navigate({ to: '/cart' })} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cart
      </Button>

      <h1 className="text-3xl md:text-4xl font-bold mb-8">Checkout</h1>

      <CheckoutForm />
    </div>
  );
}
