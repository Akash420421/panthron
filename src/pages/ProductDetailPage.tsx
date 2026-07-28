import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Share2, 
  CheckCircle2, 
  ChevronRight,
  Plus,
  Minus,
  MessageSquarePlus,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailPage: React.FC = () => {
  const { 
    products, 
    selectedProductId, 
    navigateTo, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    addProductReview,
    addToast
  } = useShop();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');

  // Review Form Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <button onClick={() => navigateTo('products')} className="bg-amber-500 text-zinc-950 px-4 py-2 rounded-xl text-xs font-bold">
          Back to Catalog
        </button>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !reviewerName.trim()) return;

    addProductReview(product.id, {
      userName: reviewerName.trim(),
      rating: newRating,
      comment: newComment.trim(),
      verifiedPurchase: true
    });

    setIsReviewModalOpen(false);
    setNewComment('');
    setReviewerName('');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!', 'info');
    }
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
        <button onClick={() => navigateTo('home')} className="hover:text-[#003882]">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
        <button onClick={() => navigateTo('products')} className="hover:text-[#003882]">Catalog</button>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
        <span className="text-[#003882] font-extrabold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-zinc-200 shadow-lg">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-300"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-lg shadow-md">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIndex === idx ? 'border-[#003882] scale-105 shadow-md' : 'border-zinc-200 opacity-70'
                  }`}
                >
                  <img src={img} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info & Purchase */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#003882]">{product.brand}</span>
              <span className="text-xs text-zinc-500 font-bold">SKU: {product.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1 leading-snug tracking-tight">{product.name}</h1>
          </div>

          {/* Rating Summary */}
          <div className="flex items-center gap-3">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-zinc-300'}`}
                />
              ))}
            </div>
            <span className="text-sm font-black text-zinc-900">{(product.rating ?? 0).toFixed(1)}</span>
            <span className="text-xs font-semibold text-zinc-500">({product.reviewCount} customer reviews)</span>
          </div>

          {/* Price */}
          <div className="p-4 bg-white border border-zinc-200 rounded-2xl flex items-baseline gap-3 shadow-xs">
            <span className="text-3xl font-black text-[#003882]">${(product.price ?? 0).toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-zinc-400 line-through font-semibold">${(product.originalPrice ?? 0).toFixed(2)}</span>
            )}
            <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>In Stock ({product.stock} available)</span>
            </span>
          </div>

          {/* Description Short */}
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-medium">{product.description}</p>

          {/* Feature Highlights */}
          <div className="space-y-2">
            <p className="text-xs font-black uppercase text-zinc-700 tracking-wider">Highlights</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-700 font-semibold">
              {product.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#003882] shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quantity & Actions */}
          <div className="pt-4 border-t border-zinc-200 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-[auto_1fr_auto_auto] items-center gap-3">
              <div className="flex items-center bg-zinc-100 border border-zinc-300 rounded-xl overflow-hidden p-1 w-full sm:w-auto col-span-2 sm:col-span-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex-1 sm:flex-none px-3 sm:px-3 py-1.5 text-zinc-700 hover:text-zinc-900 font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-sm font-black text-zinc-900 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="flex-1 sm:flex-none px-3 sm:px-3 py-1.5 text-zinc-700 hover:text-zinc-900 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                className="col-span-2 sm:col-span-1 bg-[#003882] hover:bg-[#002866] text-white font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 w-full"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart (₹{((product.price ?? 0) * (quantity ?? 0)).toFixed(2)})</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border transition-colors flex items-center justify-center ${
                  isLiked
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : 'bg-zinc-100 border-zinc-300 text-zinc-700 hover:text-zinc-900'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-3.5 bg-zinc-100 border border-zinc-300 rounded-xl text-zinc-700 hover:text-zinc-900 flex items-center justify-center"
                title="Share Link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => {
                addToCart(product, quantity);
                navigateTo('checkout');
              }}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-black py-3.5 rounded-xl text-xs transition-colors shadow-md active:scale-[0.98]"
            >
              Buy Now with Express Checkout
            </button>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-white rounded-xl border border-zinc-200 text-[11px] text-zinc-600 font-bold text-center shadow-xs">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-[#003882]" />
              <span>Free Shipping over ₹5000</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-[#003882]" />
              <span>30-Day Returns</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#003882]" />
              <span>2-Year Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Specs & Reviews */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="flex border-b border-zinc-200 bg-zinc-50">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3.5 text-xs font-black border-b-2 transition-colors ${
              activeTab === 'details' ? 'border-[#003882] text-[#003882] bg-white' : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Full Details & Features
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-3.5 text-xs font-black border-b-2 transition-colors ${
              activeTab === 'specs' ? 'border-[#003882] text-[#003882] bg-white' : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3.5 text-xs font-black border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'reviews' ? 'border-[#003882] text-[#003882] bg-white' : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <span>Customer Reviews</span>
            <span className="px-2 py-0.5 bg-blue-50 text-[#003882] rounded-full text-[10px] font-black border border-blue-200">
              {product.reviews.length}
            </span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-4 text-xs text-zinc-700 leading-relaxed max-w-3xl font-medium">
              <h3 className="text-base font-black text-zinc-900">Product Overview</h3>
              <p>{product.description}</p>
              <div className="pt-2 space-y-2">
                <h4 className="font-bold text-zinc-900">Key Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-zinc-600 pl-2">
                  {product.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <table className="w-full text-xs text-left text-zinc-700 divide-y divide-zinc-200">
                <tbody>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <tr key={key} className="hover:bg-zinc-50">
                      <td className="py-2.5 font-bold text-zinc-500 w-1/3">{key}</td>
                      <td className="py-2.5 text-zinc-900 font-semibold">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-black text-[#003882]">{(product.rating ?? 0).toFixed(1)}</div>
                  <div>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-zinc-300'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-500 font-semibold mt-0.5">Based on {product.reviewCount} verified reviews</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="bg-[#003882] hover:bg-[#002866] text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>Write a Review</span>
                </button>
              </div>

              {/* Review List */}
              {product.reviews.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-6 font-medium">No customer reviews yet. Be the first to leave a review!</p>
              ) : (
                <div className="space-y-4 divide-y divide-zinc-200">
                  {product.reviews.map((rev) => (
                    <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-zinc-900">{rev.userName}</span>
                          {rev.verifiedPurchase && (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-400 font-medium">{rev.date}</span>
                      </div>

                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-zinc-300'}`} />
                        ))}
                      </div>

                      <p className="text-xs text-zinc-700 leading-relaxed font-medium">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-zinc-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <h3 className="font-extrabold text-zinc-900 text-sm">Write a Product Review</h3>
                <button onClick={() => setIsReviewModalOpen(false)} className="p-1 text-zinc-500 hover:text-zinc-900">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="text-amber-500 p-1"
                      >
                        <Star className={`w-6 h-6 ${star <= newRating ? 'fill-current' : 'text-zinc-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Rivera"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#003882] font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Your Review Comment</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="What did you like or dislike about this product?"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#003882] font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#003882] hover:bg-[#002866] text-white font-black py-3 rounded-xl transition-colors shadow-md"
                >
                  Submit Review
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <h3 className="text-xl font-black text-zinc-900 tracking-tight">You Might Also Like</h3>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
