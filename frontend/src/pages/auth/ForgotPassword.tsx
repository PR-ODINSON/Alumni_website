import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { authApi } from '../../lib/api';

const schema = z.object({ email: z.string().email('Please enter a valid email') });

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, getValues } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      await authApi.forgotPassword(data.email);
      setSent(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send reset email.');
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4"
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #93c5fd' }}
        >
          <Mail size={36} className="text-brand-500" />
        </div>
        <h2 className="text-2xl font-bold font-display text-slate-900 mb-2">Check your email</h2>
        <p className="text-slate-500 text-sm mb-2 max-w-xs mx-auto leading-relaxed">
          We've sent password reset instructions to
        </p>
        <p className="text-brand-600 font-semibold text-sm mb-6">{getValues('email')}</p>
        <Link to="/login" className="btn btn-primary btn-lg w-full">
          Back to Sign In
        </Link>
        <p className="text-xs text-slate-400 mt-4">
          Didn't receive it?{' '}
          <button type="button" onClick={() => setSent(false)} className="text-brand-600 font-semibold hover:underline">
            Try again
          </button>
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-7 font-medium transition-colors group">
        <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Sign In
      </Link>

      <div className="mb-7">
        <h1 className="text-2xl font-bold font-display text-slate-900 mb-1.5 tracking-tight">Reset Password</h1>
        <p className="text-sm text-slate-500">Enter your email and we'll send you reset instructions.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="input-label" htmlFor="forgot-email">Email Address</label>
          <input
            id="forgot-email"
            {...register('email')}
            type="email"
            className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500 font-medium"
              >
                <AlertCircle size={12} /> {(errors.email as any).message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <button
          type="submit"
          id="forgot-pw-submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full h-11"
        >
          {isSubmitting
            ? <><Loader2 size={16} className="animate-spin" /> Sending...</>
            : <><Mail size={15} /> Send Reset Link</>
          }
        </button>
      </form>
    </motion.div>
  );
}
