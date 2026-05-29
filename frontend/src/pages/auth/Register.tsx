import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../../lib/api';
import { DEPARTMENTS } from '../../lib/utils';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['student', 'alumni', 'faculty']),
  batch: z.string().min(4, 'Batch year is required'),
  department: z.string().min(1, 'Department is required'),
  degreeType: z.string().min(1, 'Degree type is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'alumni' },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await authApi.register(data);
      setRegistered(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  if (registered) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Check your email</h2>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
          We've sent a verification link to your email address. Please verify your account to get started.
        </p>
        <Link to="/login" className="btn btn-primary btn-lg">
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Join IITRAM Alumni</h1>
        <p className="text-slate-500">Create your profile and connect with your network</p>
      </div>

      {/* Google Sign Up */}
      <a
        href={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/api/auth/google`}
        className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-all mb-6 shadow-sm"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Sign up with Google
      </a>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
        <div className="relative flex justify-center"><span className="bg-white px-4 text-xs text-slate-400">or register with email</span></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
            <input {...register('firstName')} className={`input ${errors.firstName ? 'input-error' : ''}`} placeholder="Rahul" />
            {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
            <input {...register('lastName')} className={`input ${errors.lastName ? 'input-error' : ''}`} placeholder="Sharma" />
            {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input {...register('email')} type="email" className={`input ${errors.email ? 'input-error' : ''}`} placeholder="you@example.com" />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">I am a</label>
          <select {...register('role')} className="input">
            <option value="alumni">Alumni</option>
            <option value="student">Current Student</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Batch Year</label>
            <input {...register('batch')} className={`input ${errors.batch ? 'input-error' : ''}`} placeholder="2019" maxLength={4} />
            {errors.batch && <p className="mt-1 text-xs text-red-500">{errors.batch.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Degree</label>
            <select {...register('degreeType')} className="input">
              <option value="">Select</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="MBA">MBA</option>
              <option value="PhD">PhD</option>
              <option value="Diploma">Diploma</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
          <select {...register('department')} className={`input ${errors.department ? 'input-error' : ''}`}>
            <option value="">Select your department</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
              placeholder="Min. 8 characters"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
          <input
            {...register('confirmPassword')}
            type="password"
            className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
            placeholder="Repeat password"
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <p className="text-xs text-slate-500">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-iitram-600 hover:underline">Terms of Service</a> and{' '}
          <a href="#" className="text-iitram-600 hover:underline">Privacy Policy</a>.
        </p>

        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full py-3 text-base">
          {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Creating account...</> : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-iitram-700 hover:text-iitram-800">Sign in</Link>
      </p>
    </div>
  );
}
