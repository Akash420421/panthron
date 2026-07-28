import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  CheckCircle2, 
  Truck,
  Plus,
  Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
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

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput) return;

    const res = applyCouponCode(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const freeShippingThreshold = 5000;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartDrawerOpen(false)}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white border-l border-zinc-200 text-zinc-800 flex flex-col shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#003882] flex items-center justify-center font-bold border border-blue-200">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-zinc-900">Your Shopping Cart</h3>
                  <p className="text-xs text-zinc-500 font-medium">({cart.length} unique items)</p>
                </div>
              </div>

              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="p-4 bg-blue-50/60 border-b border-blue-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-zinc-700">
                  <Truck className="w-3.5 h-3.5 text-[#003882]" />
                  {amountNeededForFreeShipping === 0 ? (
                    <span className="text-emerald-700 font-extrabold">You unlocked FREE Shipping!</span>
                  ) : (
                    <span>Add <strong className="text-[#003882]">₹{Math.round(amountNeededForFreeShipping).toLocaleString('en-IN')}</strong> for Free Shipping</span>
                  )}
                </span>
                <span className="text-[11px] font-bold text-zinc-500">{Math.round(progressToFreeShipping)}%</span>
              </div>
              <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#003882] h-full transition-all duration-300"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-zinc-200">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-zinc-900">Your cart is currently empty</h4>
                    <p className="text-xs text-zinc-500 mt-1 max-w-xs font-medium">
                      Looks like you haven't added any products to your shopping bag yet.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      navigateTo('products');
                    }}
                    className="mt-2 bg-[#003882] hover:bg-[#002866] text-white font-black px-5 py-2.5 rounded-xl text-xs transition-colors shadow-md"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-cover rounded-xl bg-zinc-100 shrink-0 border border-zinc-200"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-black text-zinc-900 truncate">{item.product.name}</h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-zinc-400 hover:text-rose-600 p-1 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] font-semibold text-zinc-500">
                          ₹{Math.round(item.product.price).toLocaleString('en-IN')} each
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Counter */}
                        <div className="flex items-center bg-zinc-100 rounded-lg border border-zinc-300">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 rounded-l-lg"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-extrabold text-zinc-900">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 rounded-r-lg"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-black text-[#003882]">
                          ₹{Math.round(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div className="p-4 bg-zinc-50 border-t border-zinc-200 space-y-3">
                {/* Coupon Code Section */}
                <div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs">
                      <div className="flex items-center gap-1.5 text-[#003882] font-bold">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Code <strong>{appliedCoupon.code}</strong> Applied</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-[11px] text-rose-600 hover:underline font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo Code (e.g. SUMMER20)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 bg-white text-xs text-zinc-900 placeholder-zinc-400 px-3 py-2 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#003882] uppercase font-bold"
                      />
                      <button
                        type="submit"
                        className="bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold px-3 py-2 rounded-xl text-xs transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && <p className="text-[11px] text-rose-600 font-semibold mt-1">{couponError}</p>}
                </div>

                {/* Breakdown */}
                <div className="space-y-1.5 text-xs text-zinc-600 font-semibold">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-zinc-900">₹{Math.round(cartSubtotal).toLocaleString('en-IN')}</span>
                  </div>

                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-red-600 font-bold">
                      <span>Discount</span>
                      <span>-₹{Math.round(cartDiscount).toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{cartShippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${Math.round(cartShippingFee).toLocaleString('en-IN')}`}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span>₹{Math.round(cartTax).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-zinc-200 text-sm font-black text-zinc-900">
                    <span>Total Amount</span>
                    <span className="text-[#003882]">₹{Math.round(cartTotal).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      navigateTo('checkout');
                    }}
                    className="w-full bg-[#003882] hover:bg-[#002866] text-white font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex justify-between text-[11px] text-zinc-500 font-semibold px-1">
                    <button
                      onClick={() => {
                        setIsCartDrawerOpen(false);
                        navigateTo('cart');
                      }}
                      className="hover:text-zinc-900 underline"
                    >
                      View Full Shopping Cart Page
                    </button>
                    <button onClick={clearCart} className="hover:text-rose-600">
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
