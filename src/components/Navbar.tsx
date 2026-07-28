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
  KeyRound
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
    categories
  } = useShop();

  const [searchQuery, setSearchQuery] = useState(filters.searchQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState('');

  const avatarClickTimestamps = useRef<number[]>([]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleLogoClick = () => {
    navigateTo('home');
  };

  const handleAvatarClick = () => {
    const now = Date.now();
    avatarClickTimestamps.current = avatarClickTimestamps.current.filter(t => now - t < 600);
    avatarClickTimestamps.current.push(now);
    if (avatarClickTimestamps.current.length >= 3) {
      avatarClickTimestamps.current = [];
      setShowAdminPasswordModal(true);
      setAdminPasswordInput('');
      setAdminPasswordError('');
      setIsUserDropdownOpen(false);
    }
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
              <div>
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
                            <p className="text-[11px] text-zinc-500">{prod.brand} · <span className="text-[#003882] font-black">${prod.price.toFixed(2)}</span></p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-zinc-500">
                      No products found matching "{searchQuery}"
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

            {/* User Account Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  handleAvatarClick();
                  setIsUserDropdownOpen(!isUserDropdownOpen);
                }}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-zinc-100 transition-colors"
                title="Account"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-zinc-300"
                />
              </button>

              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white border border-zinc-200 rounded-xl shadow-2xl py-1.5 z-50 text-sm"
                  >
                    <div className="px-3.5 py-2 border-b border-zinc-100">
                      <p className="font-bold text-zinc-900 truncate">{user.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-[10px] text-[#003882] font-bold rounded-md uppercase">
                        {user.role} Account
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        navigateTo('account');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-zinc-500" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        navigateTo('orders');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3.5 py-2 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <PackageCheck className="w-4 h-4 text-zinc-500" />
                        <span>Order History</span>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 bg-zinc-100 rounded-full text-zinc-700">
                        {orders.length}
                      </span>
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          navigateTo('admin');
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[#003882] hover:bg-blue-50 transition-colors font-bold border-t border-zinc-100"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#003882]" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Hamburger Menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-zinc-700 hover:text-zinc-900 rounded-xl hover:bg-zinc-100"
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

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-900 border-b border-zinc-800 px-4 py-4 space-y-4 text-white"
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-800 text-sm text-zinc-100 placeholder-zinc-400 pl-10 pr-4 py-2 rounded-xl border border-zinc-700 focus:outline-none focus:border-amber-400"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            <div>
              <p className="text-xs font-semibold uppercase text-zinc-400 mb-2">Categories</p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, category: cat }));
                      navigateTo('products');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      filters.category === cat
                        ? 'bg-amber-400 text-zinc-950 font-bold'
                        : 'bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-3 flex flex-col gap-2 text-xs">
              <button
                onClick={() => {
                  navigateTo('account');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-lg text-zinc-200"
              >
                <User className="w-4 h-4 text-zinc-400" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => {
                  navigateTo('orders');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-lg text-zinc-200"
              >
                <PackageCheck className="w-4 h-4 text-zinc-400" />
                <span>My Orders</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secret Admin Password Modal */}
      <AnimatePresence>
        {showAdminPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
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
                  <h3 className="text-xl font-black text-zinc-900 tracking-tight">Admin Access</h3>
                  <p className="text-xs text-zinc-500 font-medium">Enter administrator password to continue</p>
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
                    Unlock Admin
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

