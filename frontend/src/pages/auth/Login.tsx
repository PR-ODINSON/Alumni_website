import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { authApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

const loginSchema = z.object({
  email: z.string().min(1, 'Please enter your email or enrollment number'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('error') === 'google_auth_failed') {
      toast.error('Google sign-in failed. Please try again.');
    }
  }, []);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await authApi.login({ identifier: data.email, password: data.password });
      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      toast.success(`Welcome back, ${res.data.user.firstName}! 👋`);
      navigate('/feed');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold font-display text-slate-900 mb-1 tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Sign in with your email or enrollment number
        </p>
      </div>

      {/* Google OAuth Button */}
      <a
        href={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/api/auth/google`}
        className="group flex items-center justify-center gap-3 w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold text-sm transition-all mb-5 shadow-xs hover:shadow-sm"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)' }}
      >
        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 shrink-0" style={{ width: 18, height: 18 }}>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </a>

      {/* Divider */}
      <div className="divider-text mb-5">or sign in with credentials</div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Email / Enrollment */}
        <div>
          <label className="input-label" htmlFor="login-email">
            Email Address or Enrollment Number
          </label>
          <input
            id="login-email"
            {...register('email')}
            type="text"
            className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
            placeholder="161030011004 or name@iitram.ac.in"
            autoComplete="username"
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500 font-medium"
              >
                <AlertCircle size={12} />
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="input-label mb-0" htmlFor="login-password">Password</label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="login-password"
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              className={`auth-input pr-11 ${errors.password ? 'auth-input-error' : ''}`}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <AnimatePresence>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500 font-medium"
              >
                <AlertCircle size={12} />
                {errors.password.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="login-submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full h-11 text-sm rounded-xl font-semibold mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Quick Demo Credentials */}
      <div className="mt-5 p-3.5 rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-[10px] font-bold uppercase tracking-wider mb-2 text-slate-500">
          Quick Login Credentials (Click to Fill)
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { role: 'Admin', email: 'admin@gmail.com', pass: 'admin123' },
            { role: 'Alumni', email: 'aarav.patel@example.com', pass: 'password123' },
            { role: 'Student', email: 'mranjana9094@gmail.com', pass: 'Hello@123' },
          ].map((cred) => (
            <button
              key={cred.role}
              type="button"
              onClick={() => {
                setValue('email', cred.email, { shouldValidate: true });
                setValue('password', cred.pass, { shouldValidate: true });
              }}
              className="p-2 rounded-lg text-left bg-white border border-slate-200 hover:border-[#1597A2] transition-all hover:shadow-xs cursor-pointer"
            >
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mb-1 bg-[#DFF3F5] text-[#073F7C]">
                {cred.role}
              </span>
              <p className="text-[10px] font-bold text-slate-800 truncate">{cred.email}</p>
              <p className="text-[9px] text-slate-500 font-mono">Pass: {cred.pass}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Register link */}
      <p className="text-center text-sm text-slate-500 mt-5 font-medium">
        Don't have an account?{' '}
        <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700 transition-colors">
          Create account
        </Link>
      </p>
    </motion.div>
  );
}
