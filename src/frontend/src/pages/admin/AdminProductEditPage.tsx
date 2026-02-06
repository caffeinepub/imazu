import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProduct } from '../../hooks/useQueries';
import { useCreateProduct, useUpdateProduct } from '../../hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProductEditPage() {
  const params = useParams({ strict: false });
  const navigate = useNavigate();
  const productId = params.productId ? BigInt(params.productId) : undefined;
  const { data: existingProduct, isLoading: loadingProduct } = useGetProduct(productId);
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    images: '',
    active: true,
  });

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name,
        description: existingProduct.description,
        price: Number(existingProduct.price).toString(),
        images: existingProduct.images.join('\n'),
        active: existingProduct.active,
      });
    }
  }, [existingProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const price = parseInt(formData.price);
    if (isNaN(price) || price < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const images = formData.images
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    try {
      if (productId) {
        await updateMutation.mutateAsync({
          id: productId,
          name: formData.name,
          description: formData.description,
          price: BigInt(price),
          images,
          active: formData.active,
        });
        toast.success('Product updated successfully');
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          description: formData.description,
          price: BigInt(price),
          images,
        });
        toast.success('Product created successfully');
      }
      navigate({ to: '/admin/products' });
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  if (loadingProduct) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate({ to: '/admin/products' })}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{productId ? 'Edit Product' : 'Create Product'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Luxury Chronograph Watch"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the watch features and specifications"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (Rs.) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g., 25000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Image URLs (one per line)</Label>
              <Textarea
                id="images"
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                placeholder="https://example.com/image1.jpg"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Enter image URLs, one per line. Leave empty to use placeholder.
              </p>
            </div>

            {productId && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="active">Active (visible to customers)</Label>
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/admin/products' })}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : productId ? (
                  'Update Product'
                ) : (
                  'Create Product'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
