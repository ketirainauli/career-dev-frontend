import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { useCart } from '../lib/useCart';
import { ApiRequestError } from '../api/client';
import { Button } from './Button';
import './AddToCartButton.css';

interface AddToCartButtonProps {
  productId: string; // the product id, not the slug
  slug: string;
  inStock: boolean;
  qty?: number;
  showCartLink?: boolean;
}

export function AddToCartButton({
  productId,
  slug,
  inStock,
  qty = 1,
  showCartLink = false,
}: AddToCartButtonProps) {
  const { status } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleClick = () => {
    if (addItem.isPending) return;

    if (status !== 'authenticated') {
      navigate('/login', { state: { from: `/product/${slug}` } });
      return;
    }

    setMessage(null);
    addItem.mutate(
      { productId, qty },
      {
        onSuccess: () => setMessage({ text: 'დაემატა კალათაში', type: 'success' }),
        onError: (err) => {
          if (err instanceof ApiRequestError && err.code === 'OUT_OF_STOCK') {
            setMessage({ text: 'ამოწურულია', type: 'error' });
          } else if (err instanceof ApiRequestError && err.code === 'INSUFFICIENT_STOCK') {
            setMessage({ text: `მარაგში მხოლოდ ${err.available ?? 0} ცალია`, type: 'error' });
          } else if (err instanceof ApiRequestError && err.code === 'PRODUCT_NOT_FOUND') {
            setMessage({ text: 'პროდუქტი აღარ არსებობს', type: 'error' });
          } else {
            setMessage({ text: 'დაფიქსირდა შეცდომა. სცადეთ ხელახლა.', type: 'error' });
          }
        },
      }
    );
  };

  return (
    <div>
      <Button
        type="button"
        className="add-to-cart__button"
        isLoading={addItem.isPending}
        disabled={!inStock || status === 'loading'}
        onClick={handleClick}
      >
        {inStock ? 'კალათაში დამატება' : 'ამოწურულია'}
      </Button>
      {message ? (
        <p role="status" className={`add-to-cart__message add-to-cart__message--${message.type}`}>
          {message.text}
          {message.type === 'success' && showCartLink ? (
            <>
              {' '}
              <Link to="/cart">კალათის ნახვა</Link>
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}