import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../../../shared/lib/validation';
import { forgotPasswordRequest, verifyResetCodeRequest, resetPasswordRequest } from '../../../shared/api/auth';
import { ApiRequestError } from '../../../shared/api/client';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { PasswordInput } from '../../../shared/ui/PasswordInput';
import { FormField } from '../../../shared/ui/FormField';
import { Alert } from '../../../shared/ui/Alert';
import '../Login/LoginPage.css';

type Step = 'email' | 'code' | 'newPassword' | 'done';

const codeSchema = z.object({
  code: z.string().min(1, 'Code is required'),
});
type CodeFormValues = z.infer<typeof codeSchema>;

const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Za-z]/, 'Password must contain at least one letter')
      .regex(/[0-9]/, 'Password must contain at least one digit'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;

export function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Step 1: email
  const emailForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onEmailValid = async (values: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      await forgotPasswordRequest(values);
      setEmail(values.email);
      setStep('code');
    } catch {
      // Per the ticket: never reveal whether the email exists.
      // Any outcome here still advances to the code step.
      setEmail(values.email);
      setStep('code');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: code
  const codeForm = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onCodeValid = async (values: CodeFormValues) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const data = await verifyResetCodeRequest({ email, code: values.code });
      setResetToken(data.resetToken);
      setStep('newPassword');
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.code === 'INVALID_RESET_CODE') {
          codeForm.setError('code', { message: 'The code is incorrect or has expired' });
        } else if (err.code === 'TOO_MANY_ATTEMPTS') {
          setFormError('Too many attempts. Please request a new code.');
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

  const backToEmailStep = () => {
    setFormError(null);
    setStep('email');
  };

  // Step 3: new password
  const newPasswordForm = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onNewPasswordValid = async (values: NewPasswordFormValues) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      await resetPasswordRequest({ resetToken, password: values.password });
      setStep('done');
    } catch {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Reset your password</h1>

        {formError ? (
          <div className="auth-card__banner">
            <Alert variant="error">{formError}</Alert>
            {step === 'code' ? (
              <Button variant="secondary" onClick={backToEmailStep} className="auth-card__submit">
                Request a new code
              </Button>
            ) : null}
          </div>
        ) : null}

        {step === 'email' ? (
          <form onSubmit={emailForm.handleSubmit(onEmailValid)} noValidate>
            <FormField label="Email" error={emailForm.formState.errors.email?.message}>
              <Input type="email" autoComplete="email" {...emailForm.register('email')} />
            </FormField>
            <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting} className="auth-card__submit">
              Send reset code
            </Button>
          </form>
        ) : null}

        {step === 'code' ? (
          <form onSubmit={codeForm.handleSubmit(onCodeValid)} noValidate>
            <p className="auth-card__link-row">We sent a code to {email}</p>
            <FormField label="Reset code" error={codeForm.formState.errors.code?.message}>
              <Input type="text" autoComplete="one-time-code" {...codeForm.register('code')} />
            </FormField>
            <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting} className="auth-card__submit">
              Verify code
            </Button>
          </form>
        ) : null}

        {step === 'newPassword' ? (
          <form onSubmit={newPasswordForm.handleSubmit(onNewPasswordValid)} noValidate>
            <FormField label="New password" error={newPasswordForm.formState.errors.password?.message}>
              <PasswordInput autoComplete="new-password" {...newPasswordForm.register('password')} />
            </FormField>
            <FormField
              label="Confirm new password"
              error={newPasswordForm.formState.errors.confirmPassword?.message}
            >
              <PasswordInput autoComplete="new-password" {...newPasswordForm.register('confirmPassword')} />
            </FormField>
            <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting} className="auth-card__submit">
              Reset password
            </Button>
          </form>
        ) : null}

        {step === 'done' ? (
          <>
            <Alert variant="success">Your password has been reset. You can now sign in.</Alert>
            <Button onClick={() => navigate('/login')} className="auth-card__submit">
              Go to sign in
            </Button>
          </>
        ) : null}

        {step !== 'done' ? (
          <p className="auth-card__link-row">
            <Link to="/login">Back to sign in</Link>
          </p>
        ) : null}
      </div>
    </main>
  );
}