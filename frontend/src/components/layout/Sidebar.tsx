import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Briefcase, Calendar, MessageCircle,
  BarChart3, Lightbulb, Globe, Star, BookOpen, Rocket,
  GraduationCap, X, Building2, CreditCard, ChevronRight, Users2,
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { useAuthorization } from '../../contexts/AuthorizationContext';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard',      href: '/' },
      { icon: Users,           label: 'Directory',      href: '/directory' },
      { icon: Globe,           label: 'Community Feed', href: '/feed' },
    ],
  },
  {
    label: 'Connect',
    items: [
      { icon: Users2,        label: 'Alumni Network', href: '/directory?tab=alumni' },
      { icon: Lightbulb,     label: 'Mentorship',     href: '/mentorship' },
      { icon: MessageCircle, label: 'Messages',       href: '/messages' },
    ],
  },
  {
    label: 'Opportunities',
    items: [
      { icon: Briefcase, label: 'Jobs & Referrals', href: '/jobs' },
      { icon: Calendar,  label: 'Events',           href: '/events' },
      { icon: Rocket,    label: 'Startups',         href: '/startups' },
      { icon: BookOpen,  label: 'Research Hub',     href: '/research' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { icon: Star,       label: 'Stories & Legacy', href: '/stories' },
      { icon: BarChart3,  label: 'Analytics',        href: '/analytics' },
      { icon: CreditCard, label: 'Digital ID Card',  href: '/icards' },
      { icon: Building2,  label: 'About IITRAM',     href: '/institute' },
    ],
  },
];

const adminItems = [
  { icon: LayoutDashboard, label: 'Admin Dashboard', href: '/admin' },
];

function NavItem({ icon: Icon, label, href, onClick }: {
  icon: any; label: string; href: string; onClick?: () => void;
}) {
  const location = useLocation();
  const isActive =
    (href === '/' && location.pathname === '/') ||
    (href !== '/' && (
      location.pathname === href ||
      location.pathname.startsWith(href.split('?')[0] + '/') ||
      (href.includes('/directory') && (
        location.pathname.startsWith('/alumni') || location.pathname.startsWith('/students')
      )) ||
      (href === '/stories' && location.pathname.startsWith('/legacy'))
    ));

  return (
    <Link to={href} onClick={onClick} className={isActive ? 'nav-item-active' : 'nav-item'}>
      <Icon size={15} className="shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { user } = useAuthStore();
  const { can } = useAuthorization();

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  // Build safe display name (avoid "Hemanshu Hemanshu" when firstName === lastName)
  const firstName = user?.firstName?.trim() || '';
  const lastName = user?.lastName?.trim() || '';
  const displayName = firstName === lastName ? firstName : [firstName, lastName].filter(Boolean).join(' ');
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 38 }}
          style={{ width: 'var(--sidebar-width)' }}
          className="fixed left-0 bottom-0 z-30 bg-white border-r border-slate-100 overflow-hidden flex flex-col
                     top-0 lg:top-14"
          // Mobile: covers full screen (top-0) so close button is accessible
          // Desktop: starts below navbar (top-14 = 3.5rem)
        >
          {/* Mobile-only top bar with logo + close */}
          <div className="flex lg:hidden items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
            <Link to="/" onClick={handleLinkClick} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
                <GraduationCap size={14} className="text-white" />
              </div>
              <span className="text-sm font-bold text-slate-900">IITRAM Alumni</span>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          </div>

          {/* Nav groups — scrollable */}
          <div className="flex-1 overflow-y-auto scrollbar-none px-3 py-4 space-y-5">
            {navGroups.map(group => {
              const filteredItems = group.items.filter(item => {
                // Students cannot see I-Cards or network analytics
                if (item.href === '/icards' && user?.role === 'student') return false;
                // Only admins can see global analytics
                if (item.href === '/analytics' && user?.role !== 'admin') return false;
                return true;
              });

              if (filteredItems.length === 0) return null;

              return (
                <div key={group.label}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1.5">
                    {group.label}
                  </p>
                  <div className="space-y-0.5">
                    {filteredItems.map(item => (
                      <NavItem key={item.href} {...item} onClick={handleLinkClick} />
                    ))}
                  </div>
                </div>
              );
            })}

            {(user?.role === 'admin' || can('admin:panel_access')) && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1.5">
                  Administration
                </p>
                <div className="space-y-0.5">
                  {adminItems.map(item => (
                    <NavItem key={item.href} {...item} onClick={handleLinkClick} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile card at bottom */}
          {user && (
            <div className="px-3 pb-3 pt-2 border-t border-slate-100 shrink-0">
              <Link
                to="/profile"
                onClick={handleLinkClick}
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
              >
                {user.avatar ? (
                  <img src={user.avatar} className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 shrink-0" alt={displayName} />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center shrink-0">
                    <span className="text-brand-700 text-xs font-bold">{initials}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate leading-none">{displayName}</p>
                  <p className="text-[10px] text-slate-400 capitalize font-medium mt-0.5">{user.role}</p>
                </div>
                <ChevronRight size={13} className="text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" />
              </Link>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
