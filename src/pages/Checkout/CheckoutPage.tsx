import { Controller } from 'react-hook-form';
import { formatCardNumber, formatExpiry, onlyDigits } from '../../shared/lib/card';
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
    control,
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
    // Sending the order comes in the next step.
    // Card data is never logged: only the shipping part is printed.
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

            <h2 className="checkout-section-title checkout-section-title--spaced">ბარათი</h2>

            <FormField label="ბარათის ნომერი" error={errors.card?.number?.message}>
              <Controller
                control={control}
                name="card.number"
                render={({ field }) => (
                  <Input
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="4242 4242 4242 4242"
                    value={field.value}
                    onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                )}
              />
            </FormField>

            <FormField label="ბარათის მფლობელი" error={errors.card?.holder?.message}>
              <Input type="text" autoComplete="cc-name" {...register('card.holder')} />
            </FormField>

            <div className="checkout-card-row">
              <FormField label="ვადა (MM/YY)" error={errors.card?.expiry?.message}>
                <Controller
                  control={control}
                  name="card.expiry"
                  render={({ field }) => (
                    <Input
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      value={field.value}
                      onChange={(e) => field.onChange(formatExpiry(e.target.value))}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  )}
                />
              </FormField>

              <FormField label="CVC" error={errors.card?.cvc?.message}>
                <Controller
                  control={control}
                  name="card.cvc"
                  render={({ field }) => (
                    <Input
                      type="password"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      maxLength={4}
                      value={field.value}
                      onChange={(e) => field.onChange(onlyDigits(e.target.value))}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  )}
                />
              </FormField>
            </div>

            <Button type="submit">გადახდა</Button>
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