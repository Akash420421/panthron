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
  User,
  ArrowLeft,
  PackageCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  X
} from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { orders, selectedOrderId, currentRoute, navigateTo, companySettings, cancelOrder } = useShop();
  const [searchIdInput, setSearchIdInput] = useState('');

  // If user selected a specific order or is in 'order-detail' route
  const singleOrderMode = currentRoute === 'order-detail' || Boolean(selectedOrderId);
  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || (singleOrderMode ? orders[0] : null);

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchIdInput.trim()) return;
    const found = orders.find((o) => o.id.toLowerCase() === searchIdInput.trim().toLowerCase());
    if (found) {
      navigateTo('order-detail', { orderId: found.id });
    }
  };

  // Helper for status badge styling
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      case 'shipped':
      case 'out_for_delivery':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-50 text-[#003882] border border-blue-200 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            <span>{status.replace(/_/g, ' ')}</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-zinc-100 text-zinc-800 border border-zinc-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{status.replace(/_/g, ' ')}</span>
          </span>
        );
    }
  };

  // VIEW 1: SINGLE ORDER DETAILS & TRACKING
  if (singleOrderMode && selectedOrder) {
    const order = selectedOrder;
    const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
    const estDate = order.estimatedDelivery ? new Date(order.estimatedDelivery) : new Date(orderDate);
    estDate.setDate(estDate.getDate() + 4);
    const now = new Date();
    const diffTime = estDate.getTime() - now.getTime();
    const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const deliveryMsg = order.status === 'delivered' 
      ? 'Order delivered successfully. Thank you for shopping with us!'
      : order.status === 'cancelled'
        ? 'This order has been cancelled.'
        : order.status === 'shipped' || order.status === 'out_for_delivery'
          ? `Your order is on the way! Estimated arrival in ${Math.max(1, diffDays)} day${Math.max(1, diffDays) !== 1 ? 's' : ''}.`
          : `We are preparing your package. Expected delivery in ${diffDays + 3} day${diffDays + 3 !== 1 ? 's' : ''}.`;

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <button
            onClick={() => navigateTo('orders')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-600" />
            <span>Back to All Orders</span>
          </button>

          <nav className="flex items-center gap-2 text-xs text-zinc-500">
            <button onClick={() => navigateTo('home')} className="hover:text-zinc-900">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <button onClick={() => navigateTo('orders')} className="hover:text-zinc-900">Order History</button>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-900 font-bold">Order {order.id}</span>
          </nav>
        </div>

        {/* Order Header Card */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black text-zinc-900">Order {order.id}</h1>
              {renderStatusBadge(order.status)}
            </div>
            <p className="text-xs text-zinc-500 mt-1 font-medium">
              Placed on {new Date(order.createdAt).toLocaleDateString()} · Ref: <span className="font-mono text-zinc-700">{order.id}</span>
            </p>

            {(order.status === 'pending' || order.status === 'processing') && (
              <button
                onClick={() => {
                  if (window.confirm(`Are you sure you want to cancel Order ${order.id}?`)) {
                    cancelOrder(order.id);
                  }
                }}
                className="mt-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel This Order</span>
              </button>
            )}
          </div>

          <div className="text-left sm:text-right text-xs space-y-1 bg-zinc-50 border border-zinc-200/80 p-3 rounded-2xl">
            <p className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Expected Delivery</p>
            <p className="text-base font-black text-[#003882]">{estDate.toLocaleDateString()}</p>
            <p className="text-[11px] text-zinc-600 font-medium">{deliveryMsg}</p>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items & Subtotal */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-100 pb-3">Items in Order</h3>
            <div className="space-y-3 divide-y divide-zinc-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-xl bg-zinc-100 border border-zinc-200 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-zinc-900">{item.productName}</p>
                      <p className="text-zinc-500">Qty: {item.quantity} × ₹{(item.price ?? 0).toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-zinc-900">₹{((item.price ?? 0) * (item.quantity ?? 1)).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-200 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600"><span>Subtotal</span><span>₹{(order.subtotal ?? 0).toFixed(2)}</span></div>
              <div className="flex justify-between text-zinc-600"><span>Discount</span><span>-₹{(order.discount ?? 0).toFixed(2)}</span></div>
              <div className="flex justify-between text-zinc-600"><span>Shipping</span><span>₹{(order.shippingFee ?? 0).toFixed(2)}</span></div>
              <div className="flex justify-between text-zinc-600"><span>Tax</span><span>₹{(order.tax ?? 0).toFixed(2)}</span></div>
              <div className="flex justify-between pt-2 border-t border-zinc-200 font-black text-zinc-900 text-sm">
                <span>Total Paid</span>
                <span className="text-[#003882]">₹{(order.total ?? 0).toFixed(2)}</span>
              </div>
              {order.couponCode && (
                <div className="flex justify-between text-emerald-700 text-[11px] font-bold">
                  <span>Coupon Applied</span><span>{order.couponCode}</span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery & Support */}
          <div className="space-y-4">
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 space-y-4 text-xs shadow-xs">
              <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-100 pb-3">Delivery Address</h3>
              <div>
                <p className="text-zinc-900 font-bold">{order.shippingAddress.fullName}</p>
                <p className="text-zinc-600 mt-0.5">{order.shippingAddress.street}</p>
                <p className="text-zinc-600">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p className="text-zinc-600">{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <p className="text-zinc-500 mt-1.5 font-medium">📞 {order.shippingAddress.phone}</p>
                )}
              </div>

              <div className="pt-3 border-t border-zinc-100">
                <p className="text-zinc-500 font-semibold mb-0.5">Payment Method</p>
                <p className="text-zinc-900 font-bold capitalize">{order.paymentDetails.method.replace(/_/g, ' ')}</p>
              </div>
            </div>

            {/* Need Help Box */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 space-y-4 text-xs shadow-xs">
              <h3 className="text-sm font-extrabold text-zinc-900 flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#003882]">
                  <Building2 className="w-4 h-4" />
                </div>
                <span>Need Help? Contact {companySettings.companyName || 'PANTHRON'}</span>
              </h3>

              <div className="space-y-2.5">
                {companySettings.memberName && (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-zinc-200">
                    <User className="w-4 h-4 text-[#003882] shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase text-zinc-400">Contact Person</p>
                      <p className="text-zinc-900 font-bold">{companySettings.memberName}</p>
                    </div>
                  </div>
                )}
                {companySettings.phone && (
                  <a href={`tel:${companySettings.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-zinc-200 hover:border-blue-300 transition-colors">
                    <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase text-zinc-400">Call Us</p>
                      <p className="text-zinc-900 font-bold">{companySettings.phone}</p>
                    </div>
                  </a>
                )}
                {companySettings.whatsapp && (
                  <a href={`https://wa.me/${companySettings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-zinc-200 hover:border-emerald-300 transition-colors">
                    <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase text-zinc-400">WhatsApp</p>
                      <p className="text-emerald-700 font-bold">{companySettings.whatsapp}</p>
                    </div>
                  </a>
                )}
                {companySettings.email && (
                  <a href={`mailto:${companySettings.email}`} className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-zinc-200 hover:border-blue-300 transition-colors">
                    <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase text-zinc-400">Email Support</p>
                      <p className="text-blue-700 font-bold truncate">{companySettings.email}</p>
                    </div>
                  </a>
                )}
                {companySettings.address && (
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-zinc-200 mt-2">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold uppercase text-zinc-400">Store Address</p>
                      <p className="text-zinc-700 font-medium text-xs leading-relaxed">{companySettings.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VIEW 2: ALL ORDERS HISTORY LIST (When route is 'orders' or no specific order selected)
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-[#003882]" />
            <span>Order History</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Track, view and manage all {orders.length} order{orders.length !== 1 ? 's' : ''} placed on your account.
          </p>
        </div>

        <form onSubmit={handleSearchOrder} className="flex gap-2 max-w-xs w-full">
          <input
            type="text"
            placeholder="Search Order ID..."
            value={searchIdInput}
            onChange={(e) => setSearchIdInput(e.target.value)}
            className="flex-1 bg-white border border-zinc-300 text-xs text-zinc-900 p-2.5 rounded-xl focus:outline-none focus:border-[#003882]"
          />
          <button type="submit" className="bg-[#003882] text-white font-bold px-3.5 py-2.5 rounded-xl text-xs hover:bg-[#002866]">
            Search
          </button>
        </form>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center space-y-4 shadow-xs max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#003882] border border-blue-100 flex items-center justify-center mx-auto">
            <PackageCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900">No Orders Found</h3>
            <p className="text-xs text-zinc-500 mt-1">You haven't placed any orders yet.</p>
          </div>
          <button
            onClick={() => navigateTo('products')}
            className="bg-[#003882] hover:bg-[#002866] text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-colors"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => {
            const orderDateStr = ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'Recent';
            return (
              <div
                key={ord.id}
                className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4 hover:border-zinc-400 transition-all shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3 text-xs">
                  <div>
                    <span className="font-black text-zinc-900 text-sm">Ref: {ord.id}</span>
                    <span className="text-zinc-500 ml-3">Placed on {orderDateStr}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-black text-[#003882] text-base">₹{(ord.total ?? 0).toFixed(2)}</span>
                    {renderStatusBadge(ord.status)}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Order items thumbnails */}
                  <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 p-1.5 rounded-xl shrink-0">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 object-cover rounded-lg bg-white shrink-0"
                        />
                        <div className="pr-1 text-[11px]">
                          <p className="font-bold text-zinc-800 max-w-[130px] truncate">{item.productName}</p>
                          <p className="text-zinc-500 text-[10px]">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigateTo('order-detail', { orderId: ord.id })}
                    className="bg-[#003882] hover:bg-[#002866] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
                  >
                    <span>View Tracking &amp; Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

