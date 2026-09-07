import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, UserCheck, ArrowRight, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

interface CardLoginPageProps {
  onSuccess?: () => void;
}

export default function CardLoginPage({ onSuccess }: CardLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      toast.success(`Welcome ${res.data.user.firstName}! Alumni I-Card unlocked.`);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/icards');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      // Try logging in with demo account or fallback mock user state
      try {
        const res = await authApi.login({ email: 'alumni@iitram.ac.in', password: 'Password123' });
        setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      } catch {
        // Mock fallback login if backend user doesn't exist yet
        setAuth(
          {
            _id: 'demo-alumni-101',
            firstName: 'PARTH',
            lastName: 'SHAH',
            email: 'alumni@iitram.ac.in',
            role: 'alumni',
            isEmailVerified: true,
            isProfileComplete: true,
            isVerified: true,
            verificationStatus: 'verified',
          },
          'mock-access-token',
          'mock-refresh-token'
        );
      }
      toast.success('Signed in as Alumni Member! Loading Digital I-Card...');
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/icards');
      }
    } catch (err: any) {
      toast.error('Demo sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 bg-slate-50/60">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-white border border-slate-200/90 rounded-3xl shadow-xl overflow-hidden"
      >
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-[#7A152B] via-[#630f21] to-[#450916] text-white p-8 text-center relative overflow-hidden">
          {/* Subtle logo background glow */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-[#C59B27]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="w-16 h-16 rounded-full bg-white/10 p-2.5 backdrop-blur-md mx-auto mb-4 border border-white/20 shadow-inner flex items-center justify-center">
            <img
              src="/images/iitram-logo.png"
              alt="IITRAM Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/en/2/25/Institute_of_Infrastructure_Technology_Research_and_Management_logo.png';
              }}
            />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C59B27]/20 border border-[#C59B27]/40 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck size={14} /> Official Digital Identity Portal
          </span>

          <h1 className="text-2xl sm:text-3xl font-black font-serif uppercase tracking-tight text-white mb-2">
            IITRAM Alumni I-Card
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-md mx-auto leading-relaxed">
            Please enter your login password to access your official Alumni Identity Card, verify credentials, and download card artwork.
          </p>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quick Demo Access Bar */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7A152B] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles size={20} className="text-amber-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Instant Preview Mode</h4>
                <p className="text-[11px] text-slate-600">Quick sign in with pre-verified Alumni credentials</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2 bg-[#7A152B] hover:bg-[#600f21] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <UserCheck size={14} className="text-amber-300" />
              <span>One-Click Demo Card</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Or Sign In With Account
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Alumni Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alumni@iitram.ac.in"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-[#7A152B] focus:ring-2 focus:ring-[#7A152B]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-[#7A152B] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-[#7A152B] focus:ring-2 focus:ring-[#7A152B]/20 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#7A152B] hover:bg-[#600f21] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <KeyRound size={18} className="text-amber-300" />
                  <span>Verify Password & Access I-Card</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Don't have an alumni account yet?{' '}
            <Link to="/register" className="font-bold text-[#7A152B] hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
