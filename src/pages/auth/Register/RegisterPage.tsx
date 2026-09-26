import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema, type RegisterFormValues } from '../../../shared/lib/validation';
import { registerRequest } from '../../../shared/api/auth';
import { ApiRequestError } from '../../../shared/api/client';
import { useAuth } from '../../../app/AuthContext';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { PasswordInput } from '../../../shared/ui/PasswordInput';
import { FormField } from '../../../shared/ui/FormField';
import { Alert } from '../../../shared/ui/Alert';
import '../Login/LoginPage.css';

export function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setFocus,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onValid = async (values: RegisterFormValues) => {
    setFormError(null);
    setIsSubmitting(true);

    try {
      const data = await registerRequest(values);
      login(data.accessToken, data.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.code === 'EMAIL_TAKEN') {
          setError('email', { message: 'This email is already registered' });
        } else if (err.code === 'VALIDATION_ERROR' && err.errors) {
          for (const [field, message] of Object.entries(err.errors)) {
            setError(field as keyof RegisterFormValues, { message });
          }
        } else {
          setFormError('Something went wrong. Please try again.');
        }
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (fieldErrors: typeof errors) => {
    const firstErrorField = Object.keys(fieldErrors)[0] as keyof RegisterFormValues | undefined;
    if (firstErrorField) {
      setFocus(firstErrorField);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Create an account</h1>

        {formError ? (
          <div className="auth-card__banner">
            <Alert variant="error">{formError}</Alert>
          </div>
        ) : null}

        <form onSubmit={handleSubmit(onValid, onInvalid)} noValidate>
          <FormField label="Name" error={errors.name?.message}>
            <Input type="text" autoComplete="name" {...register('name')} />
          </FormField>

          <FormField label="Email" error={errors.email?.message}>
            <Input type="email" autoComplete="email" {...register('email')} />
          </FormField>

          <FormField label="Password" error={errors.password?.message}>
            <PasswordInput autoComplete="new-password" {...register('password')} />
          </FormField>

          <FormField label="Confirm password" error={errors.confirmPassword?.message}>
            <PasswordInput autoComplete="new-password" {...register('confirmPassword')} />
          </FormField>

          <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting} className="auth-card__submit">
            Create account
          </Button>
        </form>

        <p className="auth-card__link-row">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}