import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ChevronRight, 
  MapPin, 
  Search,
  Phone,
  MessageCircle,
  Mail,
  Building2,
  User
} from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { orders, selectedOrderId, navigateTo, companySettings } = useShop();

  const [searchIdInput, setSearchIdInput] = useState('');

  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchIdInput.trim()) return;
    const found = orders.find((o) => o.id.toLowerCase() === searchIdInput.trim().toLowerCase());
    if (found) {
      navigateTo('order-detail', { orderId: found.id });
    }
  };

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">No Order Selected</h2>
        <p className="text-xs text-zinc-400">Enter your Order Reference ID to check status.</p>
        <form onSubmit={handleSearchOrder} className="flex gap-2 max-w-md mx-auto">
          <input
            type="text"
            placeholder="e.g. SZ-98241"
            value={searchIdInput}
            onChange={(e) => setSearchIdInput(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-800 text-xs text-white p-3 rounded-xl"
          />
          <button type="submit" className="bg-amber-500 text-zinc-950 font-bold px-4 py-3 rounded-xl text-xs">
            Search
          </button>
        </form>
      </div>
    );
  }

  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const estDate = order.estimatedDelivery ? new Date(order.estimatedDelivery) : new Date(orderDate);
  estDate.setDate(estDate.getDate() + 4);
  const now = new Date();
  const diffTime = estDate.getTime() - now.getTime();
  const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const deliveryMsg = order.status === 'delivered' 
    ? '✅ Order delivered successfully. Thank you for shopping!'
    : order.status === 'cancelled'
      ? '❌ This order has been cancelled.'
      : order.status === 'shipped' || order.status === 'out_for_delivery'
        ? `📦 Your order is on the way! Estimated arrival: ${Math.max(1, diffDays)} day${Math.max(1, diffDays) !== 1 ? 's' : ''} from now.`
        : `⏳ We're preparing your order. Expected delivery in ${diffDays + 3} day${diffDays + 3 !== 1 ? 's' : ''}.`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <nav className="flex items-center gap-2 text-xs text-zinc-400">
        <button onClick={() => navigateTo('home')} className="hover:text-white">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <button onClick={() => navigateTo('orders')} className="hover:text-white">Order History</button>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-amber-400 font-medium">Order {order.id}</span>
      </nav>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-black text-white">Order {order.id}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
              order.status === 'delivered'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : order.status === 'cancelled'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="text-left sm:text-right text-xs space-y-1">
          <p className="text-zinc-400 font-semibold uppercase tracking-wider">Expected Delivery</p>
          <p className="text-base font-black text-amber-400">{estDate.toLocaleDateString()}</p>
          <p className="text-[11px] text-zinc-500">{deliveryMsg}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-3">Items in Order</h3>
          <div className="space-y-3 divide-y divide-zinc-800/60">
            {order.items.map((item, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-cover rounded-xl bg-zinc-800 shrink-0"
                  />
                  <div>
                    <p className="font-bold text-white">{item.productName}</p>
                    <p className="text-zinc-400">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <span className="font-bold text-amber-400">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-800 pt-4 space-y-1.5 text-xs">
            <div className="flex justify-between text-zinc-400"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-zinc-400"><span>Discount</span><span>-${order.discount.toFixed(2)}</span></div>
            <div className="flex justify-between text-zinc-400"><span>Shipping</span><span>${order.shippingFee.toFixed(2)}</span></div>
            <div className="flex justify-between text-zinc-400"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
            <div className="flex justify-between pt-2 border-t border-zinc-800 font-black text-white text-sm">
              <span>Total Paid</span><span>${order.total.toFixed(2)}</span>
            </div>
            {order.couponCode && (
              <div className="flex justify-between text-emerald-400 text-[11px] font-bold">
                <span>Coupon Applied</span><span>{order.couponCode}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-3">Delivery Snapshot</h3>
            <div>
              <p className="text-zinc-400 font-semibold mb-1">Recipient Address:</p>
              <p className="text-white font-medium">{order.shippingAddress.fullName}</p>
              <p className="text-zinc-300">{order.shippingAddress.street}</p>
              <p className="text-zinc-300">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p className="text-zinc-300">{order.shippingAddress.country}</p>
              {order.shippingAddress.phone && (
                <p className="text-zinc-400 mt-1">📞 {order.shippingAddress.phone}</p>
              )}
            </div>

            <div className="pt-2 border-t border-zinc-800">
              <p className="text-zinc-400 font-semibold mb-1">Payment Method:</p>
              <p className="text-white font-medium capitalize">{order.paymentDetails.method.replace(/_/g, ' ')}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#003882]/10 to-amber-500/5 border border-amber-500/20 rounded-3xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              Need Help? Contact {companySettings.companyName}
            </h3>
            <div className="space-y-3">
              {companySettings.memberName && (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <User className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-zinc-500">Contact Person</p>
                    <p className="text-zinc-200 font-semibold">{companySettings.memberName}</p>
                  </div>
                </div>
              )}
              {companySettings.phone && (
                <a href={`tel:${companySettings.phone.replace(/\s/g, '')}`} className="flex items-center gap-2.5 hover:bg-zinc-800/40 p-2 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-zinc-500">Call</p>
                    <p className="text-amber-400 font-semibold">{companySettings.phone}</p>
                  </div>
                </a>
              )}
              {companySettings.whatsapp && (
                <a href={`https://wa.me/${companySettings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:bg-zinc-800/40 p-2 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-zinc-500">WhatsApp</p>
                    <p className="text-emerald-400 font-semibold">{companySettings.whatsapp}</p>
                  </div>
                </a>
              )}
              {companySettings.email && (
                <a href={`mailto:${companySettings.email}`} className="flex items-center gap-2.5 hover:bg-zinc-800/40 p-2 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-zinc-500">Email</p>
                    <p className="text-sky-400 font-semibold">{companySettings.email}</p>
                  </div>
                </a>
              )}
              {companySettings.address && (
                <div className="flex items-start gap-2.5 pt-1 border-t border-zinc-800/60">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-zinc-500">Store Address</p>
                    <p className="text-zinc-300">{companySettings.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
