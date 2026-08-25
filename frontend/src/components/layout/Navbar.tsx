import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Users, Briefcase, Calendar, BookOpen, FlaskConical, LogIn, UserPlus, Building2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';

// Subcomponents
import NotificationsDropdown from './Navbar/NotificationsDropdown';
import ProfileDropdown from './Navbar/ProfileDropdown';
import SearchBar from './Navbar/SearchBar';

const NAV_LINKS = [
  { label: 'About IITRAM', href: '/institute', icon: Building2 },
  { label: 'Directory', href: '/directory', icon: Users },
  { label: 'Jobs', href: '/jobs', icon: Briefcase },
  { label: 'Events', href: '/events', icon: Calendar },
  { label: 'Stories', href: '/stories', icon: BookOpen },
  { label: 'Research', href: '/research', icon: FlaskConical },
];

export default function Navbar() {
  const { isAuthenticated } = useAuthStore();
  const { toggleSidebar, sidebarOpen, setSidebarOpen } = useUIStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-35 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors lg:hidden cursor-pointer"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center shadow-xs transition-colors group-hover:bg-brand-600">
              <span className="text-white font-extrabold text-xs tracking-wider">IA</span>
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm font-display tracking-tight leading-none block">IITRAM</span>
              <span className="block text-[10px] text-slate-400 font-semibold leading-none mt-0.5">Alumni Network</span>
            </div>
          </Link>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive =
              location.pathname === href ||
              location.pathname.startsWith(href + '/') ||
              (href === '/institute' && location.pathname.startsWith('/institute')) ||
              (href === '/directory' && (location.pathname.startsWith('/alumni') || location.pathname.startsWith('/students')));
            return (
              <Link
                key={href}
                to={href}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Collapsible Search */}
          <SearchBar searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

          {isAuthenticated ? (
            <>
              {/* Notifications Dropdown */}
              <NotificationsDropdown />

              {/* Profile Dropdown */}
              <ProfileDropdown />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost btn-sm text-xs font-bold hidden xs:inline-flex">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm text-xs font-bold shadow-xs">
                Join Network
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Guest Mobile Navigation Drawer */}
      {!isAuthenticated && (
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 top-16 bg-slate-900/30 backdrop-blur-xs z-30 md:hidden"
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-40 p-4 md:hidden"
              >
                <div className="space-y-1 mb-4">
                  {NAV_LINKS.map(({ label, href, icon: Icon }) => {
                    const isActive =
                      location.pathname === href ||
                      location.pathname.startsWith(href + '/') ||
                      (href === '/institute' && location.pathname.startsWith('/institute')) ||
                      (href === '/directory' && (location.pathname.startsWith('/alumni') || location.pathname.startsWith('/students')));
                    return (
                      <Link
                        key={href}
                        to={href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                          isActive
                            ? 'text-brand-600 bg-brand-50'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Icon size={16} className="text-slate-400" />
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </div>
                <div className="pt-3 border-t border-slate-100 flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-outline btn-sm flex-1 text-xs font-bold"
                  >
                    <LogIn size={13} />
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-primary btn-sm flex-1 text-xs font-bold"
                  >
                    <UserPlus size={13} />
                    Join Network
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </header>
  );
}
