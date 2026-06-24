import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { DEPARTMENTS, INDUSTRIES } from '../../../lib/utils';

const EMPLOYMENT_STATUSES = ['employed', 'self-employed', 'entrepreneur', 'higher-studies', 'unemployed'];
const DEGREE_TYPES = ['B.Tech', 'M.Tech', 'MBA', 'PhD', 'Diploma'];
const CURRENT_YEAR = new Date().getFullYear();
const BATCHES = Array.from({ length: 15 }, (_, i) => CURRENT_YEAR - i);

interface AlumniFiltersProps {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  showFilters: boolean;
  activeFilterCount: number;
  clearFilters: () => void;
  setPage: (page: number) => void;
}

export default function AlumniFilters({
  filters,
  setFilters,
  showFilters,
  activeFilterCount,
  clearFilters,
  setPage,
}: AlumniFiltersProps) {
  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="pt-4 pb-2">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              <select
                value={filters.batch}
                onChange={(e) => { setFilters((f: any) => ({ ...f, batch: e.target.value })); setPage(1); }}
                className="input text-sm"
              >
                <option value="">All Batches</option>
                {BATCHES.map(y => <option key={y} value={y}>{y}</option>)}
              </select>

              <select
                value={filters.department}
                onChange={(e) => { setFilters((f: any) => ({ ...f, department: e.target.value })); setPage(1); }}
                className="input text-sm"
              >
                <option value="">All Depts.</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <select
                value={filters.industry}
                onChange={(e) => { setFilters((f: any) => ({ ...f, industry: e.target.value })); setPage(1); }}
                className="input text-sm"
              >
                <option value="">All Industries</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>

              <select
                value={filters.degreeType}
                onChange={(e) => { setFilters((f: any) => ({ ...f, degreeType: e.target.value })); setPage(1); }}
                className="input text-sm"
              >
                <option value="">All Degrees</option>
                {DEGREE_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <select
                value={filters.employmentStatus}
                onChange={(e) => { setFilters((f: any) => ({ ...f, employmentStatus: e.target.value })); setPage(1); }}
                className="input text-sm"
              >
                <option value="">All Status</option>
                {EMPLOYMENT_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>

              <input
                type="text"
                value={filters.location}
                onChange={(e) => { setFilters((f: any) => ({ ...f, location: e.target.value })); setPage(1); }}
                placeholder="Location..."
                className="input text-sm"
              />

              <label className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 cursor-pointer bg-white/60 hover:bg-white/80 transition-colors">
                <input
                  type="checkbox"
                  checked={filters.isMentor}
                  onChange={(e) => { setFilters((f: any) => ({ ...f, isMentor: e.target.checked })); setPage(1); }}
                  className="w-4 h-4 rounded border-slate-350 text-brand-600 focus:ring-brand-500 focus:outline-none"
                />
                <span className="text-sm text-slate-700">Mentors only</span>
              </label>
            </div>

            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 mt-3 text-sm text-red-500 hover:text-red-700 transition-colors">
                <X size={14} /> Clear all filters
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
