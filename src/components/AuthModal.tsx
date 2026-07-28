import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { LogIn, UserPlus, X, Lock, Mail, User as UserIcon, Phone, MapPin, Check, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginUser, registerUser, addToast } = useShop();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regStreet, setRegStreet] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regState, setRegState] = useState('');
  const [regZip, setRegZip] = useState('');
  const [regGender, setRegGender] = useState<'male' | 'female'>('male');

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await loginUser(loginEmail.trim(), loginPassword.trim());
      if (success) {
        setIsAuthModalOpen(false);
      } else {
        setErrorMsg('Invalid email or password. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regPhone.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      const avatarUrl = regGender === 'male' 
        ? 'https://api.dicebear.com/7.x/micah/svg?seed=Oliver&backgroundColor=c0aede'
        : 'https://api.dicebear.com/7.x/micah/svg?seed=Emma&backgroundColor=ffd5dc';

      const address = {
        fullName: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        street: regStreet.trim() || 'Main Street',
        city: regCity.trim() || 'New Delhi',
        state: regState.trim() || 'Delhi',
        zipCode: regZip.trim() || '110001',
        country: 'India',
        isDefault: true
      };

      const success = await registerUser({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword.trim(),
        phone: regPhone.trim(),
        avatar: avatarUrl,
        gender: regGender,
        address
      });

      if (success) {
        setIsAuthModalOpen(false);
      } else {
        setErrorMsg('Registration failed. Email might already be registered.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdminLogin = () => {
    setLoginEmail('support@panthron.in');
    setLoginPassword('admin123');
    loginUser('support@panthron.in', 'admin123');
    setIsAuthModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 my-6 text-zinc-900 relative"
        >
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Mode Switch Tabs */}
          <div className="flex border-b border-zinc-200 mb-5">
            <button
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
                mode === 'login' ? 'border-[#003882] text-[#003882]' : 'border-transparent text-zinc-400 hover:text-zinc-700'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
                mode === 'register' ? 'border-[#003882] text-[#003882]' : 'border-transparent text-zinc-400 hover:text-zinc-700'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-700 font-bold mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="yourname@domain.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-zinc-50 text-zinc-900 pl-9 pr-3 py-2.5 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-zinc-50 text-zinc-900 pl-9 pr-3 py-2.5 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#003882] hover:bg-[#002866] text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
              </button>

              <div className="pt-3 border-t border-zinc-100 text-center">
                <button
                  type="button"
                  onClick={handleQuickAdminLogin}
                  className="text-[11px] text-[#003882] font-bold hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Log in as Admin (Akash Singh)</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200 flex items-center justify-between gap-3">
                <span className="font-bold text-zinc-800">Gender Avatar:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRegGender('male')}
                    className={`py-1 px-3 rounded-lg font-bold border text-[11px] ${
                      regGender === 'male' ? 'bg-[#003882] text-white border-[#003882]' : 'bg-white text-zinc-700 border-zinc-300'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegGender('female')}
                    className={`py-1 px-3 rounded-lg font-bold border text-[11px] ${
                      regGender === 'female' ? 'bg-[#003882] text-white border-[#003882]' : 'bg-white text-zinc-700 border-zinc-300'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@mail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
                />
              </div>

              <div className="space-y-2 pt-1 border-t border-zinc-100">
                <label className="block text-zinc-800 font-bold">Delivery Address</label>
                <input
                  type="text"
                  placeholder="Street / House No."
                  value={regStreet}
                  onChange={(e) => setRegStreet(e.target.value)}
                  className="w-full bg-zinc-50 text-zinc-900 p-2 rounded-xl border border-zinc-300 focus:border-[#003882] focus:outline-none"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full bg-zinc-50 text-zinc-900 p-2 rounded-xl border border-zinc-300"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    className="w-full bg-zinc-50 text-zinc-900 p-2 rounded-xl border border-zinc-300"
                  />
                  <input
                    type="text"
                    placeholder="Pin Code"
                    value={regZip}
                    onChange={(e) => setRegZip(e.target.value)}
                    className="w-full bg-zinc-50 text-zinc-900 p-2 rounded-xl border border-zinc-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#003882] hover:bg-[#002866] text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isLoading ? 'Creating Account...' : 'Register Account'}</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
