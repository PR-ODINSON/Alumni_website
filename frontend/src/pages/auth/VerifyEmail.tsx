import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
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
        setTimeout(() => navigate('/feed'), 2000);
      } catch {
        setStatus('error');
      }
    };
    if (token) verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-2xl shadow-soft-xl p-12 max-w-md w-full mx-4 text-center">
        {status === 'loading' && (
          <>
            <Loader2 size={48} className="text-iitram-600 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Verifying your email</h2>
            <p className="text-slate-500">Please wait a moment...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle size={48} className="text-emerald-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Email verified!</h2>
            <p className="text-slate-500">Redirecting you to your dashboard...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle size={48} className="text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Verification failed</h2>
            <p className="text-slate-500 mb-6">The link may be expired or invalid.</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary">Back to Login</button>
          </>
        )}
      </div>
    </div>
  );
}
