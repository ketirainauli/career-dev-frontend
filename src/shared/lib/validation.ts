import { isExpiryValid, onlyDigits, passesLuhn } from './card';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
   name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Enter a valid email address'),
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

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export const profileSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    phone: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
    newPassword: z.string().optional(),
    confirmNewPassword: z.string().optional(),
    currentPassword: z.string().min(1, 'Current password is required'),
  })
  .refine(
    (data) => {
      if (!data.newPassword) return true;
      return data.newPassword.length >= 8 && /[A-Za-z]/.test(data.newPassword) && /[0-9]/.test(data.newPassword);
    },
    { message: 'Password must be at least 8 characters with a letter and a digit', path: ['newPassword'] }
  )
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

export type ProfileFormValues = z.infer<typeof profileSchema>;
export const checkoutSchema = z.object({
  shipping: z.object({
    fullName: z.string().trim().min(2, 'სახელი უნდა შედგებოდეს მინიმუმ 2 სიმბოლოსგან'),
    phone: z
      .string()
      .trim()
      .min(9, 'შეიყვანეთ ვალიდური ტელეფონის ნომერი')
      .max(20, 'შეიყვანეთ ვალიდური ტელეფონის ნომერი'),
    city: z.string().trim().min(1, 'ქალაქი სავალდებულოა'),
    address: z.string().trim().min(5, 'მისამართი უნდა შედგებოდეს მინიმუმ 5 სიმბოლოსგან'),
  }),
  card: z.object({
    number: z
      .string()
      .refine((v) => onlyDigits(v).length >= 13 && onlyDigits(v).length <= 19, {
        message: 'შეიყვანეთ ბარათის ვალიდური ნომერი',
      })
      .refine((v) => passesLuhn(v), { message: 'შეიყვანეთ ბარათის ვალიდური ნომერი' }),
    holder: z.string().trim().min(2, 'შეიყვანეთ ბარათის მფლობელის სახელი'),
    expiry: z.string().refine(isExpiryValid, { message: 'ბარათის ვადა არასწორია ან გასულია' }),
    cvc: z.string().regex(/^\d{3,4}$/, 'CVC უნდა იყოს 3 ან 4 ციფრი'),
  }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;