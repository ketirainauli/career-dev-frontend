import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { getOrderRequest } from '../../shared/api/checkout';
import { getToken } from '../../shared/lib/token';
import { Button } from '../../shared/ui/Button';
import './OrderPage.css';

export function OrderPage() {
  const { id } = useParams<{ id: string }>();

  const orderQuery = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderRequest(id!, getToken()!),
    enabled: !!id,
  });

  if (orderQuery.isPending) {
    return (
      <main className="order-page">
        <p>იტვირთება...</p>
      </main>
    );
  }

  if (orderQuery.isError) {
    return (
      <main className="order-page">
        <div className="order-message">
          <p>ვერ ჩაიტვირთა</p>
          <Button type="button" onClick={() => orderQuery.refetch()}>
            ხელახლა ცდა
          </Button>
        </div>
      </main>
    );
  }

  const order = orderQuery.data.order;
  const isPaid = order.status === 'paid';

  return (
    <main className="order-page">
      <div className="order-card">
        <h1 className="order-card__title">
          {isPaid ? 'მადლობა! შეკვეთა გადახდილია' : 'შეკვეთა ჯერ არ არის გადახდილი'}
        </h1>
        <p className="order-card__number">შეკვეთა №{order.id}</p>

        <h2 className="order-card__section">პროდუქტები</h2>
        <ul className="order-items">
          {order.items.map((item) => (
            <li key={item.productId} className="order-items__row">
              <img src={item.image} alt={item.title} className="order-items__image" />
              <div className="order-items__info">
                <Link to={`/product/${item.slug}`}>{item.title}</Link>
                <span>
                  {item.qty} × {item.price} {order.currency}
                </span>
              </div>
              <span className="order-items__total">
                {item.lineTotal} {order.currency}
              </span>
            </li>
          ))}
        </ul>

        <div className="order-totals">
          <div className="order-totals__row">
            <span>ჯამი</span>
            <span>
              {order.subtotal} {order.currency}
            </span>
          </div>
          <div className="order-totals__row">
            <span>მიწოდება</span>
            <span>
              {order.shippingFee === 0 ? 'უფასო' : `${order.shippingFee} ${order.currency}`}
            </span>
          </div>
          <div className="order-totals__row order-totals__row--total">
            <span>სულ</span>
            <span>
              {order.total} {order.currency}
            </span>
          </div>
        </div>

        <h2 className="order-card__section">მიწოდება</h2>
        <p className="order-card__text">
          {order.shipping.fullName}
          <br />
          {order.shipping.phone}
          <br />
          {order.shipping.city}, {order.shipping.address}
        </p>

        <h2 className="order-card__section">გადახდა</h2>
        <p className="order-card__text">
          {order.payment.brand.toUpperCase()} •••• {order.payment.last4}
        </p>

        <Link to="/catalog" className="btn btn--primary order-card__button">
          კატალოგში დაბრუნება
        </Link>
      </div>
    </main>
  );
}