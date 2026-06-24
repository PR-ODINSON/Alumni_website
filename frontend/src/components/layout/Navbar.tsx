import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';

// Subcomponents
import NotificationsDropdown from './Navbar/NotificationsDropdown';
import ProfileDropdown from './Navbar/ProfileDropdown';
import SearchBar from './Navbar/SearchBar';

export default function Navbar() {
  const { isAuthenticated } = useAuthStore();
  const { toggleSidebar, sidebarOpen } = useUIStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-35 h-16 bg-white border-b border-slate-200 shadow-sm">
      <div className="h-full px-4 flex items-center justify-between">
        
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-105 hover:text-slate-700 transition-colors lg:hidden cursor-pointer"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0169FC] flex items-center justify-center shadow-xs">
              <span className="text-white font-bold text-xs">IA</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-slate-800 text-xs font-display tracking-wide leading-none">IITRAM</span>
              <span className="block text-[9px] text-slate-400 font-semibold leading-none mt-0.5">Alumni Network</span>
            </div>
          </Link>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: 'Alumni', href: '/alumni' },
            { label: 'Jobs', href: '/jobs' },
            { label: 'Events', href: '/events' },
            { label: 'Stories', href: '/stories' },
            { label: 'Research', href: '/research' },
          ].map(({ label, href }) => {
            const isActive = location.pathname === href || location.pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                to={href}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#0169FC] bg-blue-50/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
            <div className="flex items-center gap-1.5">
              <Link to="/login" className="btn btn-ghost btn-sm text-xs font-bold">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm text-xs font-bold shadow-xs">Join Network</Link>
            </div>
          )}
        </div>
        
      </div>
    </header>
  );
}
