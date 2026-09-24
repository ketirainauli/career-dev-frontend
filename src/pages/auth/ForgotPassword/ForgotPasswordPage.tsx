import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../../../shared/lib/validation';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { FormField } from '../../../shared/ui/FormField';
import { Alert } from '../../../shared/ui/Alert';
import '../Login/LoginPage.css';

export function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onValid = async (values: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    console.log(values);
    setIsSubmitted(true);
  };

  const onInvalid = (fieldErrors: typeof errors) => {
    const firstErrorField = Object.keys(fieldErrors)[0] as keyof ForgotPasswordFormValues | undefined;
    if (firstErrorField) {
      setFocus(firstErrorField);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Reset your password</h1>

        {isSubmitted ? (
          <Alert variant="success">
            If an account exists for this email, we've sent a reset link.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit(onValid, onInvalid)} noValidate>
            <FormField label="Email" error={errors.email?.message}>
              <Input type="email" autoComplete="email" {...register('email')} />
            </FormField>

            <Button type="submit" isLoading={isSubmitting} className="auth-card__submit">
              Send reset link
            </Button>
          </form>
        )}

        <p className="auth-card__link-row">
          <Link to="/login">Back to sign in</Link>
        </p>
      </div>
    </main>
  );
}