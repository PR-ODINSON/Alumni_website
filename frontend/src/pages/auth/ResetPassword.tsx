import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { authApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score: 1, label: 'Weak', color: '#ef4444' };
  if (score <= 2) return { score: 2, label: 'Fair', color: '#f59e0b' };
  if (score <= 3) return { score: 3, label: 'Good', color: '#3b82f6' };
  return { score: 4, label: 'Strong', color: '#10b981' };
}

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const password = watch('password') || '';
  const pwStrength = getPasswordStrength(password);

  const onSubmit = async (data: any) => {
    try {
      const res = await authApi.resetPassword(token!, data.password);
      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      toast.success('Password reset successfully!');
      navigate('/feed');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password. Link may be expired.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="mb-7">
        <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4">
          <ShieldCheck size={22} className="text-brand-600" />
        </div>
        <h1 className="text-2xl font-bold font-display text-slate-900 mb-1.5 tracking-tight">Set new password</h1>
        <p className="text-sm text-slate-500">Create a strong password for your account.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="input-label" htmlFor="reset-pw">New Password</label>
          <div className="relative">
            <input
              id="reset-pw"
              {...register('password')}
              type={showPw ? 'text' : 'password'}
              className={`auth-input pr-11 ${errors.password ? 'auth-input-error' : ''}`}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" tabIndex={-1}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <AnimatePresence>
            {errors.password && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500 font-medium">
                <AlertCircle size={12} /> {(errors.password as any).message}
              </motion.p>
            )}
          </AnimatePresence>
          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="pw-strength-bar" style={{ background: n <= pwStrength.score ? pwStrength.color : '#e2e8f0', height: 3 }} />
                ))}
              </div>
              <p className="text-[10px] font-semibold" style={{ color: pwStrength.color }}>{pwStrength.label}</p>
            </div>
          )}
        </div>

        <div>
          <label className="input-label" htmlFor="reset-cpw">Confirm Password</label>
          <div className="relative">
            <input
              id="reset-cpw"
              {...register('confirmPassword')}
              type={showCpw ? 'text' : 'password'}
              className={`auth-input pr-11 ${errors.confirmPassword ? 'auth-input-error' : ''}`}
              placeholder="Repeat password"
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowCpw(!showCpw)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" tabIndex={-1}>
              {showCpw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <AnimatePresence>
            {errors.confirmPassword && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500 font-medium">
                <AlertCircle size={12} /> {(errors.confirmPassword as any).message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <button
          type="submit"
          id="reset-pw-submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full h-11 mt-2"
        >
          {isSubmitting
            ? <><Loader2 size={16} className="animate-spin" /> Resetting...</>
            : 'Reset Password'
          }
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-5">
        Remember your password?{' '}
        <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700 transition-colors">Sign in</Link>
      </p>
    </motion.div>
  );
}
