import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Tag, 
  Truck, 
  ShieldCheck, 
  ChevronRight,
  Plus,
  Minus,
  RotateCcw
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTax,
    cartTotal,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    navigateTo
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const freeShippingThreshold = 5000;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const amountNeeded = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyCouponCode(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400">
        <button onClick={() => navigateTo('home')} className="hover:text-white">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-amber-400 font-medium">Shopping Cart</span>
      </nav>

      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-3xl font-black text-white">Shopping Bag</h1>
          <p className="text-xs text-zinc-400 mt-1">Review your selected items before proceeding to checkout</p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-16 text-center space-y-4 max-w-lg mx-auto my-12">
          <div className="w-20 h-20 rounded-3xl bg-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-white">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-zinc-400">
            Explore our curated collections and discover high-grade products for your lifestyle.
          </p>
          <button
            onClick={() => navigateTo('products')}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-6 py-3 rounded-xl text-xs transition-colors shadow-lg shadow-amber-500/10"
          >
            Start Shopping Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Items List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free shipping bar */}
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-200 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-400" />
                  {amountNeeded === 0 ? (
                    <span className="text-emerald-400 font-bold">Free Express Shipping Unlocked!</span>
                  ) : (
                    <span>Add <strong className="text-amber-400">₹{Math.round(amountNeeded).toLocaleString('en-IN')}</strong> more for Free Shipping</span>
                  )}
                </span>
                <span className="text-xs font-bold text-zinc-400">{Math.round(progressToFreeShipping)}%</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* Item Rows */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl divide-y divide-zinc-800/80 overflow-hidden">
              {cart.map((item) => (
                <div key={item.product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 object-cover rounded-xl bg-zinc-800 shrink-0 border border-zinc-800"
                  />

                  <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-bold uppercase text-amber-400">{item.product.brand}</span>
                    <h3
                      onClick={() => navigateTo('product-detail', { productId: item.product.id })}
                      className="text-sm font-bold text-white hover:text-amber-400 cursor-pointer transition-colors truncate"
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-zinc-400">${(item.product.price ?? 0).toFixed(2)} each</p>
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="p-2 text-zinc-300 hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="p-2 text-zinc-300 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total Line & Remove */}
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="text-sm font-extrabold text-amber-400">
                      ₹{Math.round(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-800 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Summary Box */}
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-3">Order Summary</h3>

              {/* Coupon Box */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">Have a Coupon or Promo Code?</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <Tag className="w-4 h-4" />
                      <span>{appliedCoupon.code} Applied</span>
                    </div>
                    <button onClick={removeCoupon} className="text-[11px] text-rose-400 hover:underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. SUMMER20"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 px-3.5 py-2.5 rounded-xl border border-zinc-700 focus:outline-none focus:border-amber-500 uppercase"
                    />
                    <button
                      type="submit"
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold px-4 py-2.5 rounded-xl text-xs border border-zinc-700"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>}
              </div>

              {/* Summary Breakdown */}
              <div className="space-y-2.5 text-xs text-zinc-400 border-t border-zinc-800 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-200 font-semibold">${cartSubtotal.toFixed(2)}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-amber-400 font-semibold">
                    <span>Discount</span>
                    <span>-${cartDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>{cartShippingFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `$${cartShippingFee.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span>${(cartTax ?? 0).toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base font-black text-white pt-3 border-t border-zinc-800">
                  <span>Total Amount</span>
                  <span className="text-amber-400">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigateTo('checkout')}
                className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/10 transition-transform active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
