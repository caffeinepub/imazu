import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProduct } from '../hooks/useQueries';
import { useCartStore } from '../state/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import QuantityStepper from '../components/storefront/QuantityStepper';
import ProductImageGallery from '../components/storefront/ProductImageGallery';
import { Loader2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetailsPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const navigate = useNavigate();
  const { data: product, isLoading } = useGetProduct(BigInt(productId));
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success(`Added ${quantity} ${product.name} to cart`);
    }
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container px-4 py-16">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Product not found</p>
            <Button onClick={() => navigate({ to: '/catalog' })}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Catalog
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Images are already normalized by useGetProduct hook
  const productImages = product.images.length > 0 
    ? product.images 
    : ['/assets/generated/watch-placeholder.dim_800x800.png'];

  return (
    <div className="container px-4 py-8">
      <Button variant="ghost" onClick={() => navigate({ to: '/catalog' })} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Catalog
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <ProductImageGallery images={productImages} productName={product.name} />

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
              {product.active && <Badge variant="outline">Available</Badge>}
            </div>
            <p className="text-3xl font-bold text-primary">Rs. {Number(product.price).toLocaleString()}</p>
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Quantity</span>
                <QuantityStepper value={quantity} onChange={setQuantity} />
              </div>
              <Button size="lg" className="w-full" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✓ Secure checkout</p>
            <p>✓ Fast delivery across Pakistan</p>
            <p>✓ Cash on delivery available</p>
          </div>
        </div>
      </div>
    </div>
  );
}
