import { lazy } from 'react';

export const LoginPage = lazy(() =>
  import('../pages/auth/Login/LoginPage').then((m) => ({ default: m.LoginPage }))
);
export const RegisterPage = lazy(() =>
  import('../pages/auth/Register/RegisterPage').then((m) => ({ default: m.RegisterPage }))
);
export const ForgotPasswordPage = lazy(() =>
  import('../pages/auth/ForgotPassword/ForgotPasswordPage').then((m) => ({
    default: m.ForgotPasswordPage,
  }))
);
export const DashboardPage = lazy(() =>
  import('../pages/Dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
export const CatalogPage = lazy(() =>
  import('../pages/Catalog/CatalogPage').then((m) => ({ default: m.CatalogPage }))
);
export const ProductDetailPage = lazy(() =>
  import('../pages/ProductDetail/ProductDetailPage').then((m) => ({
    default: m.ProductDetailPage,
  }))
);
export const ProfilePage = lazy(() =>
  import('../pages/Profile/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
export const CartPage = lazy(() =>
  import('../pages/Cart/CartPage').then((m) => ({ default: m.CartPage }))
);
export const CheckoutPage = lazy(() =>
  import('../pages/Checkout/CheckoutPage').then((m) => ({ default: m.CheckoutPage }))
);
export const CheckoutConfirmPage = lazy(() =>
  import('../pages/Checkout/CheckoutConfirmPage').then((m) => ({
    default: m.CheckoutConfirmPage,
  }))
);
export const OrderPage = lazy(() =>
  import('../pages/Orders/OrderPage').then((m) => ({ default: m.OrderPage }))
);