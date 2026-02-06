import { useNavigate } from '@tanstack/react-router';
import { useGetAllProducts, useDeactivateProduct } from '../../hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Loader2, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const { data: products, isLoading } = useGetAllProducts();
  const deactivateMutation = useDeactivateProduct();

  const handleDeactivate = async (productId: bigint) => {
    try {
      await deactivateMutation.mutateAsync(productId);
      toast.success('Product deactivated successfully');
    } catch (error) {
      console.error('Error deactivating product:', error);
      toast.error('Failed to deactivate product');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your watch inventory</p>
        </div>
        <Button onClick={() => navigate({ to: '/admin/products/create' })}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {!products || products.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No products yet</p>
            <Button onClick={() => navigate({ to: '/admin/products/create' })}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id.toString()}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            product.images.length > 0
                              ? product.images[0]
                              : '/assets/generated/watch-placeholder.dim_800x800.png'
                          }
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>Rs. {Number(product.price).toLocaleString()}</TableCell>
                    <TableCell>
                      {product.active ? (
                        <Badge variant="outline">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate({ to: '/admin/products/edit/$productId', params: { productId: product.id.toString() } })
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {product.active && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeactivate(product.id)}
                            disabled={deactivateMutation.isPending}
                          >
                            <EyeOff className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
