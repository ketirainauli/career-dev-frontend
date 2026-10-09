import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../shared/lib/useCart';
import { ApiRequestError } from '../../shared/api/client';
import { Button } from '../../shared/ui/Button';
import './CartPage.css';

const MAX_QTY = 99;

export function CartPage() {
  const { cart, isLoading, isError, refetch, updateItem, removeItem } = useCart();
  const navigate = useNavigate();
  const [itemErrors, setItemErrors] = useState<Record<string, string>>({});

  // While any request is running, all steppers and delete buttons are disabled.
  const isBusy = updateItem.isPending || removeItem.isPending;

  const setItemError = (itemId: string, text: string | null) => {
    setItemErrors((prev) => {
      const next = { ...prev };
      if (text) {
        next[itemId] = text;
      } else {
        delete next[itemId];
      }
      return next;
    });
  };

  const changeQty = (itemId: string, qty: number) => {
    setItemError(itemId, null);
    updateItem.mutate(
      { itemId, qty },
      {
        onError: (err) => {
          if (err instanceof ApiRequestError && err.code === 'INSUFFICIENT_STOCK') {
            setItemError(itemId, `მარაგში მხოლოდ ${err.available ?? 0} ცალია`);
          } else {
            setItemError(itemId, 'დაფიქსირდა შეცდომა. სცადეთ ხელახლა.');
          }
        },
      }
    );
  };

  const remove = (itemId: string) => {
    setItemError(itemId, null);
    removeItem.mutate(itemId, {
      onError: () => setItemError(itemId, 'წაშლა ვერ მოხერხდა. სცადეთ ხელახლა.'),
    });
  };

  if (isLoading) {
    return <main className="cart-page"><p>იტვირთება...</p></main>;
  }

  if (isError || !cart) {
    return (
      <main className="cart-page">
        <div className="cart-empty">
          <p>ვერ ჩაიტვირთა</p>
          <Button type="button" onClick={() => refetch()}>
            ხელახლა ცდა
          </Button>
        </div>
      </main>
    );
  }

  if (cart.items.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-empty">
          <h1>კალათა ცარიელია</h1>
          <Link to="/catalog" className="btn btn--primary">
            კატალოგში დაბრუნება
          </Link>
        </div>
      </main>
    );
  }

  const hasStockProblem = cart.items.some(
    (item) => !item.product.inStock || item.product.stock < item.qty
  );

  return (
    <main className="cart-page">
      <h1 className="cart-page__title">კალათა</h1>

      <ul className="cart-list">
        {cart.items.map((item) => {
          const maxQty = Math.min(item.product.stock, MAX_QTY);
          const stockWarning =
            !item.product.inStock
              ? 'ამოწურულია'
              : item.product.stock < item.qty
                ? `მარაგში მხოლოდ ${item.product.stock} ცალია`
                : null;
          const message = itemErrors[item.id] ?? stockWarning;

          return (
            <li key={item.id} className="cart-item">
              <img
                src={item.product.image}
                alt={item.product.title}
                className="cart-item__image"
              />

              <div className="cart-item__info">
                <h2 className="cart-item__title">
                  <Link to={`/product/${item.product.slug}`}>{item.product.title}</Link>
                </h2>
                <p className="cart-item__brand">{item.product.brand}</p>
                <p className="cart-item__unit-price">
                  {item.product.price} {item.product.currency} / ცალი
                </p>
              </div>

              <div className="cart-item__controls">
                <div className="cart-stepper">
                  <button
                    type="button"
                    className="cart-stepper__button"
                    aria-label={`რაოდენობის შემცირება: ${item.product.title}`}
                    disabled={isBusy || item.qty <= 1}
                    onClick={() => changeQty(item.id, item.qty - 1)}
                  >
                    −
                  </button>
                  <span className="cart-stepper__qty" aria-live="polite">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    className="cart-stepper__button"
                    aria-label={`რაოდენობის გაზრდა: ${item.product.title}`}
                    disabled={isBusy || item.qty >= maxQty}
                    onClick={() => changeQty(item.id, item.qty + 1)}
                  >
                    +
                  </button>
                </div>

                <span className="cart-item__line-total">
                  {item.lineTotal} {cart.currency}
                </span>

                <button
                  type="button"
                  className="cart-item__remove"
                  aria-label={`წაშლა: ${item.product.title}`}
                  disabled={isBusy}
                  onClick={() => remove(item.id)}
                >
                  წაშლა
                </button>
              </div>

              {message ? (
                <p role="alert" className="cart-item__warning">
                  {message}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>

      <section className="cart-summary">
        <div className="cart-summary__row">
          <span>ჯამი ({cart.totalQty} ცალი)</span>
          <span>
            {cart.subtotal} {cart.currency}
          </span>
        </div>
        {hasStockProblem ? (
          <p className="cart-summary__note">
            გაასწორეთ რაოდენობები, სანამ ჩექაუთზე გადახვალთ.
          </p>
        ) : null}
        <Button type="button" disabled={hasStockProblem || isBusy} onClick={() => navigate('/checkout')}>
          ჩექაუთზე გადასვლა
        </Button>
      </section>
    </main>
  );
}