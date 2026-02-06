import { Link } from '@tanstack/react-router';
import type { Product } from '../../backend';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPrimaryProductImage } from '../../utils/productImages';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getPrimaryProductImage(product.images);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback to placeholder if image fails to load
    e.currentTarget.src = '/assets/generated/watch-placeholder.dim_800x800.png';
  };

  return (
    <Link to="/product/$productId" params={{ productId: product.id.toString() }}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.name}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">Rs. {Number(product.price).toLocaleString()}</span>
          {product.active && <Badge variant="outline">Available</Badge>}
        </CardFooter>
      </Card>
    </Link>
  );
}
