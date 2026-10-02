import './CatalogPage.css';
import { QuickToggles } from '../../shared/ui/QuickToggles';
import { ProductCard } from '../../shared/ui/ProductCard';
import { ProductCardSkeleton } from '../../shared/ui/ProductCardSkeleton';
import { Pagination } from '../../shared/ui/Pagination';
import { SearchBox } from '../../shared/ui/SearchBox';
import { SortDropdown } from '../../shared/ui/SortDropdown';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCategory, getProducts } from '../../shared/api/catalog';
import { buildProductsQuery } from '../../shared/lib/catalogParams';
import { CATEGORY_SLUG, CATEGORY_DISPLAY_NAME } from '../../shared/config/category';
import { FilterPanel } from '../../shared/ui/FilterPanel/FilterPanel';

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryQuery = useQuery({
    queryKey: ['category', CATEGORY_SLUG],
    queryFn: () => getCategory(CATEGORY_SLUG),
  });

  const queryString = buildProductsQuery(searchParams);

  const productsQuery = useQuery({
    queryKey: ['products', queryString],
    queryFn: () => getProducts(queryString),
  });

  const hasActiveFilters = Array.from(searchParams.keys()).some((key) => key !== 'page');

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <main style={{ padding: '2rem', display: 'flex', gap: '2rem' }}>
      <aside>
        {categoryQuery.data ? <FilterPanel category={categoryQuery.data} /> : <p>Loading filters...</p>}
      </aside>

      <div style={{ flex: 1 }}>
        <h1>{CATEGORY_DISPLAY_NAME}</h1>
        <SearchBox />
        <QuickToggles />
        <SortDropdown />

        {productsQuery.isPending ? (
          <div className="product-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : null}

        {productsQuery.isError ? (
          <div className="catalog-message">
            <p>ვერ ჩაიტვირთა</p>
            <button type="button" onClick={() => productsQuery.refetch()}>
              ხელახლა ცდა
            </button>
          </div>
        ) : null}

        {productsQuery.data ? (
          productsQuery.data.items.length === 0 ? (
            <div className="catalog-message">
              <p>ვერაფერი მოიძებნა</p>
              {hasActiveFilters ? (
                <button type="button" onClick={clearFilters}>
                  გასუფთავება
                </button>
              ) : null}
            </div>
          ) : (
            <div>
              <p>
                Total: {productsQuery.data.total} — Page {productsQuery.data.page} of{' '}
                {productsQuery.data.totalPages}
              </p>
              <div
                className="product-grid"
                style={{ opacity: productsQuery.isFetching ? 0.5 : 1, transition: 'opacity 0.15s ease' }}
              >
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
          )
        ) : null}
      </div>
    </main>
  );
}