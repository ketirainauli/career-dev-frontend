import { apiRequest } from './client';
import type { CartItem } from './cart';

export interface ShippingInfo {
  fullName: string;
  phone: string;
  city: string;
  address: string;
}

export interface SavedAddress {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  address: string;
}

export interface CheckoutData {
  items: CartItem[];
  totalQty: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  currency: string;
  freeShippingFrom: number;
  shipping: ShippingInfo;
  addresses: SavedAddress[];
}

export interface CardInfo {
  number: string;
  holder: string;
  expiry: string;
  cvc: string;
}

export interface CreateOrderResponse {
  orderId: string;
  status: string;
  total: number;
  currency: string;
  message: string;
  expiresInMinutes: number;
  devCode?: string;
}

export interface OrderItem {
  productId: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  qty: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  status: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  currency: string;
  shipping: ShippingInfo;
  payment: { brand: string; last4: string };
  createdAt: string;
  paidAt: string | null;
}

export interface ResendCodeResponse {
  message: string;
  expiresInMinutes: number;
  devCode?: string;
}

export function getCheckoutRequest(token: string) {
  return apiRequest<CheckoutData>('/checkout', { method: 'GET', token });
}

export function createOrderRequest(body: { shipping: ShippingInfo; card: CardInfo }, token: string) {
  return apiRequest<CreateOrderResponse>('/orders', { method: 'POST', body, token });
}

export function confirmOrderRequest(orderId: string, code: string, token: string) {
  return apiRequest<{ order: Order }>(`/orders/${orderId}/confirm`, {
    method: 'POST',
    body: { code },
    token,
  });
}

export function resendCodeRequest(orderId: string, token: string) {
  return apiRequest<ResendCodeResponse>(`/orders/${orderId}/resend-code`, {
    method: 'POST',
    body: {},
    token,
  });
}

export function getOrderRequest(orderId: string, token: string) {
  return apiRequest<{ order: Order }>(`/orders/${orderId}`, { method: 'GET', token });
}