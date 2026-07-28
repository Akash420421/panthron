import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { HeroSlider } from '../components/HeroSlider';
import { Category } from '../types';
import { ChevronRight, Footprints, Flame, Sparkles } from 'lucide-react';

const FEATURED_CATEGORIES: { name: Category; image: string; tag: string }[] = [
  {
    name: 'Sleeper',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80',
    tag: 'Men, Women, Kids & New Style'
  },
  {
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    tag: 'Headphones, Watches & Tech'
  },
  {
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80',
    tag: 'Cashmere, Sweaters & Style'
  },
  {
    name: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=600&q=80',
    tag: 'Diffusers, Kettles & Decor'
  },
  {
    name: 'Beauty',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
    tag: 'Serums, Skincare & Glow'
  },
  {
    name: 'Sports',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80',
    tag: 'Yoga Mats & Gear'
  }
];

const SLEEPER_SUBCATEGORIES = [
  {
    id: 'man',
    title: 'Man',
    subtitle: 'Orthopedic & Comfort Sleepers',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
    filterKey: 'Men'
  },
  {
    id: 'women',
    title: 'Women',
    subtitle: 'Plush Faux Velvet & Cloud Slides',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
    filterKey: 'Women'
  },
  {
    id: 'kid',
    title: 'Kid',
    subtitle: 'Cute Bunny & Non-Slip Sleepers',
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=80',
    filterKey: 'Kids'
  },
  {
    id: 'newstyle',
    title: 'New Style',
    subtitle: 'AirCushion Pillow Slides 2026',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80',
    filterKey: 'New Style'
  }
];

export const HomePage: React.FC = () => {
  const { products, navigateTo, setFilters } = useShop();
  const [selectedSleeperTab, setSelectedSleeperTab] = useState<string>('all');

  // Filter Sleeper products according to sub-tab
  const sleeperProducts = products.filter((p) => p.category === 'Sleeper');

  // Trending section products
  const trendingProducts = products.filter((p) => p.isTrending || p.rating >= 4.7).slice(0, 4);

  const handleSleeperSubClick = (subFilter: string) => {
    setSelectedSleeperTab(subFilter);
    setFilters((prev) => ({ 
      ...prev, 
      category: 'Sleeper',
      searchQuery: subFilter === 'all' ? '' : subFilter
    }));
    navigateTo('products');
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Auto-sliding Hero Carousel */}
      <HeroSlider />

      {/* SPECIAL SLEEPER CATEGORY SECTION */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gradient-to-r from-[#003882] to-blue-900 p-5 rounded-2xl text-white shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <Footprints className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">Sleeper Category</h2>
            </div>
            <p className="text-xs text-blue-200 font-medium mt-1">
              Premium Pillow Comfort Sleepers for Man, Women, Kid & New Styles
            </p>
          </div>
          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, category: 'Sleeper', searchQuery: '' }));
              navigateTo('products');
            }}
            className="bg-amber-400 hover:bg-amber-300 text-zinc-950 px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto shadow-md"
          >
            <span>Explore All Sleepers ({sleeperProducts.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Sleeper Sub-categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {SLEEPER_SUBCATEGORIES.map((sub) => (
            <button
              key={sub.id}
              onClick={() => handleSleeperSubClick(sub.filterKey)}
              className="group relative h-40 sm:h-48 rounded-2xl overflow-hidden border border-zinc-200 text-left transition-all hover:border-[#003882] hover:shadow-xl bg-zinc-900"
            >
              <img
                src={sub.image}
                alt={sub.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 space-y-0.5">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Sleeper
                </span>
                <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                  {sub.title}
                </h3>
                <p className="text-[11px] text-zinc-300 line-clamp-1">{sub.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* TRENDING PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Flame className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">Trending Products</h2>
              <p className="text-xs text-zinc-500 font-semibold">Highest rated items trending this week</p>
            </div>
          </div>
          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, category: 'All' }));
              navigateTo('products');
            }}
            className="text-[#003882] hover:underline font-extrabold text-xs flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2 cards per row on mobile/tablet */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ALL PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">All Products</h2>
            <p className="text-xs text-zinc-500 font-semibold mt-0.5">Showing all {products.length} products in store</p>
          </div>
          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, category: 'All' }));
              navigateTo('products');
            }}
            className="text-[#003882] hover:underline font-extrabold text-xs flex items-center gap-1"
          >
            <span>Filter Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* All Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};


