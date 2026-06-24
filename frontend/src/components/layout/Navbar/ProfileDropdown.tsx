import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, LogOut, User, Briefcase, BookOpen, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

export default function ProfileDropdown() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  if (!user) return null;

  return (
    <div ref={profileRef} className="relative">
      <button
        onClick={() => setProfileOpen(!profileOpen)}
        className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-2xl hover:bg-slate-100/60 backdrop-blur-sm transition-all border border-transparent hover:border-white/50 cursor-pointer"
      >
        {user.avatar ? (
          <img src={user.avatar} className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100" alt={user.firstName} />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-semibold">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </span>
          </div>
        )}
        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold text-slate-800 leading-none">{user.firstName}</p>
          <p className="text-[10px] text-slate-500 font-semibold leading-none mt-1 capitalize">{user.role}</p>
        </div>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      <AnimatePresence>
        {profileOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-soft-xl border border-slate-100/80 overflow-hidden py-1.5 z-40"
          >
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-xs font-bold font-display text-slate-900 leading-none">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-slate-400 truncate mt-1.5 font-medium">{user.email}</p>
            </div>

            {[
              { icon: User, label: 'My Profile', href: '/profile' },
              { icon: Briefcase, label: 'My Applications', href: '/jobs?tab=applications' },
              { icon: BookOpen, label: 'My Events', href: '/events?tab=registered' },
              ...(user.role === 'admin' ? [{ icon: LayoutDashboard, label: 'Admin Panel', href: '/admin' }] : []),
            ].map(({ icon: Icon, label, href }) => (
              <Link
                key={href}
                to={href}
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors font-medium"
              >
                <Icon size={14} className="text-slate-400" />
                {label}
              </Link>
            ))}

            <div className="border-t border-slate-100 mt-1 pt-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors font-bold cursor-pointer"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
