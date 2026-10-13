import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { authApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await authApi.verifyEmail(token!);
        setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
        setStatus('success');
        setTimeout(() => navigate('/feed'), 2500);
      } catch {
        setStatus('error');
      }
    };
    if (token) verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #f8faff 0%, #f0f7ff 50%, #e8f4ff 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl p-10 max-w-sm w-full text-center"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)' }}
      >
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto mb-5">
              <Loader2 size={28} className="text-brand-500 animate-spin" />
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900 mb-2">Verifying your email</h2>
            <p className="text-slate-500 text-sm">Please wait a moment...</p>
            <div className="mt-5 flex gap-1.5 justify-center">
              {[0, 0.2, 0.4].map((d, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-brand-400"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1, delay: d }}
                />
              ))}
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', border: '1px solid #6ee7b7' }}
            >
              <CheckCircle size={28} className="text-emerald-500" />
            </motion.div>
            <h2 className="text-xl font-bold font-display text-slate-900 mb-2">Email verified! 🎉</h2>
            <p className="text-slate-500 text-sm mb-5">Redirecting you to your dashboard...</p>
            <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #10b981, #059669)' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, ease: 'linear' }}
              />
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', border: '1px solid #fca5a5' }}
            >
              <XCircle size={28} className="text-red-500" />
            </motion.div>
            <h2 className="text-xl font-bold font-display text-slate-900 mb-2">Verification failed</h2>
            <p className="text-slate-500 text-sm mb-6">The link may be expired or invalid. Please try registering again.</p>
            <Link to="/login" className="btn btn-primary w-full h-11">
              Back to Login
            </Link>
            <Link to="/register" className="btn btn-outline w-full h-11 mt-2">
              Create new account
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
