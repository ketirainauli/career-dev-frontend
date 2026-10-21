import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProduct, type ProductDetail } from '../../shared/api/catalog';
import { ApiRequestError } from '../../shared/api/client';
import { AddToCartButton } from '../../shared/ui/AddToCartButton';
import { Button } from '../../shared/ui/Button';
import { ProductCard } from '../../shared/ui/ProductCard';
import './ProductDetailPage.css';

function ProductDetailSkeleton() {
  return (
    <main className="product-detail" aria-busy="true">
      <div>
        <div className="product-detail__skeleton product-detail__skeleton--image" />
        <div className="product-detail__skeleton product-detail__skeleton--thumbs" />
      </div>
      <div>
        <div className="product-detail__skeleton product-detail__skeleton--line-short" />
        <div className="product-detail__skeleton product-detail__skeleton--line" />
        <div className="product-detail__skeleton product-detail__skeleton--line-short" />
        <div className="product-detail__skeleton product-detail__skeleton--line" />
      </div>
    </main>
  );
}

function stockText(product: ProductDetail): string {
  if (!product.inStock) return 'ამოწურულია';
  if (product.stock <= 5) return `დარჩა მხოლოდ ${product.stock}`;
  return 'მარაგშია';
}

function ProductDetailContent({ product }: { product: ProductDetail }) {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    document.title = `${product.title} — წიგნების მაღაზია`;
    window.scrollTo(0, 0);
  }, [product.title]);

  const images = product.images.length > 0 ? product.images : [product.image];

  return (
    <main className="product-detail">
      <nav className="product-detail__breadcrumbs" aria-label="Breadcrumbs">
        <Link to="/catalog">მთავარი</Link>
        <span aria-hidden="true"> / </span>
        <Link to="/catalog">{product.category.name}</Link>
        <span aria-hidden="true"> / </span>
        <span>{product.title}</span>
      </nav>

      <div className="product-detail__gallery">
        <div className="product-detail__main-image-wrap">
          <img
            src={images[activeImage]}
            alt={product.title}
            className="product-detail__main-image"
          />
        </div>
        {images.length > 1 ? (
          <div className="product-detail__thumbnails">
            {images.map((img, i) => (
              <button
                key={img + i}
                type="button"
                className={`product-detail__thumb ${i === activeImage ? 'product-detail__thumb--active' : ''}`}
                onClick={() => setActiveImage(i)}
                aria-label={`${product.title} — სურათი ${i + 1} / ${images.length}`}
                aria-pressed={i === activeImage}
              >
                <img src={img} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="product-detail__info">
        <p className="product-detail__brand">{product.brand}</p>
        <h1 className="product-detail__title">{product.title}</h1>

        <div className="product-detail__rating">
          ★ {product.rating.toFixed(1)} ({product.reviewsCount} შეფასება)
        </div>

        <div className="product-detail__price-row">
          <span className="product-detail__price">
            {product.price} {product.currency}
          </span>
          {product.oldPrice ? (
            <span className="product-detail__old-price">
              {product.oldPrice} {product.currency}
            </span>
          ) : null}
          {product.discountPercent ? (
            <span className="product-detail__discount">-{product.discountPercent}%</span>
          ) : null}
        </div>

        <p
          className={`product-detail__stock ${product.inStock ? 'product-detail__stock--in' : 'product-detail__stock--out'}`}
        >
          {stockText(product)}
        </p>

        {product.warrantyMonths > 0 ? (
          <p className="product-detail__warranty">გარანტია: {product.warrantyMonths} თვე</p>
        ) : null}

        <div className="product-detail__cart-action">
          <AddToCartButton productId={product.id} slug={product.slug} inStock={product.inStock} />
        </div>

        <p className="product-detail__description">{product.description}</p>

        <h2 className="product-detail__specs-title">მახასიათებლები</h2>
        <table className="product-detail__specs-table">
          <tbody>
            {Object.entries(product.specs).map(([label, value]) => (
              <tr key={label}>
                <th>{label}</th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {product.related.length > 0 ? (
        <section className="product-detail__related">
          <h2>მსგავსი პროდუქტები</h2>
          <div className="product-grid">
            {product.related.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const productQuery = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProduct(slug!),
    enabled: !!slug,
    retry: (failureCount, error) =>
      !(error instanceof ApiRequestError && error.status === 404) && failureCount < 1,
  });

  if (productQuery.isPending) {
    return <ProductDetailSkeleton />;
  }

  if (productQuery.isError) {
    const notFound =
      productQuery.error instanceof ApiRequestError && productQuery.error.status === 404;

    return (
      <main className="product-detail-message">
        {notFound ? (
          <>
            <h1>პროდუქტი ვერ მოიძებნა</h1>
            <Link to="/catalog" className="btn btn--primary">
              კატალოგში დაბრუნება
            </Link>
          </>
        ) : (
          <>
            <p>ვერ ჩაიტვირთა</p>
            <Button type="button" onClick={() => productQuery.refetch()}>
              თავიდან ცდა
            </Button>
          </>
        )}
      </main>
    );
  }

  // key={slug}: when the slug changes, React builds a fresh component,
  // so the gallery index and other local state start from zero.
  return <ProductDetailContent key={productQuery.data.slug} product={productQuery.data} />;
}