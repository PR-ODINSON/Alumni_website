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
    const fn = () => setScrolled(window.scrollY > 6);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
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
    <header
      className={`fixed top-0 left-0 right-0 z-40 h-16 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs'
          : 'bg-white border-b border-slate-200/70'
      }`}
    >
      <div className="h-full max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">

        {/* ── Left ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              aria-expanded={sidebarOpen}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors lg:hidden cursor-pointer"
            >
              <motion.div animate={{ rotate: sidebarOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.div>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center gap-2 shrink-0">
              <img
                src="/new/iitram cdr logo.png"
                alt="IITRAM Logo"
                className="w-9 h-9 object-contain transition-transform group-hover:scale-105"
              />
              <div className="h-6 w-px bg-slate-200" />
              <img
                src="/new/alumani.jpeg"
                alt="IITRAM Alumni Relations Logo"
                className="w-9 h-9 object-contain rounded-full transition-transform group-hover:scale-105"
              />
            </div>
            <div className="hidden xs:block pl-0.5">
              <span className="text-[15px] font-extrabold leading-none block tracking-tight font-display text-[#073F7C]">
                IITRAM
              </span>
              <span className="text-[10px] font-bold leading-none block mt-1 tracking-wider uppercase text-[#1597A2]">
                Alumni Relations
              </span>
            </div>
          </Link>
        </div>

        {/* ── Center — guest nav ─────────────────────────────────────── */}
        {!isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1">
            {GUEST_LINKS.map(({ label, href }) => {
              const active = location.pathname === href || location.pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  to={href}
                  className={`
                    relative px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-150
                    ${active ? 'text-[#1597A2] bg-[#DFF3F5]/60 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
                  `}
                >
                  {label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#1597A2]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        {/* ── Right ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated && (
            <>
              {/* Search — desktop pill */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg transition-all group cursor-pointer"
              >
                <Search size={13} className="text-slate-400 group-hover:text-[#1597A2] transition-colors" />
                <span className="font-medium text-slate-500">Search...</span>
                <kbd className="ml-1.5 px-1.5 py-0.5 text-[9px] font-semibold bg-white border border-slate-200 rounded text-slate-400">⌘K</kbd>
              </button>
              {/* Search — mobile icon */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="sm:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Search size={17} />
              </button>
              <NotificationsDropdown />
              <ProfileDropdown />
            </>
          )}

          {!isAuthenticated && (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="hidden xs:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
              >
                <LogIn size={13} className="text-[#1597A2]" /> Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white rounded-lg transition-all shadow-xs hover:shadow-md"
                style={{ background: 'linear-gradient(135deg, #1597A2 0%, #0B6169 100%)' }}
              >
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 top-16 bg-slate-900/20 z-30 md:hidden"
              />
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-xl z-40 p-4 md:hidden"
              >
                <div className="space-y-1 mb-4">
                  {GUEST_LINKS.map(({ label, href }) => (
                    <Link
                      key={href}
                      to={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <LogIn size={14} /> Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold text-white rounded-xl transition-colors"
                    style={{ background: 'linear-gradient(135deg, #1597A2 0%, #0B6169 100%)' }}
                  >
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
