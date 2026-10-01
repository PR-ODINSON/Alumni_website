import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Users, Briefcase, Calendar, Lightbulb, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const QUICK_LINKS = [
  { icon: Users, label: 'Search Directory & Alumni', href: '/directory' },
  { icon: Briefcase, label: 'Explore Career Opportunities', href: '/jobs' },
  { icon: Calendar, label: 'Upcoming Campus & Alumni Events', href: '/events' },
  { icon: Lightbulb, label: 'Find Mentors & Guidance', href: '/mentorship' },
];

export default function SearchBar({ searchOpen, setSearchOpen }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery('');
    }
  }, [searchOpen]);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/directory?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleNavigate = (href: string) => {
    navigate(href);
    setSearchOpen(false);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Search Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-10"
          >
            {/* Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-white">
              <Search size={18} className="text-brand-600 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchSubmit();
                  if (e.key === 'Escape') setSearchOpen(false);
                }}
                placeholder="Search alumni, students, skills, companies..."
                className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors"
              >
                ESC
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="p-3 bg-slate-50/50">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                Quick Navigation
              </p>
              <div className="space-y-1">
                {QUICK_LINKS.map(link => (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => handleNavigate(link.href)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 hover:text-brand-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200/60 shadow-xs hover:shadow-xs group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <link.icon size={15} className="text-slate-400 group-hover:text-brand-600 transition-colors" />
                      <span>{link.label}</span>
                    </div>
                    <ArrowRight size={12} className="text-slate-300 group-hover:text-brand-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Footer tip */}
            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-400">
              <span>Press <strong className="text-slate-600 font-semibold">Enter ↵</strong> to search directory</span>
              <span><strong className="text-slate-600 font-semibold">Esc</strong> to dismiss</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
