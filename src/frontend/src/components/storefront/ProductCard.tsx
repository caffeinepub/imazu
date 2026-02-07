import { Link } from '@tanstack/react-router';
import type { Product } from '../../backend';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPrimaryProductImage } from '../../utils/productImages';
import LoadableProductImage from './LoadableProductImage';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getPrimaryProductImage(product.images);

  return (
    <Link to="/product/$productId" params={{ productId: product.id.toString() }}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
        <div className="aspect-square overflow-hidden bg-muted">
          <LoadableProductImage
            src={imageUrl}
            alt={product.name}
            className="group-hover:scale-105 transition-transform duration-300"
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
