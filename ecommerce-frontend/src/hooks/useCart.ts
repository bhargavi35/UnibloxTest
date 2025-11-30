import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import type { Cart, Product, AvailableDiscount } from '../types';
import { useState, useCallback, useEffect } from 'react';

const USER_ID = 'user-123';

export const useCart = () => {
  const queryClient = useQueryClient();
  const [discountError, setDiscountError] = useState('');
  const [availableDiscounts, setAvailableDiscounts] = useState<AvailableDiscount[]>([]);
  const [nextDiscountAt, setNextDiscountAt] = useState<number | null>(null);

  const { data: cart, isLoading: cartLoading, error: cartError } = useQuery<Cart>({
    queryKey: ['cart', USER_ID],
    queryFn: async () => {
      try {
        const response = await apiService.getCart(USER_ID);
        return response.data;
      } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: products, isLoading: productsLoading, error: productsError } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const response = await apiService.getProducts();
        return response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 30,
  });


  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      apiService.addToCart(USER_ID, productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', USER_ID] });
    },
    onError: (error) => {
      console.error('Add to cart error:', error);
    },
  });

  // Update cart item mutation
  const updateCartItemMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      apiService.updateCartItem(USER_ID, productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', USER_ID] });
    },
    onError: (error) => {
      console.error('Update cart item error:', error);
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: (productId: string) => apiService.removeFromCart(USER_ID, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', USER_ID] });
    },
    onError: (error) => {
      console.error('Remove from cart error:', error);
    },
  });

  // Apply discount mutation
  const applyDiscountMutation = useMutation({
    mutationFn: (code: string) => apiService.applyDiscount(USER_ID, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', USER_ID] });
      setDiscountError('');
      // Refresh available discounts after applying one
      loadAvailableDiscounts();
    },
    onError: (error: any) => {
      console.error('Apply discount error:', error);
      setDiscountError(error.response?.data?.error || 'Invalid discount code');
    },
  });

  // Remove discount mutation
  const removeDiscountMutation = useMutation({
    mutationFn: () => apiService.removeDiscount(USER_ID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', USER_ID] });
    },
    onError: (error) => {
      console.error('Remove discount error:', error);
    },
  });

  // ✅ ADD THIS: Query for available discounts
  const {
    data: discountsData,
    isLoading: discountsLoading,
    error: discountsError,
    refetch: refetchDiscounts
  } = useQuery({
    queryKey: ['available-discounts', USER_ID],
    queryFn: async () => {
      console.log('🔍 Fetching available discounts...');
      try {
        const response = await apiService.getAvailableDiscounts(USER_ID);
        console.log('✅ Available discounts response:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error fetching available discounts:', error);
        throw error;
      }
    },
    staleTime: 1000 * 30, // 30 seconds
  });

  // ✅ UPDATE: Use the discounts data
  const loadAvailableDiscounts = useCallback(async () => {
    console.log('🔄 Manually refreshing available discounts...');
    await refetchDiscounts();
  }, [refetchDiscounts]);

  // Update state when discounts data changes
  useEffect(() => {
    if (discountsData) {
      setAvailableDiscounts(discountsData.availableDiscounts || []);
      setNextDiscountAt(discountsData.nextDiscountAt ?? null);
      console.log('📋 Updated available discounts state:', discountsData.availableDiscounts?.length);
    }
  }, [discountsData]);


  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: () => apiService.checkout(USER_ID),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['cart', USER_ID] });

      // Show discount code if generated
      if (data.data.discountCode) {
        setTimeout(() => {
          alert(`🎉 Congratulations! You received a 10% discount code: ${data.data.discountCode}\n\nUse it on your next purchase!`);
        }, 500);
      }

      // Refresh available discounts after checkout
      setTimeout(() => {
        loadAvailableDiscounts();
      }, 1000);
    },
    onError: (error) => {
      console.error('Checkout error:', error);
    },
  });

  const generateTestDiscountMutation = useMutation({
    mutationFn: (code?: string) => apiService.generateTestDiscount(code),
    onSuccess: () => {
      // Refresh available discounts after generating test discount
      loadAvailableDiscounts();
    },
  });

  return {
    cart: cart ?? null,
    products: (() => {
      if (!products) return [] as Product[];
      if (Array.isArray(products)) return products as Product[];
      const maybeData = (products as any)?.data;
      if (Array.isArray(maybeData)) return maybeData as Product[];
      return [] as Product[];
    })(),
    isLoading: cartLoading || productsLoading,
    cartError,
    productsError,
    discountError,
    availableDiscounts: availableDiscounts || [],
    nextDiscountAt,
    discountsLoading,
    discountsError,
    addToCart: addToCartMutation.mutateAsync,
    updateCartItem: updateCartItemMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    applyDiscount: applyDiscountMutation.mutate,
    removeDiscount: removeDiscountMutation.mutate,
    checkout: checkoutMutation.mutate,
    isCheckoutLoading: checkoutMutation.isPending,
    isAdding: addToCartMutation.isPending,
    clearDiscountError: () => setDiscountError(''),
    loadAvailableDiscounts,
    // ✅ ADD THIS: Generate test discount function
    generateTestDiscount: generateTestDiscountMutation.mutate,
    isGeneratingTestDiscount: generateTestDiscountMutation.isPending,
  };
};