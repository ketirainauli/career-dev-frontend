import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginSchema, type LoginFormValues } from '../../../shared/lib/validation';
import { loginRequest } from '../../../shared/api/auth';
import { ApiRequestError } from '../../../shared/api/client';
import { useAuth } from '../../../app/AuthContext';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { PasswordInput } from '../../../shared/ui/PasswordInput';
import { FormField } from '../../../shared/ui/FormField';
import { Alert } from '../../../shared/ui/Alert';
import './LoginPage.css';

export function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onValid = async (values: LoginFormValues) => {
    setFormError(null);
    setIsSubmitting(true);

    try {
      const data = await loginRequest(values);
      login(data.accessToken, data.user);

      const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof ApiRequestError && err.code === 'INVALID_CREDENTIALS') {
        setFormError('Incorrect email or password');
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (fieldErrors: typeof errors) => {
    const firstErrorField = Object.keys(fieldErrors)[0] as keyof LoginFormValues | undefined;
    if (firstErrorField) {
      setFocus(firstErrorField);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Sign in</h1>

        {formError ? (
          <div className="auth-card__banner">
            <Alert variant="error">{formError}</Alert>
          </div>
        ) : null}

        <form onSubmit={handleSubmit(onValid, onInvalid)} noValidate>
          <FormField label="Email" error={errors.email?.message}>
            <Input type="email" autoComplete="email" {...register('email')} />
          </FormField>

          <FormField label="Password" error={errors.password?.message}>
            <PasswordInput autoComplete="current-password" {...register('password')} />
          </FormField>

          <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting} className="auth-card__submit">
            Sign in
          </Button>
        </form>

        <p className="auth-card__link-row">
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
        <p className="auth-card__link-row">
          Don't have an account? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </main>
  );
}