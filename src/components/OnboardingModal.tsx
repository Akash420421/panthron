import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShippingAddress } from '../types';
import { UserCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AVATAR_OPTIONS = {
  male: [
    { id: 'm1', name: 'Male Cartoon 1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&skinColor=tanned,yellow' },
    { id: 'm2', name: 'Male Cartoon 2', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Max&backgroundColor=b6e3f4' },
    { id: 'm3', name: 'Male Cartoon 3', url: 'https://api.dicebear.com/7.x/micah/svg?seed=Oliver&backgroundColor=c0aede' }
  ],
  female: [
    { id: 'f1', name: 'Female Cartoon 1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia&skinColor=tanned,yellow' },
    { id: 'f2', name: 'Female Cartoon 2', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Luna&backgroundColor=ffdfbf' },
    { id: 'f3', name: 'Female Cartoon 3', url: 'https://api.dicebear.com/7.x/micah/svg?seed=Emma&backgroundColor=ffd5dc' }
  ]
};

export const OnboardingModal: React.FC = () => {
  const { user, completeOnboarding } = useShop();

  // If user has already completed onboarding, do not render modal
  if (user.hasCompletedOnboarding) return null;

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

  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(AVATAR_OPTIONS.male[0].url);
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [street, setStreet] = useState(defaultAddress.street || '');
  const [city, setCity] = useState(defaultAddress.city || '');
  const [state, setState] = useState(defaultAddress.state || '');
  const [zipCode, setZipCode] = useState(defaultAddress.zipCode || '');
  const [country, setCountry] = useState(defaultAddress.country || 'India');
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenderChange = (selectedGender: 'male' | 'female') => {
    setGender(selectedGender);
    setSelectedAvatar(AVATAR_OPTIONS[selectedGender][0].url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter your phone number.');
      return;
    }
    if (!street.trim() || !city.trim() || !zipCode.trim()) {
      setErrorMsg('Please complete your full delivery address.');
      return;
    }

    const shippingAddress: ShippingAddress = {
      fullName: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      zipCode: zipCode.trim(),
      country: country.trim(),
      isDefault: true
    };

    completeOnboarding({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: shippingAddress,
      avatar: selectedAvatar,
      gender
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 my-8 space-y-5 text-zinc-900"
        >
          <div className="text-center space-y-1.5 border-b border-zinc-100 pb-4">
            <div className="w-12 h-12 bg-blue-50 text-[#003882] rounded-2xl flex items-center justify-center mx-auto mb-2 border border-blue-100">
              <UserCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-zinc-900">Welcome to PANTHRON</h2>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Please setup your official customer profile & delivery address to continue shopping.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Gender & Avatar Selection */}
            <div>
              <label className="block text-zinc-700 font-bold mb-2">Select Avatar & Gender</label>
              <div className="flex gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => handleGenderChange('male')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold border transition-all text-center ${
                    gender === 'male'
                      ? 'bg-[#003882] text-white border-[#003882]'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                  }`}
                >
                  Male Cartoon 👨‍💼
                </button>
                <button
                  type="button"
                  onClick={() => handleGenderChange('female')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold border transition-all text-center ${
                    gender === 'female'
                      ? 'bg-[#003882] text-white border-[#003882]'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                  }`}
                >
                  Female Cartoon 👩‍💼
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {AVATAR_OPTIONS[gender].map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.url)}
                    className={`p-2 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                      selectedAvatar === avatar.url
                        ? 'border-[#003882] ring-2 ring-[#003882]/20 bg-blue-50/50'
                        : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100'
                    }`}
                  >
                    <img
                      src={avatar.url}
                      alt={avatar.name}
                      className="w-12 h-12 rounded-xl object-cover bg-white"
                    />
                    <span className="text-[10px] font-bold text-zinc-700">{avatar.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-700 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Akash Singh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-700 font-bold mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="yourname@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
              />
            </div>

            {/* Delivery Address */}
            <div className="space-y-2 pt-2 border-t border-zinc-100">
              <label className="block text-zinc-900 font-bold text-xs">Primary Delivery Address</label>

              <div>
                <input
                  type="text"
                  required
                  placeholder="Street / House No / Area *"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="City *"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="PIN / Zip Code *"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#003882] hover:bg-[#002866] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all mt-3"
            >
              <Check className="w-4 h-4" />
              <span>Save Profile & Start Shopping</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
