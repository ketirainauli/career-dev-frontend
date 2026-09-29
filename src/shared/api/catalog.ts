import { apiRequest } from './client';

export interface CategoryFilterOption {
  value: string;
  label: string;
}

export interface CategoryFilter {
  key: string;
  label: string;
  type: 'checkbox' | 'radio' | 'color' | 'range';
  options?: CategoryFilterOption[];
  min?: number;
  max?: number;
  unit?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  image: string;
  productsCount: number;
  filters: CategoryFilter[];
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  brand: string;
  price: number;
  oldPrice: number | null;
  discountPercent: number | null;
  currency: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  inStock: boolean;
  warrantyMonths: number;
  image: string;
  images: string[];
  specs: Record<string, string>;
  category: { slug: string; name: string };
  createdAt: string;
}

export interface ProductDetail extends Product {
  attributes: Record<string, string>;
  related: Product[];
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  sort: string;
}

export function getCategory(slug: string) {
  return apiRequest<Category>(`/categories/${slug}`);
}

export function getProducts(queryString: string) {
  return apiRequest<ProductListResponse>(`/products?${queryString}`);
}

export function getProduct(slug: string) {
  return apiRequest<ProductDetail>(`/products/${slug}`);
}