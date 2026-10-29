import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout, RootBoundary } from './Layout';
import { ProtectedRoute } from './ProtectedRoute';
import {
  CartPage,
  CatalogPage,
  CheckoutConfirmPage,
  CheckoutPage,
  DashboardPage,
  ForgotPasswordPage,
  LoginPage,
  OrderPage,
  ProductDetailPage,
  ProfilePage,
  RegisterPage,
} from './lazyPages';


export const router = createBrowserRouter([
  {
    element: <RootBoundary />,
    children: [
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
          {
            path: '/cart',
            element: (
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/checkout',
            element: (
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/checkout/confirm/:orderId',
            element: (
              <ProtectedRoute>
                <CheckoutConfirmPage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/orders/:id',
            element: (
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);