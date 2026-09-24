import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { registerSchema, type RegisterFormValues } from '../../../shared/lib/validation';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { PasswordInput } from '../../../shared/ui/PasswordInput';
import { FormField } from '../../../shared/ui/FormField';
import '../Login/LoginPage.css';

export function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onValid = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    console.log(values);
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

          <Button type="submit" isLoading={isSubmitting} className="auth-card__submit">
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