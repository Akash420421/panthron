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
  ShoppingBag
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
    navigateTo 
  } = useShop();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(2); // Start at Shipping if cart has items

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
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'paypal' | 'apple_pay' | 'cash_on_delivery'>('credit_card');
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

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const paymentDetails: PaymentDetails = {
      method: paymentMethod,
      cardNumberLast4: cardNumber.replace(/\s/g, '').slice(-4) || '4242',
      cardBrand: paymentMethod === 'credit_card' ? 'Visa' : paymentMethod
    };

    const newOrder = createOrder(shippingAddress, paymentDetails);
    setPlacedOrder(newOrder);
    setStep(4);
  };

  if (cart.length === 0 && step !== 4) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-xs text-zinc-400">Add items to your cart before proceeding to checkout.</p>
        <button onClick={() => navigateTo('products')} className="bg-amber-500 text-zinc-950 px-5 py-2.5 rounded-xl font-bold text-xs">
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
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-amber-400' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800'}`}>1</span>
            <span className="hidden sm:inline">Cart Review</span>
          </div>
          <div className="w-12 h-0.5 bg-zinc-800" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-amber-400' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800'}`}>2</span>
            <span>Shipping</span>
          </div>
          <div className="w-12 h-0.5 bg-zinc-800" />
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-amber-400' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800'}`}>3</span>
            <span>Payment</span>
          </div>
          <div className="w-12 h-0.5 bg-zinc-800" />
          <div className={`flex items-center gap-2 ${step >= 4 ? 'text-emerald-400' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 4 ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800'}`}>4</span>
            <span>Confirmation</span>
          </div>
        </div>
      </div>

      {step === 4 && placedOrder ? (
        /* Step 4: Order Confirmation */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-white">Order Confirmed!</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Thank you, <strong className="text-white">{placedOrder.userName}</strong>. Your order has been authorized and dispatched to fulfillment.
            </p>
          </div>

          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-zinc-800/80 pb-2">
              <span className="text-zinc-400">Order Reference:</span>
              <span className="font-bold text-amber-400">{placedOrder.id}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/80 pb-2">
              <span className="text-zinc-400">Tracking Number:</span>
              <span className="font-bold text-white">{placedOrder.trackingNumber}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/80 pb-2">
              <span className="text-zinc-400">Estimated Delivery:</span>
              <span className="font-bold text-emerald-400">{placedOrder.estimatedDelivery}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-zinc-400">Total Paid:</span>
              <span className="font-extrabold text-white">${(placedOrder.total ?? 0).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigateTo('order-detail', { orderId: placedOrder.id })}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Track Live Order Status</span>
            </button>

            <button
              onClick={() => navigateTo('products')}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold py-3 px-5 rounded-xl text-xs border border-zinc-700"
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
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                  <Truck className="w-5 h-5 text-amber-400" />
                  <h2 className="text-base font-bold text-white">Shipping Address & Contact</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                      className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-zinc-300 font-semibold mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">State / Province</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Zip / Postal Code</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => navigateTo('cart')}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    Back to Cart
                  </button>

                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2"
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
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-400" />
                    <h2 className="text-base font-bold text-white">Payment Method</h2>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>256-Bit SSL Encrypted</span>
                  </span>
                </div>

                {/* Payment Options */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'credit_card', label: 'Credit Card' },
                    { id: 'paypal', label: 'PayPal' },
                    { id: 'apple_pay', label: 'Apple Pay' },
                    { id: 'cash_on_delivery', label: 'Cash on Delivery' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                        paymentMethod === method.id
                          ? 'bg-amber-500/15 border-amber-500 text-amber-400'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-zinc-300 font-semibold mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 font-semibold mb-1">Card Number</label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-zinc-300 font-semibold mb-1">Expiry Date</label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700 focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 font-semibold mb-1">CVC / CVV</label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700 focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    Back to Shipping
                  </button>

                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black px-8 py-3.5 rounded-xl text-xs flex items-center gap-2 shadow-xl shadow-amber-500/10"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Authorize & Pay ${(cartTotal ?? 0).toFixed(2)}</span>
                  </button>
                </div>
              </motion.form>
            )}
          </div>

          {/* Right: Summary */}
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-3">Items ({cart.length})</h3>

              <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 text-xs">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-lg bg-zinc-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-zinc-100 truncate">{item.product.name}</p>
                      <p className="text-zinc-400">Qty: {item.quantity} × ${(item.product.price ?? 0).toFixed(2)}</p>
                    </div>
                    <span className="font-bold text-amber-400">${((item.product.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800 pt-3 space-y-2 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${(cartSubtotal ?? 0).toFixed(2)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Discount</span>
                    <span>-${(cartDiscount ?? 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{cartShippingFee === 0 ? 'FREE' : `$${(cartShippingFee ?? 0).toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-zinc-800">
                  <span>Total</span>
                  <span className="text-amber-400">${(cartTotal ?? 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
