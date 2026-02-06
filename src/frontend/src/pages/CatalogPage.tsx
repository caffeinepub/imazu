import { useGetActiveProducts } from '../hooks/useQueries';
import ProductCard from '../components/storefront/ProductCard';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function CatalogPage() {
  const { data: products, isLoading, error } = useGetActiveProducts();

  if (isLoading) {
    return (
      <div className="container px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading watches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 py-16">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load products. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="container px-4 py-16">
        <Alert>
          <AlertTitle>No Products Available</AlertTitle>
          <AlertDescription>Check back soon for our latest collection of premium watches.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Watch Collection</h1>
        <p className="text-muted-foreground">Explore our curated selection of premium timepieces</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id.toString()} product={product} />
        ))}
      </div>
    </div>
  );
}
