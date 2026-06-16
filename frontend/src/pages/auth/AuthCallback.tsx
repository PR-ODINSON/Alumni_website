import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const { setAuth, setTokens } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const refresh = searchParams.get('refresh');

    if (!token || !refresh) {
      toast.error('Authentication failed.');
      navigate('/login');
      return;
    }

    setTokens(token, refresh);

    api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const user = res.data.user;
        setAuth(user, token, refresh);
        if (!user.isProfileComplete) {
          navigate('/onboarding');
        } else {
          toast.success(`Welcome back, ${user.firstName}!`);
          navigate('/feed');
        }
      })
      .catch(() => {
        toast.error('Failed to load your account. Please try again.');
        navigate('/login');
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 size={48} className="text-iitram-600 animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Completing sign in...</p>
      </div>
    </div>
  );
}
