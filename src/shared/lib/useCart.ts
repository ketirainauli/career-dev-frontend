import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../app/AuthContext';
import { getToken } from './token';
import {
  addToCartRequest,
  getCartRequest,
  removeCartItemRequest,
  updateCartItemRequest,
  type Cart,
} from '../api/cart';

export const CART_KEY = ['cart'] as const;

export function useCart() {
  const { status } = useAuth();
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: CART_KEY,
    queryFn: () => getCartRequest(getToken()!),
    enabled: status === 'authenticated',
  });

  // Every cart change returns the full updated cart, so we store it directly.
  const setCart = (cart: Cart) => {
    queryClient.setQueryData(CART_KEY, cart);
  };

  const addItem = useMutation({
    mutationFn: (vars: { productId: string; qty: number }) =>
      addToCartRequest(vars, getToken()!),
    onSuccess: setCart,
  });

  const updateItem = useMutation({
    mutationFn: (vars: { itemId: string; qty: number }) =>
      updateCartItemRequest(vars.itemId, vars.qty, getToken()!),
    onSuccess: setCart,
  });

  const removeItem = useMutation({
    mutationFn: (itemId: string) => removeCartItemRequest(itemId, getToken()!),
    onSuccess: setCart,
  });

  return {
    cart: cartQuery.data,
    totalQty: cartQuery.data?.totalQty ?? 0,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    refetch: cartQuery.refetch,
    addItem,
    updateItem,
    removeItem,
  };
}