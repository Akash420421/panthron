import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  SlidersHorizontal, 
  PackageCheck, 
  User, 
  Home,
  X,
  RotateCcw,
  Check,
  Grid,
  ListFilter,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category } from '../types';

const CATEGORIES: Category[] = [
  'All',
  'Electronics',
  'Fashion',
  'Home & Living',
  'Beauty',
  'Sports',
  'Accessories'
];

export const BottomNav: React.FC = () => {
  const { currentRoute, navigateTo, filters, setFilters, resetFilters, orders } = useShop();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  const activeFiltersCount = 
    (filters.category !== 'All' ? 1 : 0) +
    (filters.searchQuery ? 1 : 0) +
    (filters.brands.length > 0 ? 1 : 0);

  const handleFilterClick = () => {
    if (currentRoute !== 'products') {
      navigateTo('products');
    }
    setIsFilterModalOpen(true);
  };

  const handleSortClick = () => {
    if (currentRoute !== 'products') {
      navigateTo('products');
    }
    setIsSortModalOpen(true);
  };

  return (
    <>
      {/* Sticky Bottom Bar (Exact match to mobile shopping apps) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-zinc-200/90 backdrop-blur-xl px-2 sm:px-6 py-2 shadow-lg text-zinc-800">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-1 text-center">
          {/* Home Button */}
          <button
            onClick={() => navigateTo('home')}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              currentRoute === 'home'
                ? 'text-[#003882] font-black bg-blue-50'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] sm:text-xs">Home</span>
          </button>

          {/* Filter Button with Badge Count like Screenshot */}
          <button
            onClick={handleFilterClick}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
              currentRoute === 'products' && isFilterModalOpen
                ? 'text-[#003882] font-black bg-blue-50'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <div className="relative flex items-center gap-1">
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#003882] text-white font-extrabold text-[9px] flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
              <SlidersHorizontal className="w-5 h-5 mb-0.5" />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold">Filter</span>
          </button>

          {/* Catalog Products */}
          <button
            onClick={() => navigateTo('products')}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              currentRoute === 'products' && !isFilterModalOpen && !isSortModalOpen
                ? 'text-[#003882] font-black bg-blue-50'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Grid className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] sm:text-xs font-semibold">Products</span>
          </button>

          {/* Sort By Trigger */}
          <button
            onClick={handleSortClick}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isSortModalOpen
                ? 'text-[#003882] font-black bg-blue-50'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <ArrowUpDown className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] sm:text-xs whitespace-nowrap font-semibold">Sort By</span>
          </button>

          {/* View Your Orders */}
          <button
            onClick={() => navigateTo('orders')}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
              currentRoute === 'orders' || currentRoute === 'order-detail'
                ? 'text-[#003882] font-black bg-blue-50'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <PackageCheck className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] sm:text-xs whitespace-nowrap font-semibold">Orders</span>
            {orders.length > 0 && (
              <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-[#003882]" />
            )}
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div
              onClick={() => setIsFilterModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl z-10 max-h-[85vh] overflow-y-auto space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#003882]" />
                  <h3 className="text-base font-black text-zinc-900">Filter Products</h3>
                </div>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, category: cat }));
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                        filters.category === cat
                          ? 'bg-[#003882] text-white shadow-md'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                      }`}
                    >
                      <span>{cat}</span>
                      {filters.category === cat && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Limit Slider */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-700 uppercase">Max Price</span>
                  <span className="text-[#003882] font-black text-sm">${filters.priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={500}
                  step={10}
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: [0, Number(e.target.value)]
                    }))
                  }
                  className="w-full accent-[#003882] bg-zinc-200 h-2 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-zinc-100 flex items-center gap-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={() => {
                    setIsFilterModalOpen(false);
                    navigateTo('products');
                  }}
                  className="flex-1 bg-[#003882] hover:bg-[#002866] text-white font-black py-3 rounded-xl text-xs shadow-lg text-center"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sort By Modal */}
      <AnimatePresence>
        {isSortModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div
              onClick={() => setIsSortModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm bg-white border border-zinc-200 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-5 h-5 text-[#003882]" />
                  <h3 className="text-base font-black text-zinc-900">Sort Catalog By</h3>
                </div>
                <button
                  onClick={() => setIsSortModalOpen(false)}
                  className="p-1 rounded-full bg-zinc-100 text-zinc-500 hover:text-zinc-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1.5">
                {[
                  { label: 'Featured First', value: 'featured' },
                  { label: 'Price: Low to High', value: 'price-low' },
                  { label: 'Price: High to Low', value: 'price-high' },
                  { label: 'Highest Customer Rating', value: 'rating' },
                  { label: 'New Arrivals', value: 'newest' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, sortBy: option.value as any }));
                      setIsSortModalOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                      filters.sortBy === option.value
                        ? 'bg-[#003882] text-white font-black'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    <span>{option.label}</span>
                    {filters.sortBy === option.value && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

