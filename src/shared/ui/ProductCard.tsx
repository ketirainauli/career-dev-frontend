import { Link } from 'react-router-dom';
import type { Product } from '../api/catalog';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/product/${product.slug}`} className="product-card">
      <div className="product-card__image-wrap">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="product-card__image"
        />
        {product.discountPercent ? (
          <span className="product-card__badge">-{product.discountPercent}%</span>
        ) : null}
        {!product.inStock ? (
          <span className="product-card__out-of-stock">არ არის მარაგში</span>
        ) : null}
      </div>

      <div className="product-card__body">
        <p className="product-card__brand">{product.brand}</p>
        <h3 className="product-card__title">{product.title}</h3>

        <div className="product-card__rating">
          ★ {product.rating.toFixed(1)} ({product.reviewsCount})
        </div>

        <div className="product-card__price-row">
          <span className="product-card__price">
            {product.price} {product.currency}
          </span>
          {product.oldPrice ? (
            <span className="product-card__old-price">
              {product.oldPrice} {product.currency}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}