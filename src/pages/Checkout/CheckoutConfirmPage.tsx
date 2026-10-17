import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../../app/AuthContext';
import type { Cart } from '../../shared/api/cart';
import { confirmOrderRequest, resendCodeRequest } from '../../shared/api/checkout';
import { ApiRequestError } from '../../shared/api/client';
import { getToken } from '../../shared/lib/token';
import { CART_KEY } from '../../shared/lib/useCart';
import { Alert } from '../../shared/ui/Alert';
import { Button } from '../../shared/ui/Button';
import { FormField } from '../../shared/ui/FormField';
import { Input } from '../../shared/ui/Input';
import './CheckoutConfirmPage.css';

const codeSchema = z.object({
  code: z.string().trim().regex(/^\d{6}$/, 'კოდი უნდა შედგებოდეს 6 ციფრისგან'),
});
type CodeFormValues = z.infer<typeof codeSchema>;

const RESEND_SECONDS = 30;

export function CheckoutConfirmPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [banner, setBanner] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [tooManyAttempts, setTooManyAttempts] = useState(false);
  const [stockProblem, setStockProblem] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { code: '' },
  });

  // Resend countdown: one tick per second
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const onSubmit = async (values: CodeFormValues) => {
    if (isSubmitting || !orderId) return;
    setBanner(null);
    setInfo(null);
    setStockProblem(false);
    setIsSubmitting(true);

    try {
      const data = await confirmOrderRequest(orderId, values.code, getToken()!);
      // The server emptied the cart, so empty our copy too (header badge -> 0)
      queryClient.setQueryData<Cart>(CART_KEY, {
        items: [],
        totalQty: 0,
        subtotal: 0,
        currency: data.order.currency,
      });
      queryClient.removeQueries({ queryKey: ['checkout'] });
      navigate(`/orders/${orderId}`, { replace: true });
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.code === 'INVALID_PAYMENT_CODE') {
          setError('code', { message: 'კოდი არასწორია ან ვადაგასულია' });
        } else if (err.code === 'TOO_MANY_ATTEMPTS') {
          setTooManyAttempts(true);
        } else if (err.code === 'ORDER_ALREADY_PAID') {
          navigate(`/orders/${orderId}`, { replace: true });
        } else if (err.code === 'INSUFFICIENT_STOCK') {
          setStockProblem(true);
        } else {
          setBanner('დაფიქსირდა შეცდომა. სცადეთ ხელახლა.');
        }
      } else {
        setBanner('დაფიქსირდა შეცდომა. სცადეთ ხელახლა.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resend = async () => {
    if (!orderId || isResending) return;
    setBanner(null);
    setInfo(null);
    setIsResending(true);

    try {
      await resendCodeRequest(orderId, getToken()!);
      setTooManyAttempts(false);
      reset({ code: '' });
      setSecondsLeft(RESEND_SECONDS);
      setInfo('ახალი კოდი გამოგზავნილია');
    } catch (err) {
      if (err instanceof ApiRequestError && err.code === 'RESEND_TOO_SOON') {
        setSecondsLeft(err.retryAfterSeconds ?? RESEND_SECONDS);
      } else {
        setBanner('კოდის გაგზავნა ვერ მოხერხდა. სცადეთ ხელახლა.');
      }
    } finally {
      setIsResending(false);
    }
  };

  if (!orderId) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <main className="confirm-page">
      <div className="confirm-card">
        <h1 className="confirm-card__title">კოდის დადასტურება</h1>
        <p className="confirm-card__text">
          კოდი გამოგზავნილია {user?.email} მისამართზე. მოქმედებს 10 წუთი.
        </p>

        {banner ? (
          <div className="confirm-card__banner">
            <Alert variant="error">{banner}</Alert>
          </div>
        ) : null}

        {info ? (
          <div className="confirm-card__banner">
            <Alert variant="success">{info}</Alert>
          </div>
        ) : null}

        {tooManyAttempts ? (
          <div className="confirm-card__banner">
            <Alert variant="error">ძალიან ბევრი მცდელობა. მოითხოვეთ ახალი კოდი.</Alert>
            <Button type="button" onClick={resend} isLoading={isResending} disabled={isResending}>
              ახალი კოდის მოთხოვნა
            </Button>
          </div>
        ) : null}

        {stockProblem ? (
          <div className="confirm-card__banner">
            <Alert variant="error">
              ზოგი პროდუქტი აღარ არის საკმარისი რაოდენობით.{' '}
              <Link to="/cart">გადადით კალათაში</Link>
            </Alert>
          </div>
        ) : null}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField label="დადასტურების კოდი" error={errors.code?.message}>
            <Input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              {...register('code')}
            />
          </FormField>

          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting || tooManyAttempts}
          >
            დადასტურება
          </Button>
        </form>

        <button
          type="button"
          className="confirm-card__resend"
          disabled={secondsLeft > 0 || isResending}
          onClick={resend}
        >
         {secondsLeft > 0 ? `ხელახლა გაგზავნა (${secondsLeft} წმ)` : 'ხელახლა გაგზავნა'}
        </button>

        <p className="confirm-card__back">
          <Link to="/checkout">უკან ჩექაუთზე</Link>
        </p>
      </div>
    </main>
  );
}