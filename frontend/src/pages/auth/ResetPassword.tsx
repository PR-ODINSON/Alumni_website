import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const [show, setShow] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: any) => {
    try {
      const res = await authApi.resetPassword(token!, data.password);
      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      toast.success('Password reset successfully!');
      navigate('/feed');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Set new password</h1>
      <p className="text-slate-500 mb-8">Create a strong password for your account.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
          <div className="relative">
            <input {...register('password')} type={show ? 'text' : 'password'} className={`input pr-10 ${errors.password ? 'input-error' : ''}`} placeholder="Min. 8 characters" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{(errors.password as any).message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
          <input {...register('confirmPassword')} type="password" className={`input ${errors.confirmPassword ? 'input-error' : ''}`} placeholder="Repeat password" />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{(errors.confirmPassword as any).message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full py-3">
          {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Resetting...</> : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
