import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, User, GraduationCap, Lock } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const steps = [
  { id: 1, label: 'Personal', icon: User },
  { id: 2, label: 'Academic', icon: GraduationCap },
  { id: 3, label: 'Password', icon: Lock },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -40, opacity: 0 }),
};

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, trigger } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'alumni' },
    mode: 'onChange',
  });

  const password = watch('password') || '';
  const pwStrength = getPasswordStrength(password);

  const goNext = async () => {
    let fields: (keyof RegisterForm)[] = [];
    if (step === 1) fields = ['firstName', 'lastName', 'email'];
    if (step === 2) fields = ['role', 'department', 'batch', 'degreeType'];
    const ok = await trigger(fields);
    if (ok) { setDir(1); setStep(s => s + 1); }
  };

  const goPrev = () => { setDir(-1); setStep(s => s - 1); };

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
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-6"
      >
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', border: '1px solid #6ee7b7' }}>
          <CheckCircle size={36} className="text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold font-display text-slate-900 mb-2">Check your inbox!</h2>
        <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
          We've sent a verification link to your email. Please verify to activate your account.
        </p>
        <Link to="/login" className="btn btn-primary btn-lg">
          Back to Sign In
        </Link>
      </motion.div>
    );
  }

  const errorField = (err?: { message?: string }) => err ? (
    <motion.p
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-1.5 flex items-center gap-1 text-[11px] text-red-500 font-medium"
    >
      <AlertCircle size={11} /> {err.message}
    </motion.p>
  ) : null;

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">Join IITRAM Alumni</h1>
        <p className="text-sm text-slate-500 mt-0.5">Create your profile and connect with your network</p>
      </div>

      {/* Google Sign Up */}
      <a
        href={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/api/auth/google`}
        className="flex items-center justify-center gap-3 w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold text-sm transition-all mb-4 shadow-xs"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
      >
        <svg viewBox="0 0 24 24" style={{ width: 17, height: 17 }}>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Sign up with Google
      </a>

      <div className="divider-text mb-5">or register with email</div>

      {/* Step Progress */}
      <div className="flex items-center gap-2 mb-6">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const done = step > s.id;
          const active = step === s.id;
          return (
            <div key={s.id} className="flex items-center gap-2 flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: done ? 'linear-gradient(135deg,#10b981,#059669)' :
                      active ? 'linear-gradient(135deg,#1597A2,#0B6169)' : '#f1f5f9',
                    border: done || active ? 'none' : '1px solid #e2e8f0',
                  }}
                >
                  {done
                    ? <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : <Icon size={13} className={active ? 'text-white' : 'text-slate-400'} />
                  }
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${active ? 'text-brand-600' : done ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px mt-[-0.875rem]" style={{ background: done ? '#10b981' : '#e2e8f0', transition: 'background 0.3s ease' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Form Steps */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="space-y-3.5"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label" htmlFor="reg-firstName">First Name</label>
                    <input id="reg-firstName" {...register('firstName')} className={`auth-input ${errors.firstName ? 'auth-input-error' : ''}`} placeholder="Rahul" />
                    <AnimatePresence>{errorField(errors.firstName)}</AnimatePresence>
                  </div>
                  <div>
                    <label className="input-label" htmlFor="reg-lastName">Last Name</label>
                    <input id="reg-lastName" {...register('lastName')} className={`auth-input ${errors.lastName ? 'auth-input-error' : ''}`} placeholder="Sharma" />
                    <AnimatePresence>{errorField(errors.lastName)}</AnimatePresence>
                  </div>
                </div>
                <div>
                  <label className="input-label" htmlFor="reg-email">Email Address</label>
                  <input id="reg-email" {...register('email')} type="email" className={`auth-input ${errors.email ? 'auth-input-error' : ''}`} placeholder="you@example.com" autoComplete="email" />
                  <AnimatePresence>{errorField(errors.email)}</AnimatePresence>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="space-y-3.5"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label" htmlFor="reg-role">I am a</label>
                    <select id="reg-role" {...register('role')} className="auth-input">
                      <option value="alumni">Alumni</option>
                      <option value="student">Current Student</option>
                      <option value="faculty">Faculty</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label" htmlFor="reg-degree">Degree</label>
                    <select id="reg-degree" {...register('degreeType')} className={`auth-input ${errors.degreeType ? 'auth-input-error' : ''}`}>
                      <option value="">Select Degree</option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="MBA">MBA</option>
                      <option value="PhD">PhD</option>
                      <option value="Diploma">Diploma</option>
                    </select>
                    <AnimatePresence>{errorField(errors.degreeType)}</AnimatePresence>
                  </div>
                </div>
                <div>
                  <label className="input-label" htmlFor="reg-dept">Department</label>
                  <select id="reg-dept" {...register('department')} className={`auth-input ${errors.department ? 'auth-input-error' : ''}`}>
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <AnimatePresence>{errorField(errors.department)}</AnimatePresence>
                </div>
                <div>
                  <label className="input-label" htmlFor="reg-batch">Batch Year</label>
                  <input id="reg-batch" {...register('batch')} className={`auth-input ${errors.batch ? 'auth-input-error' : ''}`} placeholder="e.g. 2019" maxLength={4} />
                  <AnimatePresence>{errorField(errors.batch)}</AnimatePresence>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="space-y-3.5"
              >
                <div>
                  <label className="input-label" htmlFor="reg-pw">Password</label>
                  <div className="relative">
                    <input
                      id="reg-pw"
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className={`auth-input pr-11 ${errors.password ? 'auth-input-error' : ''}`}
                      placeholder="Min. 8 characters"
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" tabIndex={-1}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <AnimatePresence>{errorField(errors.password)}</AnimatePresence>
                  {/* Password strength meter */}
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4].map(n => (
                          <div
                            key={n}
                            className="pw-strength-bar"
                            style={{
                              background: n <= pwStrength.score ? pwStrength.color : '#e2e8f0',
                              height: 3,
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] font-semibold" style={{ color: pwStrength.color }}>
                        {pwStrength.label}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="input-label" htmlFor="reg-cpw">Confirm Password</label>
                  <input
                    id="reg-cpw"
                    {...register('confirmPassword')}
                    type="password"
                    className={`auth-input ${errors.confirmPassword ? 'auth-input-error' : ''}`}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                  />
                  <AnimatePresence>{errorField(errors.confirmPassword)}</AnimatePresence>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  By creating an account you agree to our{' '}
                  <a href="#" className="text-brand-600 hover:underline font-semibold">Terms</a>
                  {' '}and{' '}
                  <a href="#" className="text-brand-600 hover:underline font-semibold">Privacy Policy</a>.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-2.5 mt-5">
          {step > 1 && (
            <button
              type="button"
              onClick={goPrev}
              className="btn btn-outline flex-1 h-11"
            >
              <ArrowLeft size={15} /> Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
              className="btn btn-primary flex-1 h-11"
            >
              Continue <ArrowRight size={15} />
            </button>
          ) : (
            <button
              type="submit"
              id="register-submit"
              disabled={isSubmitting}
              className="btn btn-primary flex-1 h-11"
            >
              {isSubmitting ? <><Loader2 size={15} className="animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          )}
        </div>
      </form>

      <p className="text-center text-sm text-slate-500 mt-4 font-medium">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
