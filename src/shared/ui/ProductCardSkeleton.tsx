export function ProductCardSkeleton() {
  return (
    <div className="product-card-skeleton">
      <div className="product-card-skeleton__image" />
      <div className="product-card-skeleton__line product-card-skeleton__line--short" />
      <div className="product-card-skeleton__line" />
      <div className="product-card-skeleton__line product-card-skeleton__line--short" />
    </div>
  );
}