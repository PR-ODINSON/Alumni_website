import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../../lib/api';

const schema = z.object({ email: z.string().email('Please enter a valid email') });

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

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
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-iitram-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={32} className="text-iitram-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Check your email</h2>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">We've sent password reset instructions to your email address.</p>
        <Link to="/login" className="btn btn-primary btn-lg">Back to Sign In</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-8">
        <ArrowLeft size={16} /> Back to Sign In
      </Link>
      <h1 className="text-3xl font-bold font-display text-slate-900 mb-2 tracking-tight">Reset Password</h1>
      <p className="text-sm text-slate-500 mb-8">Enter your email and we'll send a reset link.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
          <input {...register('email')} type="email" className={`input ${errors.email ? 'input-error' : ''}`} placeholder="you@example.com" />
          {errors.email && <p className="mt-1 text-xs text-red-500">{(errors.email as any).message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full py-3">
          {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
}
