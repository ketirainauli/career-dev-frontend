import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { loginSchema, type LoginFormValues } from '../../../shared/lib/validation';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { PasswordInput } from '../../../shared/ui/PasswordInput';
import { FormField } from '../../../shared/ui/FormField';
import './LoginPage.css';

export function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    console.log(values);
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

        <form onSubmit={handleSubmit(onValid, onInvalid)} noValidate>
          <FormField label="Email" error={errors.email?.message}>
            <Input type="email" autoComplete="email" {...register('email')} />
          </FormField>

          <FormField label="Password" error={errors.password?.message}>
            <PasswordInput autoComplete="current-password" {...register('password')} />
          </FormField>

          <Button type="submit" isLoading={isSubmitting} className="auth-card__submit">
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