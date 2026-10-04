import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProduct } from '../../shared/api/catalog';
import { ProductCard } from '../../shared/ui/ProductCard';
import './ProductDetailPage.css';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [activeImage, setActiveImage] = useState(0);

  const productQuery = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProduct(slug!),
    enabled: !!slug,
  });

  if (productQuery.isPending) return <p style={{ padding: '2rem' }}>Loading...</p>;
  if (productQuery.isError) return <p style={{ padding: '2rem' }}>ვერ ჩაიტვირთა</p>;

  const product = productQuery.data;

  return (
    <main className="product-detail">
      <div className="product-detail__gallery">
        <div className="product-detail__main-image-wrap">
          <img
            src={product.images[activeImage]}
            alt={product.title}
            className="product-detail__main-image"
          />
        </div>
        <div className="product-detail__thumbnails">
          {product.images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              className={`product-detail__thumb ${i === activeImage ? 'product-detail__thumb--active' : ''}`}
              onClick={() => setActiveImage(i)}
            >
              <img src={img} alt={`${product.title} ${i + 1}`} loading="lazy" />
            </button>
          ))}
        </div>
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

        <p className={`product-detail__stock ${product.inStock ? 'product-detail__stock--in' : 'product-detail__stock--out'}`}>
          {product.inStock ? `მარაგშია (${product.stock})` : 'არ არის მარაგში'}
        </p>

        {product.warrantyMonths > 0 ? (
          <p className="product-detail__warranty">გარანტია: {product.warrantyMonths} თვე</p>
        ) : null}

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