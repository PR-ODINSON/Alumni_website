import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Briefcase, Calendar,
  MessageCircle, BarChart3, Lightbulb,
  Globe, Star, BookOpen, Rocket, Archive, GraduationCap, ChevronRight,
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';

const navGroups = [
  {
    label: 'Discover',
    items: [
      { icon: Users, label: 'Alumni Directory', href: '/alumni' },
      { icon: GraduationCap, label: 'Student Directory', href: '/students' },
      { icon: Globe, label: 'Community Feed', href: '/feed' },
      { icon: Star, label: 'Success Stories', href: '/stories' },
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
      { icon: Rocket, label: 'Startup Ecosystem', href: '/startups' },
      { icon: Archive, label: 'Legacy Archive', href: '/legacy' },
      { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    ],
  },
];

const adminItems = [
  { icon: LayoutDashboard, label: 'Admin Dashboard', href: '/admin' },
];

export default function Sidebar() {
  const location = useLocation();
  const { sidebarOpen } = useUIStore();
  const { user } = useAuthStore();

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -260 }}
          animate={{ x: 0 }}
          exit={{ x: -260 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed left-0 top-16 bottom-0 w-64 z-20 bg-white border-r border-slate-100 overflow-y-auto scrollbar-none"
        >
          <div className="px-3 py-4 space-y-6">
            {/* Profile Summary */}
            {user && (
              <Link
                to="/profile"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                {user.avatar ? (
                  <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-iitram-700 to-iitram-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                </div>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
              </Link>
            )}

            {/* Navigation */}
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 mb-1.5 text-2xs font-semibold text-slate-400 uppercase tracking-wider">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map(({ icon: Icon, label, href }) => {
                    const isActive = location.pathname === href || location.pathname.startsWith(href + '/');
                    return (
                      <Link
                        key={href}
                        to={href}
                        className={isActive ? 'nav-item-active' : 'nav-item'}
                      >
                        <Icon size={17} className="flex-shrink-0" />
                        <span>{label}</span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-iitram-500" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {user?.role === 'admin' && (
              <div>
                <p className="px-3 mb-1.5 text-2xs font-semibold text-slate-400 uppercase tracking-wider">Admin</p>
                <div className="space-y-0.5">
                  {adminItems.map(({ icon: Icon, label, href }) => {
                    const isActive = location.pathname === href;
                    return (
                      <Link key={href} to={href} className={isActive ? 'nav-item-active' : 'nav-item'}>
                        <Icon size={17} className="flex-shrink-0" />
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* IITRAM Branding */}
            <div className="mx-3 p-4 rounded-xl bg-gradient-to-br from-iitram-700 to-iitram-600 text-white">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap size={18} className="text-iitram-200" />
                <span className="text-sm font-semibold">IITRAM Alumni</span>
              </div>
              <p className="text-xs text-iitram-200 leading-relaxed">
                Connecting minds, building futures. Be part of our growing community.
              </p>
              <div className="mt-3 pt-3 border-t border-iitram-600 flex items-center gap-3 text-xs text-iitram-300">
                <Globe size={12} />
                <span>Est. 2013 · Ahmedabad</span>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
