import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, type CheckoutFormValues } from '../../shared/lib/validation';
import { Input } from '../../shared/ui/Input';
import { FormField } from '../../shared/ui/FormField';
import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { getCheckoutRequest } from '../../shared/api/checkout';
import { getToken } from '../../shared/lib/token';
import { Button } from '../../shared/ui/Button';
import './CheckoutPage.css';

export function CheckoutPage() {
  const checkoutQuery = useQuery({
    queryKey: ['checkout'],
    queryFn: () => getCheckoutRequest(getToken()!),
    refetchOnMount: 'always',
  });
    const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      shipping: { fullName: '', phone: '', city: '', address: '' },
      card: { number: '', holder: '', expiry: '', cvc: '' },
    },
  });

  // Fill the shipping fields once the server data arrives
  useEffect(() => {
    if (checkoutQuery.data) {
      reset({
        shipping: checkoutQuery.data.shipping,
        card: { number: '', holder: '', expiry: '', cvc: '' },
      });
    }
  }, [checkoutQuery.data, reset]);

  const onSubmit = (values: CheckoutFormValues) => {
    // Payment comes in the next step. For now we only check validation works.
    // The card data is never logged: only the shipping part is printed.
    console.log('shipping', values.shipping);
  };

  if (checkoutQuery.isPending) {
    return (
      <main className="checkout-page">
        <p>იტვირთება...</p>
      </main>
    );
  }

  if (checkoutQuery.isError) {
    return (
      <main className="checkout-page">
        <div className="checkout-message">
          <p>ვერ ჩაიტვირთა</p>
          <Button type="button" onClick={() => checkoutQuery.refetch()}>
            ხელახლა ცდა
          </Button>
        </div>
      </main>
    );
  }

  const checkout = checkoutQuery.data;

  // Empty cart: nothing to pay for
  if (checkout.items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const remainingForFreeShipping = checkout.freeShippingFrom - checkout.subtotal;

  return (
    <main className="checkout-page">
      <h1 className="checkout-page__title">ჩექაუთი</h1>

      <div className="checkout-layout">
               <section className="checkout-main">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2 className="checkout-section-title">მიწოდება</h2>

            <FormField label="სრული სახელი" error={errors.shipping?.fullName?.message}>
              <Input type="text" autoComplete="name" {...register('shipping.fullName')} />
            </FormField>

            <FormField label="ტელეფონი" error={errors.shipping?.phone?.message}>
              <Input
                type="tel"
                autoComplete="tel"
                placeholder="+995 555 12 34 56"
                {...register('shipping.phone')}
              />
            </FormField>

            <FormField label="ქალაქი" error={errors.shipping?.city?.message}>
              <Input type="text" autoComplete="address-level2" {...register('shipping.city')} />
            </FormField>

            <FormField label="მისამართი" error={errors.shipping?.address?.message}>
              <Input type="text" autoComplete="street-address" {...register('shipping.address')} />
            </FormField>

            <Button type="submit">გაგრძელება</Button>
          </form>
        </section>

        <aside className="checkout-summary">
          <h2 className="checkout-summary__title">თქვენი შეკვეთა</h2>

          <ul className="checkout-summary__list">
            {checkout.items.map((item) => (
              <li key={item.id} className="checkout-summary__item">
                <span>
                  {item.product.title} × {item.qty}
                </span>
                <span>
                  {item.lineTotal} {checkout.currency}
                </span>
              </li>
            ))}
          </ul>

          <div className="checkout-summary__row">
            <span>ჯამი</span>
            <span>
              {checkout.subtotal} {checkout.currency}
            </span>
          </div>
          <div className="checkout-summary__row">
            <span>მიწოდება</span>
            <span>
              {checkout.shippingFee === 0
                ? 'უფასო'
                : `${checkout.shippingFee} ${checkout.currency}`}
            </span>
          </div>
          {remainingForFreeShipping > 0 ? (
            <p className="checkout-summary__hint">
              კიდევ {remainingForFreeShipping} {checkout.currency} და მიწოდება უფასოა
            </p>
          ) : null}
          <div className="checkout-summary__row checkout-summary__row--total">
            <span>სულ გადასახდელი</span>
            <span>
              {checkout.total} {checkout.currency}
            </span>
          </div>
        </aside>
      </div>
    </main>
  );
}