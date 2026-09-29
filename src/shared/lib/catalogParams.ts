import { CATEGORY_SLUG } from '../config/category';

const RESERVED_KEYS = new Set(['sort', 'page', 'q']);

export function buildProductsQuery(searchParams: URLSearchParams): string {
  const params = new URLSearchParams();
  params.set('category', CATEGORY_SLUG);

  const sort = searchParams.get('sort');
  if (sort) params.set('sort', sort);

  const page = searchParams.get('page');
  params.set('page', page ?? '1');

  const q = searchParams.get('q');
  if (q) params.set('q', q);

  params.set('limit', '12');

  // Every other param in the URL is treated as an attribute filter
  // (brand, material, type, animal, size, minPrice, maxPrice, etc.)
  // — this is what lets the same code work for any category's filters.
  for (const [key, value] of searchParams.entries()) {
    if (!RESERVED_KEYS.has(key) && key !== 'category' && value) {
      params.set(key, value);
    }
  }

  return params.toString();
} 