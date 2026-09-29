import { CatalogPage } from '../pages/Catalog/CatalogPage';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/Login/LoginPage';
import { RegisterPage } from '../pages/auth/Register/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPassword/ForgotPasswordPage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/catalog', element: <CatalogPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
]);