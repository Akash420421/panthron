import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, navigateTo } = useShop();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-3xl font-black text-white">Saved Wishlist</h1>
          <p className="text-xs text-zinc-400 mt-1">Keep track of your favorite items and move them to cart anytime</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-zinc-800 text-amber-400 rounded-full">
          {wishlist.length} Saved
        </span>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-16 text-center space-y-4 max-w-lg mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-rose-400 mx-auto">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <h2 className="text-xl font-bold text-white">Your Wishlist is Empty</h2>
          <p className="text-xs text-zinc-400">
            Browse our catalog and tap the heart icon on any product card to save it for later.
          </p>
          <button
            onClick={() => navigateTo('products')}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-6 py-3 rounded-xl text-xs"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <ProductCard key={item.product.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
};
