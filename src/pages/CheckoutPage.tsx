import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShippingAddress, PaymentDetails, Order } from '../types';
import { 
  CheckCircle2, 
  CreditCard, 
  Truck, 
  Lock, 
  ChevronRight, 
  PackageCheck, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  User as UserIcon,
  ShoppingBag,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    cartDiscount, 
    cartShippingFee, 
    cartTax, 
    cartTotal, 
    user, 
    createOrder, 
    navigateTo,
    setIsOnboardingModalOpen,
    addToast
  } = useShop();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(2); // Start at Shipping if cart has items
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shipping Form State
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user.name || 'Jane Doe',
    email: user.email || 'jane.doe@example.com',
    phone: user.phone || '+1 (555) 234-5678',
    street: user.addresses[0]?.street || '742 Evergreen Terrace',
    city: user.addresses[0]?.city || 'Springfield',
    state: user.addresses[0]?.state || 'IL',
    zipCode: user.addresses[0]?.zipCode || '62704',
    country: user.addresses[0]?.country || 'United States',
    isDefault: true
  });

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'paypal' | 'apple_pay' | 'cash_on_delivery'>('cash_on_delivery');

  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [cardHolder, setCardHolder] = useState('Jane Doe');

  // Placed Order Result
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.email || !shippingAddress.street) return;
    setStep(3);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!user.hasCompletedOnboarding) {
      setIsOnboardingModalOpen(true);
      addToast('Please save your official customer profile before placing order.', 'info');
      return;
    }

    setIsSubmitting(true);
    const paymentDetails: PaymentDetails = {
      method: paymentMethod,
      cardNumberLast4: cardNumber.replace(/\s/g, '').slice(-4) || '4242',
      cardBrand: paymentMethod === 'credit_card' ? 'Visa' : paymentMethod
    };

    try {
      const newOrder = await createOrder(shippingAddress, paymentDetails);
      setPlacedOrder(newOrder);
      setStep(4);
    } catch (err) {
      console.error('Order placement error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && step !== 4) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-blue-50 text-[#003882] rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-zinc-900">Your Cart is Empty</h2>
        <p className="text-xs text-zinc-500">Add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => navigateTo('products')}
          className="bg-[#003882] hover:bg-[#002866] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-colors"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Stepper Header */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#003882]' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${step >= 1 ? 'bg-[#003882] text-white' : 'bg-zinc-200 text-zinc-600'}`}>1</span>
            <span className="hidden sm:inline">Cart</span>
          </div>
          <div className="w-12 h-0.5 bg-zinc-200" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#003882]' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${step >= 2 ? 'bg-[#003882] text-white' : 'bg-zinc-200 text-zinc-600'}`}>2</span>
            <span>Shipping</span>
          </div>
          <div className="w-12 h-0.5 bg-zinc-200" />
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#003882]' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${step >= 3 ? 'bg-[#003882] text-white' : 'bg-zinc-200 text-zinc-600'}`}>3</span>
            <span>Payment</span>
          </div>
          <div className="w-12 h-0.5 bg-zinc-200" />
          <div className={`flex items-center gap-2 ${step >= 4 ? 'text-emerald-700' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${step >= 4 ? 'bg-emerald-600 text-white' : 'bg-zinc-200 text-zinc-600'}`}>4</span>
            <span>Confirmation</span>
          </div>
        </div>
      </div>

      {step === 4 && placedOrder ? (
        /* Step 4: Order Confirmation */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto bg-white border border-zinc-200 rounded-3xl p-8 space-y-6 text-center shadow-sm"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-zinc-900">Order Confirmed!</h1>
            <p className="text-xs text-zinc-500 mt-1">
              Thank you, <strong className="text-zinc-900">{placedOrder.userName}</strong>. Your order has been placed and sent to fulfillment.
            </p>
          </div>

          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-zinc-200 pb-2">
              <span className="text-zinc-500 font-medium">Order Reference:</span>
              <span className="font-mono font-bold text-[#003882]">{placedOrder.id}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-200 pb-2">
              <span className="text-zinc-500 font-medium">Tracking Number:</span>
              <span className="font-mono font-bold text-zinc-800">{placedOrder.trackingNumber}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-200 pb-2">
              <span className="text-zinc-500 font-medium">Estimated Delivery:</span>
              <span className="font-bold text-emerald-700">{placedOrder.estimatedDelivery}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-zinc-500 font-medium">Total Paid:</span>
              <span className="font-extrabold text-zinc-900">₹{(placedOrder.total ?? 0).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigateTo('order-detail', { orderId: placedOrder.id })}
              className="flex-1 bg-[#003882] hover:bg-[#002866] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Track Live Order Status</span>
            </button>

            <button
              onClick={() => navigateTo('products')}
              className="bg-white hover:bg-zinc-50 text-zinc-700 font-bold py-3 px-5 rounded-xl text-xs border border-zinc-300 shadow-xs"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      ) : (
        /* Main Checkout Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Area */}
          <div className="lg:col-span-2 space-y-6">
            {step === 2 && (
              /* Step 2: Shipping Form */
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleShippingSubmit}
                className="bg-white border border-zinc-200 rounded-3xl p-6 space-y-4 shadow-xs"
              >
                <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                  <Truck className="w-5 h-5 text-[#003882]" />
                  <h2 className="text-base font-bold text-zinc-900">Shipping Address & Contact</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#003882]"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                      className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#003882]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-zinc-700 font-bold mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#003882]"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#003882]"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">State / Province</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#003882]"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Zip / Postal Code</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#003882]"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#003882]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => navigateTo('cart')}
                    className="text-xs text-zinc-500 hover:text-zinc-900 font-medium"
                  >
                    Back to Cart
                  </button>

                  <button
                    type="submit"
                    className="bg-[#003882] hover:bg-[#002866] text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>
            )}

            {step === 3 && (
              /* Step 3: Payment Form */
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handlePlaceOrder}
                className="bg-white border border-zinc-200 rounded-3xl p-6 space-y-6 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#003882]" />
                    <h2 className="text-base font-bold text-zinc-900">Payment Method</h2>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>256-Bit SSL Encrypted</span>
                  </span>
                </div>

                {/* Payment Options */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-black text-emerald-800 text-sm">
                    <span>💵 Cash on Delivery (COD)</span>
                    <span className="px-2 py-0.5 bg-emerald-700 text-white font-extrabold text-[10px] rounded uppercase">Available</span>
                  </div>
                  <p className="text-emerald-700 font-medium">
                    No upfront online payment required! Pay in cash directly to our courier executive when your order arrives at your address.
                  </p>
                </div>


                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-zinc-700 font-bold mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#003882]"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-700 font-bold mb-1">Card Number</label>
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#003882] font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-zinc-700 font-bold mb-1">Expiry Date</label>
                        <input
                          type="text"
                          required
                          disabled={isSubmitting}
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#003882] font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-700 font-bold mb-1">CVC / CVV</label>
                        <input
                          type="password"
                          required
                          disabled={isSubmitting}
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#003882] font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setStep(2)}
                    className="text-xs text-zinc-500 hover:text-zinc-900 font-medium"
                  >
                    Back to Shipping
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-[#003882] hover:bg-[#002866] text-white font-extrabold px-8 py-3.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Order...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Authorize &amp; Pay ₹{(cartTotal ?? 0).toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </div>

          {/* Right: Summary */}
          <div className="space-y-6">
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-100 pb-3">Items ({cart.length})</h3>

              <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 text-xs">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-xl bg-zinc-100 border border-zinc-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-zinc-900 truncate">{item.product.name}</p>
                      <p className="text-zinc-500">Qty: {item.quantity} × ₹{(item.product.price ?? 0).toFixed(2)}</p>
                    </div>
                    <span className="font-extrabold text-zinc-900">₹{((item.product.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-100 pt-3 space-y-2 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{(cartSubtotal ?? 0).toFixed(2)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span>-₹{(cartDiscount ?? 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{cartShippingFee === 0 ? 'FREE' : `₹${(cartShippingFee ?? 0).toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-zinc-900 pt-2 border-t border-zinc-100">
                  <span>Total</span>
                  <span className="text-[#003882]">₹{(cartTotal ?? 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

