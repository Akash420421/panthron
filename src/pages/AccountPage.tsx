import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  User as UserIcon, 
  PackageCheck, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  LogOut, 
  ChevronRight,
  Edit2,
  Check,
  Plus,
  Camera
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user, updateUserProfile, updateUserAddress, cancelOrder, orders, wishlist, navigateTo, companySettings } = useShop();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar || '');
  const [avatarInput, setAvatarInput] = useState('');
  const [showAvatarInput, setShowAvatarInput] = useState(false);

  // Address edit state
  const defaultAddress = user.addresses?.[0] || {
    fullName: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    isDefault: true
  };
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addrStreet, setAddrStreet] = useState(defaultAddress.street);
  const [addrCity, setAddrCity] = useState(defaultAddress.city);
  const [addrState, setAddrState] = useState(defaultAddress.state);
  const [addrZip, setAddrZip] = useState(defaultAddress.zipCode);
  const [addrCountry, setAddrCountry] = useState(defaultAddress.country);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone || '');
    setAvatarUrl(user.avatar || '');
    if (user.addresses?.[0]) {
      setAddrStreet(user.addresses[0].street);
      setAddrCity(user.addresses[0].city);
      setAddrState(user.addresses[0].state);
      setAddrZip(user.addresses[0].zipCode);
      setAddrCountry(user.addresses[0].country);
    }
  }, [user]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, phone, avatar: avatarUrl });
  };

  const handleAddressSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserAddress({
      fullName: name || user.name,
      email: email || user.email,
      phone: phone || user.phone || '',
      street: addrStreet,
      city: addrCity,
      state: addrState,
      zipCode: addrZip,
      country: addrCountry,
      isDefault: true
    });
    setIsEditingAddress(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-white border border-zinc-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-[#003882]"
            />
            <button
              onClick={() => setActiveTab('profile')}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#003882] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#002866] transition-colors"
              title="Change photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-zinc-900">{user.name}</h1>
              <span className="px-2 py-0.5 bg-blue-50 text-[#003882] border border-blue-200 font-extrabold text-[10px] rounded uppercase">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">{user.email} · Customer since {user.createdAt}</p>
          </div>
        </div>
      </div>

      <div className="flex border-b border-zinc-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'profile' ? 'border-[#003882] text-[#003882]' : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'orders' ? 'border-[#003882] text-[#003882]' : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>Order History ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-6 py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'addresses' ? 'border-[#003882] text-[#003882]' : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses</span>
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center space-y-3 shadow-xs">
              <PackageCheck className="w-10 h-10 text-zinc-400 mx-auto" />
              <p className="text-xs text-zinc-500">You haven't placed any orders yet.</p>
              <button
                onClick={() => navigateTo('products')}
                className="bg-[#003882] text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-[#002866]"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            orders.map((order) => {
              const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
              const estDate = order.estimatedDelivery ? new Date(order.estimatedDelivery) : new Date(orderDate);
              estDate.setDate(estDate.getDate() + 4);
              const now = new Date();
              const diffTime = estDate.getTime() - now.getTime();
              const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
              const deliveryMsg = order.status === 'delivered' 
                ? 'Delivered successfully 🎉' 
                : order.status === 'cancelled' 
                  ? 'Order cancelled'
                  : order.status === 'shipped' || order.status === 'out_for_delivery'
                    ? `Arriving in approximately ${Math.max(1, diffDays)} day${Math.max(1, diffDays) !== 1 ? 's' : ''}`
                    : `Estimated delivery in ${diffDays + 1} day${diffDays + 1 !== 1 ? 's' : ''}`;

              const canCancel = order.status === 'pending' || order.status === 'processing';

              const steps = ['pending', 'processing', 'shipped', 'delivered'];
              const currentStepIndex = order.status === 'cancelled' ? -1 : Math.max(0, steps.indexOf(order.status));

              return (
                <div
                  key={order.id}
                  className="bg-white border border-zinc-200 rounded-3xl p-5 space-y-4 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-zinc-900 text-sm">Order #{order.id}</span>
                      <span className="text-zinc-400">·</span>
                      <span className="text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold rounded">
                        💵 Cash on Delivery
                      </span>
                      <span className="font-black text-[#003882] text-sm">₹{(order.total ?? 0).toFixed(2)}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border flex items-center gap-1 ${
                        order.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : order.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-blue-50 text-[#003882] border-blue-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          order.status === 'delivered' ? 'bg-emerald-600' : order.status === 'cancelled' ? 'bg-rose-600' : 'bg-[#003882] animate-pulse'
                        }`} />
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-xs">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 object-cover rounded-2xl bg-zinc-100 border border-zinc-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-extrabold text-zinc-900 truncate text-sm">{item.productName}</p>
                          <p className="text-zinc-500 mt-0.5">
                            Qty: <strong className="text-zinc-700">{item.quantity}</strong> · Price: <strong className="text-zinc-900">₹{(item.price ?? 0).toFixed(2)}</strong>
                          </p>
                          {(item.color || item.size) && (
                            <p className="text-[10px] text-zinc-400 mt-0.5">
                              {item.color && <span>Color: {item.color} </span>}
                              {item.size && <span>Size: {item.size}</span>}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Flipkart Stepper Timeline */}
                  {order.status !== 'cancelled' ? (
                    <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3 text-[11px]">
                      <div className="flex items-center justify-between text-zinc-600 font-bold mb-2">
                        <span className={currentStepIndex >= 0 ? 'text-emerald-700' : ''}>1. Placed</span>
                        <span className={currentStepIndex >= 1 ? 'text-emerald-700' : ''}>2. Packed</span>
                        <span className={currentStepIndex >= 2 ? 'text-emerald-700' : ''}>3. Shipped</span>
                        <span className={currentStepIndex >= 3 ? 'text-emerald-700' : ''}>4. Delivered</span>
                      </div>
                      <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden flex">
                        <div
                          className="bg-emerald-600 h-full transition-all duration-500 rounded-full"
                          style={{
                            width: currentStepIndex === 0 ? '25%' : currentStepIndex === 1 ? '50%' : currentStepIndex === 2 ? '75%' : '100%'
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-xs text-rose-700 font-bold text-center">
                      ❌ This order was cancelled.
                    </div>
                  )}

                  {/* Footer Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-100">
                    <p className="text-[11px] text-zinc-500 font-medium">📦 {deliveryMsg}</p>

                    <div className="flex items-center gap-2">
                      {canCancel && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to cancel Order #${order.id}?`)) {
                              cancelOrder(order.id);
                            }
                          }}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors"
                        >
                          Cancel Order
                        </button>
                      )}

                      <button
                        onClick={() => navigateTo('order-detail', { orderId: order.id })}
                        className="bg-[#003882] hover:bg-[#002866] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0 shadow-xs"
                      >
                        <span>Track Order Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );

            })
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSave} className="bg-white border border-zinc-200 rounded-2xl p-6 max-w-2xl space-y-5 text-xs shadow-xs">
          <h2 className="font-bold text-zinc-900 text-sm border-b border-zinc-100 pb-3">Edit Personal Details</h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-2">
            <div className="relative shrink-0">
              <img
                src={avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'}
                alt="Profile preview"
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover ring-2 ring-zinc-300"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#003882] text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#002866]"
                onClick={() => setShowAvatarInput(!showAvatarInput)}>
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex-1 w-full space-y-2">
              <label className="block text-zinc-700 font-bold">Profile Photo URL</label>
              {showAvatarInput && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste avatar image URL..."
                    value={avatarInput}
                    onChange={(e) => setAvatarInput(e.target.value)}
                    className="flex-1 bg-zinc-50 text-zinc-900 p-2 rounded-xl border border-zinc-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (avatarInput.trim()) {
                        setAvatarUrl(avatarInput.trim());
                        setAvatarInput('');
                      }
                    }}
                    className="bg-[#003882] text-white px-3 rounded-xl font-bold hover:bg-[#002866]"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              )}
              <p className="text-[10px] text-zinc-500">
                Use any public image URL. Right click an image online → Copy Image Address.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-700 font-bold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300"
              />
            </div>

            <div>
              <label className="block text-zinc-700 font-bold mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-700 font-bold mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="bg-[#003882] hover:bg-[#002866] text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      )}

      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-zinc-900">Your Delivery Addresses</h2>
            <button
              onClick={() => setIsEditingAddress(!isEditingAddress)}
              className="bg-[#003882] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 hover:bg-[#002866]"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditingAddress ? 'Cancel Edit' : 'Edit Address'}</span>
            </button>
          </div>

          {isEditingAddress && (
            <form onSubmit={handleAddressSave} className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-3 text-xs">
              <h3 className="font-bold text-zinc-900 text-xs">Update Address Details</h3>
              <div>
                <label className="block text-zinc-700 font-bold mb-1">Street Address / House No.</label>
                <input
                  type="text"
                  required
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  className="w-full bg-white text-zinc-900 p-2.5 rounded-xl border border-zinc-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="w-full bg-white text-zinc-900 p-2.5 rounded-xl border border-zinc-300"
                  />
                </div>
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">State</label>
                  <input
                    type="text"
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    className="w-full bg-white text-zinc-900 p-2.5 rounded-xl border border-zinc-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Zip / Pin Code</label>
                  <input
                    type="text"
                    required
                    value={addrZip}
                    onChange={(e) => setAddrZip(e.target.value)}
                    className="w-full bg-white text-zinc-900 p-2.5 rounded-xl border border-zinc-300"
                  />
                </div>
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Country</label>
                  <input
                    type="text"
                    value={addrCountry}
                    onChange={(e) => setAddrCountry(e.target.value)}
                    className="w-full bg-white text-zinc-900 p-2.5 rounded-xl border border-zinc-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#003882] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1 hover:bg-[#002866]"
              >
                <Check className="w-4 h-4" /> Save Address
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.length === 0 ? (
              <div className="md:col-span-2 bg-white border border-zinc-200 rounded-2xl p-8 text-center space-y-2 shadow-xs">
                <MapPin className="w-8 h-8 text-zinc-400 mx-auto" />
                <p className="text-xs text-zinc-500">No saved addresses yet.</p>
              </div>
            ) : user.addresses.map((addr, idx) => (
              <div key={idx} className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-2 text-xs shadow-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-zinc-900">{addr.fullName}</span>
                  {addr.isDefault && (
                    <span className="px-2 py-0.5 bg-blue-50 text-[#003882] border border-blue-200 text-[10px] font-bold rounded">
                      Default Address
                    </span>
                  )}
                </div>
                <p className="text-zinc-700">{addr.street}</p>
                <p className="text-zinc-700">{addr.city}, {addr.state} {addr.zipCode}</p>
                <p className="text-zinc-500">{addr.country}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

