import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProduct } from '../../shared/api/catalog';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const productQuery = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProduct(slug!),
    enabled: !!slug,
  });

  if (productQuery.isPending) return <p style={{ padding: '2rem' }}>Loading...</p>;
  if (productQuery.isError) return <p style={{ padding: '2rem' }}>ვერ ჩაიტვირთა</p>;

  const product = productQuery.data;

  return (
    <main style={{ padding: '2rem' }}>
      <h1>{product.title}</h1>
      <p>{product.price} {product.currency}</p>
    </main>
  );
}