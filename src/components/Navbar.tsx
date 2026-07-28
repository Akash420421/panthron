import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  ShieldCheck, 
  Menu, 
  X, 
  PackageCheck, 
  ChevronRight,
  SlidersHorizontal,
  ArrowRight,
  Lock,
  KeyRound,
  LogOut,
  Home,
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { 
    currentRoute, 
    navigateTo, 
    cart, 
    wishlist, 
    setIsCartDrawerOpen, 
    filters, 
    setFilters,
    products,
    user,
    setUserRole,
    orders,
    addToast,
    categories,
    setFilters: _setFilters
  } = useShop();

  const [searchQuery, setSearchQuery] = useState(filters.searchQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState('');

  // Logo 15-click secret admin trigger
  const logoClickTimestamps = useRef<number[]>([]);
  const handleLogoTextClick = () => {
    const now = Date.now();
    // Keep clicks from last 4 seconds (lagatar 15 bar within reasonable window)
    logoClickTimestamps.current = logoClickTimestamps.current.filter(t => now - t < 4000);
    logoClickTimestamps.current.push(now);
    if (logoClickTimestamps.current.length >= 15) {
      logoClickTimestamps.current = [];
      setShowAdminPasswordModal(true);
      setAdminPasswordInput('');
      setAdminPasswordError('');
      setIsMobileMenuOpen(false);
    }
  };

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleLogoClick = () => {
    navigateTo('home');
  };

  const handleAdminPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === 'Akashgod') {
      setUserRole('admin');
      setShowAdminPasswordModal(false);
      addToast('Admin Access Granted!', 'success');
      navigateTo('admin');
    } else {
      setAdminPasswordError('Incorrect password! Access denied.');
      addToast('Incorrect password! Access denied.', 'error');
    }
  };

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFilters((prev) => ({ ...prev, searchQuery: searchQuery.trim() }));
      navigateTo('products');
      setIsSearchFocused(false);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  // Search Auto-suggestions
  const searchResults: Product[] = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b border-zinc-200 backdrop-blur-md text-zinc-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={handleLogoClick} 
              className="flex items-center gap-2 text-left group select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-[#003882] flex items-center justify-center text-white font-black shadow-md group-hover:bg-[#002866] transition-colors">
                <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
              </div>
              {/* Secret admin trigger: 15 rapid clicks on PANTHRON word */}
              <div onClick={(e) => { e.stopPropagation(); handleLogoTextClick(); }} className="cursor-default select-none">
                <span className="text-xl font-black tracking-tighter text-[#003882]">
                  PANTH<span className="text-red-600">RON</span>
                </span>
                <span className="hidden sm:block text-[9px] text-zinc-500 -mt-1 tracking-widest uppercase font-extrabold">
                  Official Storefront
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar - Desktop */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-md relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search slippers, sleepers, shoes, electronics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-zinc-100 hover:bg-zinc-100/90 text-sm text-zinc-900 placeholder-zinc-500 pl-10 pr-10 py-2 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none focus:ring-1 focus:ring-[#003882] transition-all"
              />
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Auto Search Dropdown */}
            <AnimatePresence>
              {isSearchFocused && searchQuery.trim().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-xl shadow-2xl p-2 z-50 overflow-hidden"
                >
                  <div className="text-xs font-bold uppercase text-zinc-500 px-3 py-1.5 border-b border-zinc-100">
                    Search Results ({searchResults.length})
                  </div>
                  {searchResults.length > 0 ? (
                    <div className="divide-y divide-zinc-100">
                      {searchResults.map((prod) => (
                        <button
                          key={prod.id}
                          onClick={() => {
                            navigateTo('product-detail', { productId: prod.id });
                            setIsSearchFocused(false);
                          }}
                          className="w-full flex items-center gap-3 p-2 hover:bg-zinc-50 rounded-lg text-left transition-colors"
                        >
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-md bg-zinc-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-zinc-900 truncate">{prod.name}</p>
                            <p className="text-[11px] text-zinc-500">{prod.brand} · <span className="text-[#003882] font-black">₹{(prod.price ?? 0).toFixed(2)}</span></p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-zinc-500">
                      No products found matching &quot;{searchQuery}&quot;
                    </div>
                  )}
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full mt-2 py-2 text-center text-xs text-[#003882] hover:underline font-bold border-t border-zinc-100 flex items-center justify-center gap-1"
                  >
                    <span>View all results</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Toggle Button in Header */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-xl text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition-colors flex items-center gap-1.5"
              title="Search Products"
            >
              <Search className="w-5 h-5 text-[#003882]" />
              <span className="hidden sm:inline text-xs font-bold text-zinc-700">Search</span>
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => navigateTo('wishlist')}
              className={`relative p-2 rounded-xl text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition-colors ${
                currentRoute === 'wishlist' ? 'bg-zinc-100 text-[#003882]' : ''
              }`}
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 rounded-xl text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition-colors flex items-center gap-2"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#003882]" />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#003882] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              </div>
            </button>

            {/* Hamburger Menu Button (Profile + Categories live here now) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-zinc-700 hover:text-zinc-900 rounded-xl hover:bg-zinc-100 transition-colors"
              title="Menu & Profile"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Category Navigation Bar - Desktop */}
        <nav className="hidden md:flex items-center justify-between border-t border-zinc-200 py-2 text-xs font-bold text-zinc-700">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setFilters((prev) => ({ ...prev, category: cat }));
                  navigateTo('products');
                }}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  filters.category === cat && currentRoute === 'products'
                    ? 'bg-[#003882] text-white font-black'
                    : 'hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, category: 'All' }));
              navigateTo('products');
            }}
            className="flex items-center gap-1 text-[#003882] hover:underline font-extrabold px-2 py-1"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>All Products</span>
          </button>
        </nav>
      </div>

      {/* Quick Search Drawer Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-zinc-100 border-t border-b border-zinc-200 px-4 py-3"
          >
            <div className="max-w-3xl mx-auto flex items-center gap-2">
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type product name, category (e.g. Sleeper, Headphones)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-white text-sm text-zinc-900 placeholder-zinc-500 pl-10 pr-10 py-2 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none focus:ring-2 focus:ring-[#003882]/20"
                />
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
              <button
                onClick={handleSearchSubmit}
                className="bg-[#003882] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#002866]"
              >
                Search
              </button>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-zinc-500 hover:text-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Menu Drawer (includes Profile + Categories) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ willChange: 'transform,opacity,height' }}
            className="bg-white border-b border-zinc-200 px-4 py-5 space-y-5 text-zinc-900 shadow-xl overflow-hidden"
          >
            {/* Profile Section */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-black text-zinc-900 truncate text-base">{user.name}</p>
                    <span className={`px-2 py-0.5 rounded uppercase font-black text-[10px] border ${
                      user.role === 'admin'
                        ? 'bg-[#003882] text-white border-[#003882]'
                        : 'bg-zinc-200 text-zinc-700 border-zinc-300'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{user.email}</p>
                  {user.phone && (
                    <p className="text-[11px] text-zinc-600 font-semibold mt-0.5">📞 {user.phone}</p>
                  )}
                </div>
              </div>


              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    navigateTo('account');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100 text-left transition-colors shadow-xs"
                >
                  <User className="w-4 h-4 text-[#003882]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-900">My Profile</p>
                    <p className="text-[10px] text-zinc-500">Account Settings</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    navigateTo('orders');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100 text-left transition-colors shadow-xs"
                >
                  <PackageCheck className="w-4 h-4 text-emerald-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-900">My Orders</p>
                    <p className="text-[10px] text-zinc-500">{orders.length} placed</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    navigateTo('wishlist');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100 text-left transition-colors shadow-xs"
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-900">Wishlist</p>
                    <p className="text-[10px] text-zinc-500">{wishlist.length} saved</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsCartDrawerOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100 text-left transition-colors shadow-xs"
                >
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-900">Cart</p>
                    <p className="text-[10px] text-zinc-500">{totalCartItems} items</p>
                  </div>
                </button>
              </div>

              {user.role === 'admin' && (
                <button
                  onClick={() => {
                    navigateTo('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-blue-50/80 border border-blue-200 hover:bg-blue-100/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#003882]" />
                    <div className="text-left">
                      <p className="text-sm font-black text-[#003882]">Admin Dashboard</p>
                      <p className="text-[10px] text-zinc-500">Manage store, orders &amp; products</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#003882]" />
                </button>
              )}

              {currentRoute !== 'home' && (
                <button
                  onClick={() => {
                    navigateTo('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-zinc-200/70 hover:bg-zinc-200 text-zinc-800 transition-colors text-xs font-bold"
                >
                  <Home className="w-4 h-4 text-zinc-600" />
                  <span>Back to Home</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center gap-1 font-medium"
              >
                <X className="w-4 h-4" /> Close menu
              </button>
            </div>

            <div style={{ height: 0, opacity: 0, overflow: 'hidden' }}>
              {/* Hidden refs to silence unused import warnings */}
              <LogOut className="hidden" /><Lock className="hidden" /><KeyRound className="hidden" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secret Admin Password Modal */}
      <AnimatePresence>
        {showAdminPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-zinc-200 shadow-2xl relative space-y-5"
            >
              <button
                onClick={() => setShowAdminPasswordModal(false)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#003882]">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-zinc-900 tracking-tight">🔐 Admin Access Required</h3>
                  <p className="text-xs text-zinc-500 font-medium">Enter the administrator password to unlock the Command Center.</p>
                </div>
              </div>

              <form onSubmit={handleAdminPasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block">
                    Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Enter password..."
                      value={adminPasswordInput}
                      onChange={(e) => {
                        setAdminPasswordInput(e.target.value);
                        setAdminPasswordError('');
                      }}
                      autoFocus
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-zinc-900 font-mono focus:outline-none focus:border-[#003882] focus:ring-2 focus:ring-[#003882]/20"
                    />
                    <Lock className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  {adminPasswordError && (
                    <p className="text-xs font-bold text-red-600 pt-1">{adminPasswordError}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdminPasswordModal(false)}
                    className="flex-1 py-3 px-4 rounded-xl border border-zinc-300 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-[#003882] hover:bg-[#002866] text-white text-xs font-black shadow-lg transition-transform active:scale-95"
                  >
                    Unlock Admin Panel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
