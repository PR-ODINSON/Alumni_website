import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export default function SearchBar({ searchOpen, setSearchOpen }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/directory?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setSearchOpen(!searchOpen)}
        aria-label="Search"
        className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <Search size={18} />
      </button>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-12 right-0 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white rounded-2xl shadow-soft-xl border border-slate-200 overflow-hidden z-40 p-3"
          >
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
              <Search size={15} className="text-slate-400 shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchSubmit();
                  if (e.key === 'Escape') setSearchOpen(false);
                }}
                placeholder="Search people, companies, skills..."
                className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 outline-none"
              />
              <kbd className="hidden sm:inline-block text-[10px] text-slate-400 bg-slate-200/70 px-1.5 py-0.5 rounded font-mono">ESC</kbd>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
