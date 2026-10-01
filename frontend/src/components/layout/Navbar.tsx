import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, UserPlus, GraduationCap, Search } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import NotificationsDropdown from './Navbar/NotificationsDropdown';
import ProfileDropdown from './Navbar/ProfileDropdown';
import SearchBar from './Navbar/SearchBar';

const GUEST_LINKS = [
  { label: 'Directory', href: '/directory' },
  { label: 'I-Cards',   href: '/icards' },
  { label: 'Jobs',      href: '/jobs' },
  { label: 'Events',    href: '/events' },
  { label: 'Stories',   href: '/stories' },
  { label: 'Research',  href: '/research' },
];

export default function Navbar() {
  const { isAuthenticated } = useAuthStore();
  const { toggleSidebar, sidebarOpen } = useUIStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => { setMobileMenuOpen(false); setSearchOpen(false); }, [location.pathname]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 h-14 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-[0_1px_12px_rgba(15,23,42,0.08)]' : 'border-b border-slate-100'}`}>
      <div className="h-full max-w-[1440px] mx-auto px-4 sm:px-5 flex items-center justify-between gap-3">

        {/* Left */}
        <div className="flex items-center gap-2.5 shrink-0">
          {isAuthenticated ? (
            <button type="button" onClick={toggleSidebar} aria-label="Toggle sidebar" aria-expanded={sidebarOpen}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors lg:hidden cursor-pointer">
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          ) : (
            <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors md:hidden cursor-pointer">
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center shadow-xs shrink-0">
              <GraduationCap size={14} className="text-white" />
            </div>
            <div className="hidden xs:block">
              <span className="text-sm font-bold text-slate-900 leading-none block tracking-tight">IITRAM</span>
              <span className="text-[9px] text-slate-400 font-medium leading-none block mt-0.5">Alumni Network</span>
            </div>
          </Link>
        </div>

        {/* Center — guest nav */}
        {!isAuthenticated && (
          <nav className="hidden md:flex items-center gap-0.5">
            {GUEST_LINKS.map(({ label, href }) => {
              const active = location.pathname === href || location.pathname.startsWith(href + '/');
              return (
                <Link key={href} to={href}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${active ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
                  {label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isAuthenticated && (
            <>
              <button type="button" onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors group cursor-pointer">
                <Search size={13} />
                <span className="font-medium text-slate-500">Search...</span>
                <kbd className="ml-1 px-1.5 py-0.5 text-[9px] font-bold bg-white border border-slate-200 rounded text-slate-400">⌘K</kbd>
              </button>
              <button type="button" onClick={() => setSearchOpen(true)}
                className="sm:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">
                <Search size={17} />
              </button>
              <NotificationsDropdown />
              <ProfileDropdown />
            </>
          )}

          {!isAuthenticated && (
            <div className="flex items-center gap-1.5">
              <Link to="/login" className="hidden xs:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors">
                <LogIn size={13} /> Sign In
              </Link>
              <Link to="/register" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors shadow-xs">
                <UserPlus size={13} /> Join Network
              </Link>
            </div>
          )}
        </div>
      </div>

      <SearchBar searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

      {/* Guest mobile menu */}
      {!isAuthenticated && (
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 top-14 bg-slate-900/20 z-30 md:hidden" />
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="absolute top-14 left-0 right-0 bg-white border-b border-slate-100 shadow-lg z-40 p-4 md:hidden">
                <div className="space-y-0.5 mb-4">
                  {GUEST_LINKS.map(({ label, href }) => (
                    <Link key={href} to={href} onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                      {label}
                    </Link>
                  ))}
                </div>
                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold border-2 border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50">
                    <LogIn size={14} /> Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors">
                    <UserPlus size={14} /> Join
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
