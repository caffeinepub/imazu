import { Outlet, Link } from '@tanstack/react-router';
import { Package, ShoppingBag } from 'lucide-react';
import LoginButton from '../auth/LoginButton';
import ProfileSetupModal from '../auth/ProfileSetupModal';

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProfileSetupModal />
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/assets/generated/imazu-logo.dim_512x512.png" alt="iMazu" className="h-10 w-10" />
              <span className="text-2xl font-bold tracking-tight text-foreground">iMazu Admin</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/admin/products"
                className="text-sm font-medium transition-colors hover:text-primary flex items-center space-x-2"
                activeProps={{ className: 'text-primary' }}
              >
                <Package className="h-4 w-4" />
                <span>Products</span>
              </Link>
              <Link
                to="/admin/orders"
                className="text-sm font-medium transition-colors hover:text-primary flex items-center space-x-2"
                activeProps={{ className: 'text-primary' }}
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Orders</span>
              </Link>
            </nav>
          </div>
          <LoginButton />
        </div>
      </header>

      <main className="flex-1 container px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <span>© 2026. Built with</span>
            <span className="text-primary mx-1">♥</span>
            <span>using</span>
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-primary transition-colors ml-1"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
