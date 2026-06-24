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
          className="fixed left-4 top-[5rem] bottom-4 w-64 z-20 bg-white border border-slate-200 shadow-sm rounded-2xl overflow-y-auto scrollbar-none"
        >
          <div className="px-3 py-4 space-y-5">
            {/* Profile Summary */}
            {user && (
              <Link
                to="/profile"
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                {user.avatar ? (
                  <img src={user.avatar} className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100" alt="" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#0169FC] flex items-center justify-center flex-shrink-0 shadow-xs">
                    <span className="text-white text-xs font-bold">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-[10px] text-slate-400 capitalize font-semibold">{user.role}</p>
                </div>
                <ChevronRight size={13} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
              </Link>
            )}

            {/* Navigation */}
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
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
                        <Icon size={16} className="flex-shrink-0" />
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {user?.role === 'admin' && (
              <div>
                <p className="px-3 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Admin</p>
                <div className="space-y-0.5">
                  {adminItems.map(({ icon: Icon, label, href }) => {
                    const isActive = location.pathname === href;
                    return (
                      <Link key={href} to={href} className={isActive ? 'nav-item-active' : 'nav-item'}>
                        <Icon size={16} className="flex-shrink-0" />
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* IITRAM Branding */}
            <div className="mx-2.5 p-3.5 rounded-xl bg-[#001f54] text-white shadow-xs">
              <div className="flex items-center gap-2 mb-1.5">
                <GraduationCap size={16} className="text-slate-200" />
                <span className="text-xs font-bold tracking-wide">IITRAM Alumni</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Connecting minds, building futures. Be part of our growing community.
              </p>
              <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center gap-2.5 text-[10px] text-slate-300 font-semibold">
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
