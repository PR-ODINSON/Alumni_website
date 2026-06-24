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
      navigate(`/alumni?search=${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setSearchOpen(!searchOpen)}
        className="p-2.5 rounded-2xl text-slate-500 hover:bg-slate-100/60 backdrop-blur-sm transition-colors border border-transparent hover:border-white/50 cursor-pointer"
      >
        <Search size={18} />
      </button>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-[3.25rem] right-0 w-80 sm:w-96 bg-white/95 backdrop-blur-md border border-slate-100/80 rounded-2xl shadow-soft-xl overflow-hidden z-40 p-3"
          >
            <div className="flex items-center gap-2 bg-slate-100/60 border border-white/50 rounded-xl px-3 py-2 focus-within:border-brand-500/35 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
              <Search size={14} className="text-slate-400" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchSubmit();
                  if (e.key === 'Escape') setSearchOpen(false);
                }}
                placeholder="Search alumni, jobs, events..."
                className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none"
              />
              <kbd className="text-[9px] text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded font-mono">ESC</kbd>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
