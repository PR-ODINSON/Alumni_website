import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import {
  Bell, Search, Menu, X, ChevronDown, LogOut, User,
  Settings, Briefcase, BookOpen, Users, LayoutDashboard,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '../../lib/api';
import toast from 'react-hot-toast';
import api from '../../lib/api';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toggleSidebar, sidebarOpen } = useUIStore();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const { data: notifData } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationApi.getAll({ unreadOnly: true, limit: 8 }),
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  const unreadCount = notifData?.data?.unreadCount || 0;
  const notifications = notifData?.data?.data || [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
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

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-white border-b border-slate-100 shadow-sm">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors lg:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-iitram-700 to-iitram-500 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs">IA</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-slate-900 text-sm leading-none">IITRAM</span>
              <span className="block text-2xs text-slate-500 leading-none mt-0.5">Alumni Network</span>
            </div>
          </Link>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: 'Alumni', href: '/alumni' },
            { label: 'Jobs', href: '/jobs' },
            { label: 'Events', href: '/events' },
            { label: 'Stories', href: '/success-stories' },
            { label: 'Research', href: '/research' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              to={href}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <Search size={18} />
          </button>

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-2xs rounded-full flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-soft-xl border border-slate-100 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                        <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => notificationApi.markAllRead()}
                            className="text-xs text-iitram-600 hover:text-iitram-700"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-sm text-slate-500">
                            No new notifications
                          </div>
                        ) : (
                          notifications.map((n: any) => (
                            <div
                              key={n._id}
                              className={`px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 cursor-pointer ${!n.isRead ? 'bg-iitram-50/50' : ''}`}
                              onClick={() => {
                                if (n.link) navigate(n.link);
                                setNotifOpen(false);
                              }}
                            >
                              <div className="flex items-start gap-3">
                                {n.sender?.avatar ? (
                                  <img src={n.sender.avatar} className="w-8 h-8 rounded-full object-cover flex-shrink-0" alt="" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-iitram-100 flex items-center justify-center flex-shrink-0">
                                    <Bell size={14} className="text-iitram-600" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-slate-900 leading-relaxed">{n.message}</p>
                                  <p className="text-2xs text-slate-400 mt-0.5">
                                    {new Date(n.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                {!n.isRead && <div className="w-1.5 h-1.5 rounded-full bg-iitram-500 flex-shrink-0 mt-1" />}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" alt={user.firstName} />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-iitram-700 to-iitram-500 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </span>
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-900 leading-none">{user?.firstName}</p>
                    <p className="text-2xs text-slate-500 leading-none mt-0.5 capitalize">{user?.role}</p>
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
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-soft-xl border border-slate-100 overflow-hidden py-1.5"
                    >
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>

                      {[
                        { icon: User, label: 'My Profile', href: '/profile' },
                        { icon: Briefcase, label: 'My Applications', href: '/jobs?tab=applications' },
                        { icon: BookOpen, label: 'My Events', href: '/events?tab=registered' },
                        ...(user?.role === 'admin' ? [{ icon: LayoutDashboard, label: 'Admin Panel', href: '/admin' }] : []),
                      ].map(({ icon: Icon, label, href }) => (
                        <Link
                          key={href}
                          to={href}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Icon size={15} className="text-slate-400" />
                          {label}
                        </Link>
                      ))}

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost text-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary text-sm">Join Network</Link>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-md"
          >
            <div className="max-w-2xl mx-auto px-4 py-3">
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200 focus-within:border-iitram-300 focus-within:ring-2 focus-within:ring-iitram-100">
                <Search size={16} className="text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery) {
                      navigate(`/alumni?search=${searchQuery}`);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }
                    if (e.key === 'Escape') setSearchOpen(false);
                  }}
                  placeholder="Search alumni, jobs, events..."
                  className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none"
                />
                <kbd className="text-2xs text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded font-mono">ESC</kbd>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
