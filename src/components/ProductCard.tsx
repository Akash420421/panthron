import React from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Star, Heart, Eye, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useShop();

  const isLiked = isInWishlist(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const formatPrice = (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
      style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
      className="group relative bg-[#F5F5F7] border border-zinc-200/80 rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
    >
      {/* Image Container with Studio Light background */}
      <div 
        className="relative aspect-square w-full bg-[#EAEAEA] overflow-hidden cursor-pointer"
        onClick={() => navigateTo('product-detail', { productId: product.id })}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Left Sale / Discount Badge (Matches Skechers Red Badge) */}
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none flex flex-col gap-1">
          {discountPercent > 0 ? (
            <span className="px-2.5 py-0.5 bg-[#C8102E] text-white font-bold text-[10px] uppercase tracking-wider rounded-xs shadow-sm">
              Sale
            </span>
          ) : product.isNew ? (
            <span className="px-2.5 py-0.5 bg-[#0051A5] text-white font-bold text-[10px] uppercase tracking-wider rounded-xs shadow-sm">
              New
            </span>
          ) : null}
        </div>

        {/* Top Right Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full transition-all z-10 ${
            isLiked
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-white/80 text-zinc-700 hover:text-rose-600 hover:bg-white shadow-sm'
          }`}
          title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button Hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="px-3 py-1.5 bg-white/90 hover:bg-white text-zinc-900 text-[11px] font-bold rounded-lg shadow-lg border border-zinc-200 transition-transform active:scale-95"
          >
            <Eye className="w-3.5 h-3.5 text-blue-700" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Details (Exact Skechers screenshot match) */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-1.5 bg-[#F5F5F7]">
        <div className="space-y-1">
          {/* Sub-label (Gender/Category) */}
          <p className="text-[11px] font-normal text-zinc-600 tracking-normal capitalize">
            {product.category === 'Fashion' ? 'Women' : product.category}
          </p>

          {/* Product Title */}
          <h3
            onClick={() => navigateTo('product-detail', { productId: product.id })}
            className="text-xs sm:text-sm font-black text-zinc-900 group-hover:text-blue-700 line-clamp-1 cursor-pointer transition-colors uppercase tracking-tight"
          >
            {product.name}
          </h3>

          {/* Price Block */}
          <div className="pt-0.5">
            <div className="text-sm sm:text-base font-bold text-zinc-900">
              {formatPrice(product.price)}
            </div>

            {product.originalPrice && (
              <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
                <span className="text-zinc-500 line-through">
                  MRP {formatPrice(product.originalPrice)}
                </span>
                {discountPercent > 0 && (
                  <span className="text-[#C8102E] font-bold">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Blue status link at bottom (Matches "First Time on Sale" in screenshot) */}
          <div className="pt-1.5 flex items-center justify-between text-[11px]">
            <span 
              onClick={() => navigateTo('product-detail', { productId: product.id })}
              className="text-[#0051A5] hover:underline font-medium cursor-pointer"
            >
              First Time on Sale
            </span>
            
            <button
              onClick={() => addToCart(product, 1)}
              disabled={product.stock <= 0}
              className="p-1.5 rounded-lg bg-[#0051A5] hover:bg-[#003882] text-white font-bold transition-transform active:scale-90"
              title="Add to Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

