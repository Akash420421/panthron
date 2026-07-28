import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Category, Product } from '../types';
import { 
  Filter, 
  X, 
  Search, 
  SlidersHorizontal, 
  Grid, 
  List, 
  Star, 
  RotateCcw,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES: Category[] = [
  'All',
  'Electronics',
  'Fashion',
  'Home & Living',
  'Beauty',
  'Sports',
  'Accessories'
];

export const ProductsPage: React.FC = () => {
  const { products, filters, setFilters, resetFilters, navigateTo, addToCart } = useShop();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Extract unique brands
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.brand));
    return Array.from(set);
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchBrand && !matchCat && !matchTag) return false;
        }

        // Category
        if (filters.category !== 'All' && p.category !== filters.category) {
          return false;
        }

        // Price range
        if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) {
          return false;
        }

        // Brands
        if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) {
          return false;
        }

        // Min Rating
        if (p.rating < filters.minRating) {
          return false;
        }

        // Stock
        if (filters.inStockOnly && p.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-low') return a.price - b.price;
        if (filters.sortBy === 'price-high') return b.price - a.price;
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        if (filters.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, filters]);

  // Brand toggle handler
  const handleBrandToggle = (brand: string) => {
    setFilters((prev) => {
      const exists = prev.brands.includes(brand);
      const updated = exists
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands: updated };
    });
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.category !== 'All' ||
    filters.brands.length > 0 ||
    filters.minRating > 0 ||
    filters.inStockOnly ||
    filters.priceRange[1] < 500;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-300">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">Slippers/Sandals</h1>
          <p className="text-xs font-semibold text-zinc-600 mt-0.5">
            {filteredProducts.length} items available
          </p>
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
        >
          <Filter className="w-4 h-4 text-[#003882]" />
          <span>Filters ({hasActiveFilters ? 'Active' : 'All'})</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block space-y-6 bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2 font-black text-sm text-zinc-900">
              <SlidersHorizontal className="w-4 h-4 text-[#003882]" />
              <span>Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#003882] hover:underline font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-zinc-600">Category</label>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-between ${
                    filters.category === cat
                      ? 'bg-blue-50 text-[#003882] border border-blue-200'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  <span>{cat}</span>
                  {filters.category === cat && <Check className="w-3.5 h-3.5 text-[#003882]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3 pt-4 border-t border-zinc-100">
            <div className="flex justify-between items-center text-xs">
              <label className="font-black uppercase text-zinc-600">Price Limit</label>
              <span className="text-[#003882] font-black">${filters.priceRange[1]}</span>
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
              className="w-full accent-[#003882] bg-zinc-200 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-semibold">
              <span>$0</span>
              <span>$250</span>
              <span>$500+</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2 pt-4 border-t border-zinc-100">
            <label className="text-xs font-black uppercase text-zinc-600">Minimum Rating</label>
            <div className="space-y-1">
              {[4.5, 4.0, 3.5, 0].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilters((prev) => ({ ...prev, minRating: rating }))}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
                    filters.minRating === rating
                      ? 'bg-blue-50 text-[#003882] border border-blue-200'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span>{rating === 0 ? 'All Ratings' : `${rating}+ Stars`}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brands Filter */}
          <div className="space-y-2 pt-4 border-t border-zinc-100">
            <label className="text-xs font-black uppercase text-zinc-600">Brands</label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar">
              {availableBrands.map((brand) => {
                const isSelected = filters.brands.includes(brand);
                return (
                  <label
                    key={brand}
                    className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer hover:text-zinc-900 font-medium"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleBrandToggle(brand)}
                      className="rounded accent-[#003882] bg-zinc-100 border-zinc-300"
                    />
                    <span>{brand}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Stock Availability Toggle */}
          <div className="pt-4 border-t border-zinc-100">
            <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
                }
                className="rounded accent-[#003882] bg-zinc-100 border-zinc-300"
              />
              <span>In Stock Items Only</span>
            </label>
          </div>
        </aside>

        {/* Main Content Product Grid */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Control Bar */}
          <div className="bg-white border border-zinc-200 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="text-xs text-zinc-600 font-medium w-full sm:w-auto">
              Showing <strong className="text-zinc-900 font-black">{filteredProducts.length}</strong> of{' '}
              <strong className="text-zinc-900 font-black">{products.length}</strong> items
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-zinc-500 hidden sm:inline">Sort By:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))
                  }
                  className="bg-zinc-100 text-zinc-900 text-xs px-3 py-2 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#003882] cursor-pointer font-bold"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">New Arrivals</option>
                </select>
              </div>

              {/* View Switcher */}
              <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-[#003882] text-white font-bold' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-[#003882] text-white font-bold' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-zinc-500 font-bold">Active Filters:</span>

              {filters.searchQuery && (
                <span className="px-2.5 py-1 bg-white border border-zinc-300 text-[#003882] rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs">
                  <span>Search: "{filters.searchQuery}"</span>
                  <X
                    className="w-3.5 h-3.5 cursor-pointer hover:text-red-600"
                    onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                  />
                </span>
              )}

              {filters.category !== 'All' && (
                <span className="px-2.5 py-1 bg-white border border-zinc-300 text-[#003882] rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs">
                  <span>Cat: {filters.category}</span>
                  <X
                    className="w-3.5 h-3.5 cursor-pointer hover:text-red-600"
                    onClick={() => setFilters((prev) => ({ ...prev, category: 'All' }))}
                  />
                </span>
              )}

              {filters.brands.map((b) => (
                <span
                  key={b}
                  className="px-2.5 py-1 bg-white border border-zinc-300 text-[#003882] rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <span>Brand: {b}</span>
                  <X
                    className="w-3.5 h-3.5 cursor-pointer hover:text-red-600"
                    onClick={() => handleBrandToggle(b)}
                  />
                </span>
              ))}

              <button
                onClick={resetFilters}
                className="text-xs text-red-600 hover:underline font-extrabold ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Product Cards List */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 text-zinc-400 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-zinc-900">No products match your criteria</h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Try adjusting your search query, increasing your price limit, or selecting another category.
              </p>
              <button
                onClick={resetFilters}
                className="bg-[#003882] hover:bg-[#002866] text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigateTo('product-detail', { productId: product.id })}
                  className="bg-white border border-zinc-200 hover:border-zinc-300 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 cursor-pointer transition-all hover:shadow-md"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full sm:w-40 h-40 object-contain rounded-xl bg-[#EAEAEA] shrink-0 p-2"
                  />
                  <div className="flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold">
                        <span>{product.brand}</span>
                        <span className="text-zinc-500">{product.category}</span>
                      </div>
                      <h3 className="text-base font-black text-zinc-900 hover:text-[#003882] transition-colors mt-1 uppercase">
                        {product.name}
                      </h3>
                      <p className="text-xs text-zinc-600 line-clamp-2 mt-1">{product.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-zinc-900">${(product.price ?? 0).toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-zinc-400 line-through">${(product.originalPrice ?? 0).toFixed(2)}</span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, 1);
                        }}
                        className="bg-[#003882] hover:bg-[#002866] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="relative w-full max-w-xs bg-zinc-900 border-r border-zinc-800 p-6 overflow-y-auto space-y-6 text-zinc-100 z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <span className="font-bold text-sm">Filter Catalog</span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">Category</label>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, category: cat }));
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                        filters.category === cat ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Done Button */}
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-amber-500 text-zinc-950 font-bold py-3 rounded-xl text-xs mt-6"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
