import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, Order, CustomerInfo, LineItem, PaymentMethod, UserProfile, OrderId, ProductId } from '../backend';
import { getProductImages } from '../utils/productImages';

export function useGetActiveProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['activeProducts'],
    queryFn: async () => {
      if (!actor) return [];
      const products = await actor.getActiveProducts();
      // Apply image normalization/override for each product
      return products.map(product => ({
        ...product,
        images: getProductImages(product.name, product.images),
      }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(productId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Product | null>({
    queryKey: ['product', productId?.toString()],
    queryFn: async () => {
      if (!actor || !productId) return null;
      try {
        const product = await actor.getProduct(productId);
        // Apply image normalization/override
        return {
          ...product,
          images: getProductImages(product.name, product.images),
        };
      } catch (error) {
        console.error('Error fetching product:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!productId,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customer,
      lineItems,
      subtotal,
      deliveryFee,
      paymentMethod,
      transactionId,
    }: {
      customer: CustomerInfo;
      lineItems: LineItem[];
      subtotal: bigint;
      deliveryFee: bigint;
      paymentMethod: PaymentMethod;
      transactionId?: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrder(customer, lineItems, subtotal, deliveryFee, paymentMethod, transactionId || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useGetOrder(orderId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Order | null>({
    queryKey: ['order', orderId?.toString()],
    queryFn: async () => {
      if (!actor || !orderId) return null;
      try {
        return await actor.getOrder(orderId);
      } catch (error) {
        console.error('Error fetching order:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!orderId,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
