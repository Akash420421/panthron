import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Star, ShoppingCart, Heart, Check, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isInWishlist, navigateTo } = useShop();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const isLiked = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity);
    setQuickViewProduct(null);
  };

  const handleViewFullDetails = () => {
    const id = quickViewProduct.id;
    setQuickViewProduct(null);
    navigateTo('product-detail', { productId: id });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white border border-zinc-200 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close Button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Image Gallery */}
          <div className="md:w-1/2 bg-zinc-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-200">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-zinc-200">
              <img
                src={quickViewProduct.images[selectedImageIndex] || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {quickViewProduct.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIndex === idx ? 'border-[#003882] scale-105' : 'border-zinc-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-black text-[#003882] uppercase tracking-wider">{quickViewProduct.brand}</span>
                <h2 className="text-xl font-black text-zinc-900 mt-1">{quickViewProduct.name}</h2>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-sm font-black text-zinc-900">{quickViewProduct.rating.toFixed(1)}</span>
                <span className="text-xs font-semibold text-zinc-500">({quickViewProduct.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#003882]">${quickViewProduct.price.toFixed(2)}</span>
                {quickViewProduct.originalPrice && (
                  <span className="text-sm text-zinc-400 line-through font-semibold">${quickViewProduct.originalPrice.toFixed(2)}</span>
                )}
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3 font-medium">{quickViewProduct.description}</p>

              {/* Quantity Selector */}
              <div className="pt-2">
                <label className="text-xs font-black text-zinc-700 block mb-1.5">Quantity</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-zinc-100 border border-zinc-300 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200 transition-colors font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-extrabold text-zinc-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(quickViewProduct.stock, quantity + 1))}
                      className="px-3 py-1.5 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200 transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-emerald-700 font-bold">In Stock ({quickViewProduct.stock} available)</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-zinc-200 space-y-3 mt-4">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#003882] hover:bg-[#002866] text-white font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart (${(quickViewProduct.price * quantity).toFixed(2)})</span>
                </button>

                <button
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className={`p-3 rounded-xl border transition-colors ${
                    isLiked
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'bg-zinc-100 border-zinc-300 text-zinc-700 hover:text-zinc-900'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleViewFullDetails}
                className="w-full py-2 text-center text-xs text-zinc-600 hover:text-[#003882] font-extrabold flex items-center justify-center gap-1"
              >
                <span>View Full Specifications & Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
