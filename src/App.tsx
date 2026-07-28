import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/ToastContainer';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';


import { HomePage } from './pages/HomePage';

import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AccountPage } from './pages/AccountPage';
import { WishlistPage } from './pages/WishlistPage';
import { AdminDashboard } from './pages/AdminDashboard';

const AppContent: React.FC = () => {
  const { currentRoute } = useShop();

  const renderView = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductsPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'orders':
      case 'order-detail':
        return <OrderTrackingPage />;
      case 'account':
        return <AccountPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#EAEAEA] text-zinc-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white pb-16 sm:pb-20">
      <Navbar />
      <main className="flex-1">{renderView()}</main>
      <Footer />
      <BottomNav />
      <CartDrawer />
      <QuickViewModal />
      <OnboardingModal />
      <AuthModal />
      <ToastContainer />

    </div>
  );
};


export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}

