import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShippingAddress } from '../types';
import { UserCheck, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AVATARS = {
  male: 'https://api.dicebear.com/7.x/micah/svg?seed=Oliver&backgroundColor=c0aede',
  female: 'https://api.dicebear.com/7.x/micah/svg?seed=Emma&backgroundColor=ffd5dc'
};

export const OnboardingModal: React.FC = () => {
  const { user, completeOnboarding, isOnboardingModalOpen, setIsOnboardingModalOpen } = useShop();

  // Do not render if closed or if user has completed onboarding
  if (!isOnboardingModalOpen || user.hasCompletedOnboarding) return null;

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
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [street, setStreet] = useState(defaultAddress.street || '');
  const [city, setCity] = useState(defaultAddress.city || '');
  const [state, setState] = useState(defaultAddress.state || '');
  const [zipCode, setZipCode] = useState(defaultAddress.zipCode || '');
  const [country, setCountry] = useState(defaultAddress.country || 'India');
  const [errorMsg, setErrorMsg] = useState('');

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
      avatar: AVATARS[gender],
      gender
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-zinc-200 my-6 text-zinc-900 relative"
        >
          {/* Top Close / Skip Button */}
          <button
            type="button"
            onClick={() => setIsOnboardingModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors"
            title="Skip for now"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-1 pb-3 border-b border-zinc-100">
            <div className="w-10 h-10 bg-blue-50 text-[#003882] rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
              <UserCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-zinc-900">Welcome to PANTHRON</h2>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              Setup your customer profile & delivery address to shop smoothly.
            </p>
          </div>

          {errorMsg && (
            <div className="mt-3 bg-rose-50 border border-rose-200 text-rose-700 p-2.5 rounded-xl text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs mt-3">
            {/* Gender Selection & Avatar Preview */}
            <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-200 flex items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <label className="block text-zinc-800 font-bold">Select Gender</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`flex-1 py-1.5 px-3 rounded-xl font-bold border transition-all text-center ${
                      gender === 'male'
                        ? 'bg-[#003882] text-white border-[#003882]'
                        : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`flex-1 py-1.5 px-3 rounded-xl font-bold border transition-all text-center ${
                      gender === 'female'
                        ? 'bg-[#003882] text-white border-[#003882]'
                        : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div className="shrink-0 text-center">
                <img
                  src={AVATARS[gender]}
                  alt={gender}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#003882]/20 bg-white shadow-xs"
                />
              </div>
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-700 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Akash Singh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-50 text-zinc-900 p-2 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
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
                  className="w-full bg-zinc-50 text-zinc-900 p-2 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
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
                className="w-full bg-zinc-50 text-zinc-900 p-2 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
              />
            </div>

            {/* Delivery Address */}
            <div className="space-y-2 pt-1 border-t border-zinc-100">
              <label className="block text-zinc-900 font-bold text-xs">Primary Delivery Address</label>

              <input
                type="text"
                required
                placeholder="Street / House No / Area *"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full bg-zinc-50 text-zinc-900 p-2 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="City *"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-zinc-50 text-zinc-900 p-2 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-zinc-50 text-zinc-900 p-2 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="PIN / Zip Code *"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full bg-zinc-50 text-zinc-900 p-2 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-zinc-50 text-zinc-900 p-2 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsOnboardingModalOpen(false)}
                className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold py-2.5 px-3 rounded-xl text-xs transition-all"
              >
                Skip for Now
              </button>

              <button
                type="submit"
                className="flex-1 bg-[#003882] hover:bg-[#002866] text-white font-extrabold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
