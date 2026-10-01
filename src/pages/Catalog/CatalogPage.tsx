import './CatalogPage.css';
import { ProductCard } from '../../shared/ui/ProductCard';
import { Pagination } from '../../shared/ui/Pagination';
import { SearchBox } from '../../shared/ui/SearchBox';
import { SortDropdown } from '../../shared/ui/SortDropdown';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCategory, getProducts } from '../../shared/api/catalog';
import { buildProductsQuery } from '../../shared/lib/catalogParams';
import { CATEGORY_SLUG } from '../../shared/config/category';
import { FilterPanel } from '../../shared/ui/FilterPanel/FilterPanel';

export function CatalogPage() {
  const [searchParams] = useSearchParams();

  const categoryQuery = useQuery({
    queryKey: ['category', CATEGORY_SLUG],
    queryFn: () => getCategory(CATEGORY_SLUG),
  });

  const queryString = buildProductsQuery(searchParams);

  const productsQuery = useQuery({
    queryKey: ['products', queryString],
    queryFn: () => getProducts(queryString),
  });

  return (
    <main style={{ padding: '2rem', display: 'flex', gap: '2rem' }}>
      <aside>
        {categoryQuery.data ? <FilterPanel category={categoryQuery.data} /> : <p>Loading filters...</p>}
      </aside>

      <div style={{ flex: 1 }}>
        <h1>{categoryQuery.data?.name ?? 'Loading category...'}</h1>
<SearchBox />
        <SortDropdown />

        {productsQuery.isLoading ? <p>Loading products...</p> : null}
        {productsQuery.isError ? <p>Failed to load products.</p> : null}

        {productsQuery.data ? (
          <div>
            <p>
              Total: {productsQuery.data.total} — Page {productsQuery.data.page} of{' '}
              {productsQuery.data.totalPages}
            </p>
           <div className="product-grid">
  {productsQuery.data.items.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
            <Pagination
  page={productsQuery.data.page}
  totalPages={productsQuery.data.totalPages}
  total={productsQuery.data.total}
  limit={productsQuery.data.limit}
/>
          </div>
        ) : null}
      </div>
    </main>
  );
}