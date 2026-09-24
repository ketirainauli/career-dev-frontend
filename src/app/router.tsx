import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/Login/LoginPage';
import { RegisterPage } from '../pages/auth/Register/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPassword/ForgotPasswordPage';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
]);