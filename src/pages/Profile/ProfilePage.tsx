import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileFormValues } from '../../shared/lib/validation';
import { updateMeRequest } from '../../shared/api/auth';
import { ApiRequestError } from '../../shared/api/client';
import { useAuth } from '../../app/AuthContext';
import { getToken } from '../../shared/lib/token';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { PasswordInput } from '../../shared/ui/PasswordInput';
import { FormField } from '../../shared/ui/FormField';
import { Alert } from '../../shared/ui/Alert';
import './ProfilePage.css';

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      city: user?.city ?? '',
      address: user?.address ?? '',
      newPassword: '',
      confirmNewPassword: '',
      currentPassword: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone ?? '',
        city: user.city ?? '',
        address: user.address ?? '',
        newPassword: '',
        confirmNewPassword: '',
        currentPassword: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onValid = async (values: ProfileFormValues) => {
    setFormError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const changed: Record<string, string> = {};
    const fieldsToCheck: (keyof ProfileFormValues)[] = ['name', 'email', 'phone', 'city', 'address'];
    for (const field of fieldsToCheck) {
      if (dirtyFields[field]) {
        changed[field] = values[field] ?? '';
      }
    }
    if (dirtyFields.newPassword && values.newPassword) {
      changed.newPassword = values.newPassword;
    }

    const token = getToken();

    try {
      const data = await updateMeRequest(
        { currentPassword: values.currentPassword, ...changed },
        token!
      );
      updateUser(data.user);
      setSuccessMessage('ცვლილებები შენახულია');
      reset({
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone ?? '',
        city: data.user.city ?? '',
        address: data.user.address ?? '',
        newPassword: '',
        confirmNewPassword: '',
        currentPassword: '',
      });
    } catch (err) {
      if (err instanceof ApiRequestError && err.errors) {
        let fieldErrorSet = false;
        for (const [field, message] of Object.entries(err.errors)) {
          if (field === '_') {
            setFormError('შესაცვლელი არაფერია');
          } else {
            setError(field as keyof ProfileFormValues, { message });
            fieldErrorSet = true;
          }
        }
        if (fieldErrorSet) {
          const firstErrorField = Object.keys(err.errors).find((k) => k !== '_');
          if (firstErrorField) setFocus(firstErrorField as keyof ProfileFormValues);
        }
      } else {
        setFormError('დაფიქსირდა შეცდომა. სცადეთ ხელახლა.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <main className="profile-page">
      <div className="profile-card">
        <h1>პროფილი</h1>

        {successMessage ? <Alert variant="success">{successMessage}</Alert> : null}
        {formError ? <Alert variant="error">{formError}</Alert> : null}

        <form onSubmit={handleSubmit(onValid)} noValidate>
          <FormField label="სახელი" error={errors.name?.message}>
            <Input type="text" {...register('name')} />
          </FormField>

          <FormField label="ელფოსტა" error={errors.email?.message}>
            <Input type="email" {...register('email')} />
          </FormField>

          <FormField label="ტელეფონი" error={errors.phone?.message}>
            <Input type="text" placeholder="+995 555 12 34 56" {...register('phone')} />
          </FormField>

          <FormField label="ქალაქი" error={errors.city?.message}>
            <Input type="text" {...register('city')} />
          </FormField>

          <FormField label="მისამართი" error={errors.address?.message}>
            <Input type="text" {...register('address')} />
          </FormField>

          <p className="profile-page__hint">შენახული მისამართი შეკვეთისას ავტომატურად შეივსება</p>

          <hr className="profile-page__divider" />

          <FormField label="ახალი პაროლი" error={errors.newPassword?.message}>
            <PasswordInput autoComplete="new-password" {...register('newPassword')} />
          </FormField>

          <FormField label="ახალი პაროლის გამეორება" error={errors.confirmNewPassword?.message}>
            <PasswordInput autoComplete="new-password" {...register('confirmNewPassword')} />
          </FormField>

          <hr className="profile-page__divider" />

          <FormField label="მიმდინარე პაროლი" error={errors.currentPassword?.message}>
            <PasswordInput autoComplete="current-password" {...register('currentPassword')} />
          </FormField>

          <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting || !isDirty}>
            შენახვა
          </Button>
        </form>
      </div>
    </main>
  );
}