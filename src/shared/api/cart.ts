import { apiRequest } from './client';

export interface CartProduct {
  id: string;
  slug: string;
  title: string;
  brand: string;
  image: string;
  price: number;
  oldPrice: number | null;
  currency: string;
  stock: number;
  inStock: boolean;
}

export interface CartItem {
  id: string; // cart line id: used for PATCH and DELETE
  productId: string; // product id: used only for POST
  qty: number;
  lineTotal: number;
  product: CartProduct;
}

export interface Cart {
  items: CartItem[];
  totalQty: number;
  subtotal: number;
  currency: string;
}

export function getCartRequest(token: string) {
  return apiRequest<Cart>('/cart', { method: 'GET', token });
}

export function addToCartRequest(body: { productId: string; qty: number }, token: string) {
  return apiRequest<Cart>('/cart/items', { method: 'POST', body, token });
}

export function updateCartItemRequest(itemId: string, qty: number, token: string) {
  return apiRequest<Cart>(`/cart/items/${itemId}`, { method: 'PATCH', body: { qty }, token });
}

export function removeCartItemRequest(itemId: string, token: string) {
  return apiRequest<Cart>(`/cart/items/${itemId}`, { method: 'DELETE', token });
}