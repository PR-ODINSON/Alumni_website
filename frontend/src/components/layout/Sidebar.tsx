import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Briefcase, Calendar,
  MessageCircle, BarChart3, Lightbulb,
  Globe, Star, BookOpen, Rocket, Archive, GraduationCap, ChevronRight, X, Building2,
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { useAuthorization } from '../../contexts/AuthorizationContext';

const navGroups = [
  {
    label: 'Discover',
    items: [
      { icon: Users, label: 'People Directory', href: '/directory' },
      { icon: Globe, label: 'Community Feed', href: '/feed' },
      { icon: Star, label: 'Stories & Legacy', href: '/stories' },
    ],
  },
  {
    label: 'Career',
    items: [
      { icon: Briefcase, label: 'Jobs & Referrals', href: '/jobs' },
      { icon: Lightbulb, label: 'Mentorship', href: '/mentorship' },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { icon: Calendar, label: 'Events', href: '/events' },
      { icon: BookOpen, label: 'Research Hub', href: '/research' },
      { icon: MessageCircle, label: 'Messages', href: '/messages' },
    ],
  },
  {
    label: 'IITRAM',
    items: [
      { icon: Building2, label: 'About IITRAM', href: '/institute' },
      { icon: Rocket, label: 'Startup Ecosystem', href: '/startups' },
      { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    ],
  },
];

const adminItems = [
  { icon: LayoutDashboard, label: 'Admin Dashboard', href: '/admin' },
];

export default function Sidebar() {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { user } = useAuthStore();
  const { can } = useAuthorization();

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 32 }}
          className="fixed left-3 sm:left-4 top-[4.5rem] bottom-3 sm:bottom-4 w-64 z-30 bg-white border border-slate-200 shadow-lg lg:shadow-xs rounded-2xl overflow-y-auto scrollbar-none"
        >
          <div className="p-3.5 space-y-4">
            {/* Mobile Header / Close button */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 lg:hidden">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Navigation</span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                aria-label="Close sidebar"
              >
                <X size={16} />
              </button>
            </div>

            {/* Profile Summary */}
            {user && (
              <Link
                to="/profile"
                onClick={handleLinkClick}
                className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors group"
              >
                {user.avatar ? (
                  <img src={user.avatar} className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 shrink-0" alt="" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center shrink-0 shadow-2xs">
                    <span className="text-white text-xs font-bold">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-[10px] text-slate-400 capitalize font-semibold truncate">{user.role}</p>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
              </Link>
            )}

            {/* Navigation Groups */}
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map(({ icon: Icon, label, href }) => {
                    const isActive =
                      location.pathname === href ||
                      location.pathname.startsWith(href + '/') ||
                      (href === '/directory' && (location.pathname.startsWith('/alumni') || location.pathname.startsWith('/students'))) ||
                      (href === '/stories' && location.pathname.startsWith('/legacy'));
                    return (
                      <Link
                        key={href}
                        to={href}
                        onClick={handleLinkClick}
                        className={isActive ? 'nav-item-active' : 'nav-item'}
                      >
                        <Icon size={16} className="shrink-0" />
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {can('admin:panel_access') && (
              <div>
                <p className="px-3 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Admin</p>
                <div className="space-y-0.5">
                  {adminItems.map(({ icon: Icon, label, href }) => {
                    const isActive = location.pathname === href;
                    return (
                      <Link
                        key={href}
                        to={href}
                        onClick={handleLinkClick}
                        className={isActive ? 'nav-item-active' : 'nav-item'}
                      >
                        <Icon size={16} className="shrink-0" />
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* IITRAM Branding card */}
            <div className="p-3 rounded-xl bg-[#001f54] text-white shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap size={15} className="text-slate-200" />
                <span className="text-xs font-bold tracking-wide">IITRAM Alumni</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-normal">
                Connecting minds, building futures.
              </p>
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2 text-[9px] text-slate-300 font-semibold">
                <Globe size={11} />
                <span>Est. 2013 · Ahmedabad</span>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
