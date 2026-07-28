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
  const { user, updateUserProfile, orders, wishlist, navigateTo, companySettings } = useShop();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar || '');
  const [avatarInput, setAvatarInput] = useState('');
  const [showAvatarInput, setShowAvatarInput] = useState(false);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone || '');
    setAvatarUrl(user.avatar || '');
  }, [user]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, phone, avatar: avatarUrl });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-500"
            />
            <button
              onClick={() => setActiveTab('profile')}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-500 text-zinc-950 rounded-full flex items-center justify-center shadow-lg hover:bg-amber-400 transition-colors"
              title="Change photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{user.name}</h1>
              <span className="px-2 py-0.5 bg-amber-500/15 text-amber-400 font-bold text-[10px] rounded uppercase">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{user.email} · Customer since {user.createdAt}</p>
          </div>
        </div>
      </div>

      <div className="flex border-b border-zinc-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'profile' ? 'border-amber-500 text-amber-400' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'orders' ? 'border-amber-500 text-amber-400' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>Order History ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-6 py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'addresses' ? 'border-amber-500 text-amber-400' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses</span>
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center space-y-3">
              <PackageCheck className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400">You haven't placed any orders yet.</p>
              <button
                onClick={() => navigateTo('products')}
                className="bg-amber-500 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs"
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

              return (
                <div
                  key={order.id}
                  className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 space-y-4 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3 text-xs">
                    <div>
                      <span className="font-bold text-white text-sm">Ref: {order.id}</span>
                      <span className="text-zinc-400 ml-2">Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-amber-400">${(order.total ?? 0).toFixed(2)}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        order.status === 'delivered'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : order.status === 'cancelled'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 font-semibold">
                    📦 {deliveryMsg}
                  </p>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                      {order.items.map((item, idx) => (
                        <img
                          key={idx}
                          src={item.productImage}
                          alt={item.productName}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 object-cover rounded-xl bg-zinc-800 shrink-0"
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => navigateTo('order-detail', { orderId: order.id })}
                      className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {(companySettings.phone || companySettings.whatsapp) && (
                    <div className="pt-3 border-t border-zinc-800 space-y-1.5">
                      <p className="text-[10px] font-bold uppercase text-zinc-500">
                        Need help with this order? Contact {companySettings.companyName}:
                      </p>
                      <div className="flex flex-wrap gap-3 text-[11px]">
                        {companySettings.memberName && (
                          <span className="text-zinc-300">👤 {companySettings.memberName}</span>
                        )}
                        {companySettings.phone && (
                          <a href={`tel:${companySettings.phone.replace(/\s/g, '')}`} className="text-amber-400 hover:underline font-semibold">
                            📞 {companySettings.phone}
                          </a>
                        )}
                        {companySettings.whatsapp && (
                          <a href={`https://wa.me/${companySettings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-semibold">
                            💬 WhatsApp {companySettings.whatsapp}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSave} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-2xl space-y-5 text-xs">
          <h2 className="font-bold text-white text-sm border-b border-zinc-800 pb-3">Edit Personal Details</h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-2">
            <div className="relative shrink-0">
              <img
                src={avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'}
                alt="Profile preview"
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover ring-2 ring-zinc-700"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-zinc-700 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-zinc-600"
                onClick={() => setShowAvatarInput(!showAvatarInput)}>
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex-1 w-full space-y-2">
              <label className="block text-zinc-300 font-semibold">Profile Photo URL</label>
              {showAvatarInput && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste avatar image URL..."
                    value={avatarInput}
                    onChange={(e) => setAvatarInput(e.target.value)}
                    className="flex-1 bg-zinc-800 text-zinc-100 p-2 rounded-xl border border-zinc-700"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (avatarInput.trim()) {
                        setAvatarUrl(avatarInput.trim());
                        setAvatarInput('');
                      }
                    }}
                    className="bg-amber-500 text-zinc-950 px-3 rounded-xl font-bold hover:bg-amber-400"
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
              <label className="block text-zinc-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-zinc-800 text-zinc-100 p-2.5 rounded-xl border border-zinc-700"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      )}

      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.addresses.length === 0 ? (
            <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center space-y-2">
              <MapPin className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400">No saved addresses yet.</p>
            </div>
          ) : user.addresses.map((addr, idx) => (
            <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">{addr.fullName}</span>
                {addr.isDefault && (
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded">
                    Default Address
                  </span>
                )}
              </div>
              <p className="text-zinc-300">{addr.street}</p>
              <p className="text-zinc-300">{addr.city}, {addr.state} {addr.zipCode}</p>
              <p className="text-zinc-400">{addr.country}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
