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
      className="fixed top-0 left-0 right-0 z-40 h-14 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(223, 243, 245, 0.95)' : '#DFF3F5',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: '2px solid #D6DF8E',
        boxShadow: scrolled
          ? '0 2px 16px rgba(7, 63, 124, 0.10)'
          : '0 1px 6px rgba(21, 151, 162, 0.08)',
      }}
    >
      <div className="h-full max-w-[1440px] mx-auto px-4 sm:px-5 flex items-center justify-between gap-3">

        {/* ── Left ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2.5 shrink-0">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              aria-expanded={sidebarOpen}
              className="p-2 rounded-lg text-[#073F7C] hover:bg-white/60 transition-colors lg:hidden cursor-pointer"
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
              className="p-2 rounded-lg text-[#073F7C] hover:bg-white/60 transition-colors md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center gap-1.5 shrink-0 bg-white/90 px-2 py-1 rounded-full border border-[#1597A2]/25 shadow-2xs">
              <img
                src="/new/iitram cdr logo.png"
                alt="IITRAM Logo"
                className="w-8 h-8 object-contain transition-transform group-hover:scale-105"
              />
              <div className="h-5 w-[1px] bg-[#1597A2]/30" />
              <img
                src="/new/alumani.jpeg"
                alt="IITRAM Alumni Relations Logo"
                className="w-8 h-8 object-contain rounded-full transition-transform group-hover:scale-105"
              />
            </div>
            <div className="hidden xs:block">
              <span className="text-sm font-extrabold leading-none block tracking-tight font-display" style={{ color: '#073F7C' }}>
                IITRAM
              </span>
              <span
                className="text-[9px] font-extrabold leading-none inline-block mt-0.5 px-1.5 py-0.5 rounded tracking-wider uppercase"
                style={{ background: '#D6DF8E', color: '#000000' }}
              >
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
                    relative px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-150
                    ${active ? 'text-[#000000] shadow-2xs' : 'text-[#073F7C] hover:bg-white/70'}
                  `}
                  style={active ? { background: '#D6DF8E' } : undefined}
                >
                  {label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full"
                      style={{ background: '#1597A2' }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        {/* ── Right ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isAuthenticated && (
            <>
              {/* Search — desktop pill */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-[#073F7C] bg-white/85 hover:bg-white border border-[#1597A2]/30 rounded-lg transition-all group cursor-pointer"
              >
                <Search size={13} className="text-[#1597A2]" />
                <span className="font-semibold text-[#073F7C]">Search...</span>
                <kbd className="ml-1 px-1.5 py-0.5 text-[9px] font-bold bg-[#DFF3F5] border border-[#1597A2]/30 rounded text-[#073F7C]">⌘K</kbd>
              </button>
              {/* Search — mobile icon */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="sm:hidden p-2 rounded-lg text-[#073F7C] hover:bg-white/60 transition-colors cursor-pointer"
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
                className="hidden xs:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#073F7C] bg-white/80 hover:bg-white border border-[#1597A2]/30 rounded-lg transition-colors"
              >
                <LogIn size={13} className="text-[#1597A2]" /> Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold text-white rounded-lg transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5"
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
                className="fixed inset-0 top-14 bg-slate-900/20 z-30 md:hidden"
              />
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="absolute top-14 left-0 right-0 border-b border-[#1597A2]/30 shadow-xl z-40 p-4 md:hidden"
                style={{ background: '#DFF3F5' }}
              >
                <div className="space-y-1 mb-4">
                  {GUEST_LINKS.map(({ label, href }) => (
                    <Link
                      key={href}
                      to={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-3 py-2.5 rounded-xl text-sm font-bold text-[#073F7C] hover:bg-white/80 transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
                <div className="flex gap-2 pt-3 border-t border-[#1597A2]/20">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold bg-white border border-[#1597A2]/30 rounded-xl text-[#073F7C] transition-colors"
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
