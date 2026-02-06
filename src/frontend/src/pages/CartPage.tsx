import { useNavigate } from '@tanstack/react-router';
import { useCartStore } from '../state/cart';
import { getPrimaryProductImage } from '../utils/productImages';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import QuantityStepper from '../components/storefront/QuantityStepper';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();

  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="container px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center space-y-4">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-muted-foreground">Start shopping to add items to your cart</p>
            <Button onClick={() => navigate({ to: '/catalog' })}>Browse Catalog</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.product.id.toString()}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={getPrimaryProductImage(item.product.images)}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/generated/watch-placeholder.dim_800x800.png';
                    }}
                  />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-primary font-bold">Rs. {Number(item.product.price).toLocaleString()}</p>
                    <div className="flex items-center justify-between">
                      <QuantityStepper
                        value={item.quantity}
                        onChange={(qty) => updateQuantity(item.product.id, qty)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.product.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.product.id.toString()} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>Rs. {(Number(item.product.price) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Subtotal</span>
                  <span className="text-primary">Rs. {total.toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Delivery fee calculated at checkout</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full" onClick={() => navigate({ to: '/checkout' })}>
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
