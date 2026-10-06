import { apiRequest } from './client';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  address: string | null;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export function registerRequest(data: { name: string; email: string; password: string }) {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: data,
  });
}

export function loginRequest(data: { email: string; password: string }) {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: data,
  });
}

export function meRequest(token: string) {
  return apiRequest<{ user: User }>('/auth/me', {
    method: 'GET',
    token,
  });
}

export interface UpdateMePayload {
  currentPassword: string;
  name?: string;
  email?: string;
  newPassword?: string;
  phone?: string;
  city?: string;
  address?: string;
}

export function updateMeRequest(payload: UpdateMePayload, token: string) {
  return apiRequest<{ user: User }>('/auth/me', {
    method: 'PATCH',
    body: payload,
    token,
  });
}

export function forgotPasswordRequest(data: { email: string }) {
  return apiRequest<{ message: string; code: string }>('/auth/forgot-password', {
    method: 'POST',
    body: data,
  });
}

export function verifyResetCodeRequest(data: { email: string; code: string }) {
  return apiRequest<{ resetToken: string }>('/auth/verify-reset-code', {
    method: 'POST',
    body: data,
  });
}

export function resetPasswordRequest(data: { resetToken: string; password: string }) {
  return apiRequest<{ message: string; code: string }>('/auth/reset-password', {
    method: 'POST',
    body: data,
  });
}