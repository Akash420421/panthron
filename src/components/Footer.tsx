import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Headphones, 
  Send, 
  Check, 
  Heart,
  CreditCard,
  Lock
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, setFilters, addToast, companySettings } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      addToast('Thank you for subscribing to PANTHRON VIP updates!', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-white text-zinc-700 border-t border-zinc-200/90 pt-12 pb-20 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Value Proposition Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-zinc-50 rounded-2xl border border-zinc-200/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#003882] flex items-center justify-center shrink-0 border border-blue-200">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-zinc-900">Free Express Shipping</h4>
              <p className="text-xs font-semibold text-zinc-500 mt-0.5">On all US orders over $75</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#003882] flex items-center justify-center shrink-0 border border-blue-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-zinc-900">Secure Payments</h4>
              <p className="text-xs font-semibold text-zinc-500 mt-0.5">256-bit SSL encryption</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#003882] flex items-center justify-center shrink-0 border border-blue-200">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-zinc-900">30-Day Easy Returns</h4>
              <p className="text-xs font-semibold text-zinc-500 mt-0.5">Hassle-free return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#003882] flex items-center justify-center shrink-0 border border-blue-200">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-zinc-900">24/7 Dedicated Support</h4>
              <p className="text-xs font-semibold text-zinc-500 mt-0.5">Live chat & email assistance</p>
            </div>
          </div>
        </div>

        {/* Main Footer Navigation & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#003882] flex items-center justify-center text-white font-black shadow-md">
                <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-black tracking-tighter text-[#003882]">
                PANTH<span className="text-red-600">RON</span>
              </span>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed max-w-sm font-medium">
              Panthron is your premier destination for curated fashion, high-tech electronics, home essentials, and footwear. Engineered for seamless shopping and swift delivery.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-black text-zinc-900 mb-2">Subscribe for Exclusive Deals & 10% OFF Code</p>
              {subscribed ? (
                <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>You are subscribed! Check your inbox for promo code <strong>WELCOME10</strong>.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-zinc-100 text-xs text-zinc-900 placeholder-zinc-500 px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#003882] font-semibold"
                  />
                  <button
                    type="submit"
                    className="bg-[#003882] hover:bg-[#002866] text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-md"
                  >
                    <span>Join</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="text-xs font-black uppercase text-zinc-900 tracking-wider mb-4">Categories</h5>
            <ul className="space-y-2 text-xs font-semibold text-zinc-600">
              {['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Accessories'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, category: cat as any }));
                      navigateTo('products');
                    }}
                    className="hover:text-[#003882] transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="text-xs font-black uppercase text-zinc-900 tracking-wider mb-4">Customer Care</h5>
            <ul className="space-y-2 text-xs font-semibold text-zinc-600">
              <li>
                <button onClick={() => navigateTo('orders')} className="hover:text-[#003882] transition-colors">
                  Order History & Tracking
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('account')} className="hover:text-[#003882] transition-colors">
                  Account Settings
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('wishlist')} className="hover:text-[#003882] transition-colors">
                  My Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('cart')} className="hover:text-[#003882] transition-colors">
                  Shopping Cart
                </button>
              </li>
              <li><span className="hover:text-[#003882] cursor-pointer">Shipping & Delivery</span></li>
              <li><span className="hover:text-[#003882] cursor-pointer">Returns & Exchanges</span></li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h5 className="text-xs font-black uppercase text-zinc-900 tracking-wider mb-4">Store Info</h5>
            <div className="space-y-2 text-xs text-zinc-600 leading-relaxed font-medium">
              {companySettings.address && (
                <p><strong className="text-zinc-900">Address:</strong> {companySettings.address}</p>
              )}
              {companySettings.phone && (
                <p><strong className="text-zinc-900">Phone:</strong> {companySettings.phone}</p>
              )}
              {companySettings.email && (
                <p><strong className="text-zinc-900">Email:</strong> {companySettings.email}</p>
              )}
              <p><strong className="text-zinc-900">Hours:</strong> Mon - Sun: 24/7 Support</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-zinc-500">
          <div className="flex items-center gap-1">
            <span>© 2026 {companySettings.companyName || 'Panthron Inc.'}. All rights reserved. Crafting smooth e-commerce experiences.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
