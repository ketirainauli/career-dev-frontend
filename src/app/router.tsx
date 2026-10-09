import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/Login/LoginPage';
import { RegisterPage } from '../pages/auth/Register/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPassword/ForgotPasswordPage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { CatalogPage } from '../pages/Catalog/CatalogPage';
import { ProductDetailPage } from '../pages/ProductDetail/ProductDetailPage';
import { ProfilePage } from '../pages/Profile/ProfilePage';
import { ProtectedRoute } from './ProtectedRoute';
import { Layout } from './Layout';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  {
    element: <Layout />,
    children: [
      { path: '/catalog', element: <CatalogPage /> },
      { path: '/product/:slug', element: <ProductDetailPage /> },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);