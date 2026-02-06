import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductEditPage from './pages/admin/AdminProductEditPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailsPage from './pages/admin/AdminOrderDetailsPage';
import StorefrontLayout from './components/storefront/StorefrontLayout';
import AdminLayout from './components/admin/AdminLayout';
import AdminRouteGuard from './components/admin/AdminRouteGuard';

const rootRoute = createRootRoute({
  component: () => <StorefrontLayout />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/catalog',
  component: CatalogPage,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$productId',
  component: ProductDetailsPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const confirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-confirmation/$orderId',
  component: OrderConfirmationPage,
});

const adminRootRoute = createRootRoute({
  component: () => (
    <AdminRouteGuard>
      <AdminLayout />
    </AdminRouteGuard>
  ),
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/admin/products',
  component: AdminProductsPage,
});

const adminProductCreateRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/admin/products/create',
  component: AdminProductEditPage,
});

const adminProductEditRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/admin/products/edit/$productId',
  component: AdminProductEditPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/admin/orders',
  component: AdminOrdersPage,
});

const adminOrderDetailsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/admin/orders/$orderId',
  component: AdminOrderDetailsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  catalogRoute,
  productRoute,
  cartRoute,
  checkoutRoute,
  confirmationRoute,
  adminProductsRoute,
  adminProductCreateRoute,
  adminProductEditRoute,
  adminOrdersRoute,
  adminOrderDetailsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
