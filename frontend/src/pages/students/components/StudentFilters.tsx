import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const DEPARTMENTS = [
  'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering',
  'Computer Science', 'Chemical Engineering', 'Infrastructure Engineering',
  'Environmental Engineering', 'Architecture',
];

const YEARS = [2024, 2025, 2026, 2027, 2028];

interface StudentFiltersProps {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  filtersOpen: boolean;
  clearFilters: () => void;
  setPage: (page: number) => void;
  activeFilterCount: number;
}

export default function StudentFilters({
  filters,
  setFilters,
  filtersOpen,
  clearFilters,
  setPage,
  activeFilterCount,
}: StudentFiltersProps) {
  return (
    <AnimatePresence>
      {filtersOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Department</label>
              <select
                value={filters.department}
                onChange={e => { setFilters((f: any) => ({ ...f, department: e.target.value })); setPage(1); }}
                className="input text-sm"
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Batch Year</label>
              <select
                value={filters.batch}
                onChange={e => { setFilters((f: any) => ({ ...f, batch: e.target.value })); setPage(1); }}
                className="input text-sm"
              >
                <option value="">All Batches</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-3 justify-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.openToWork}
                  onChange={e => { setFilters((f: any) => ({ ...f, openToWork: e.target.checked })); setPage(1); }}
                  className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 focus:outline-none"
                />
                <span className="text-sm text-slate-700">Open to Work</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.seekingMentor}
                  onChange={e => { setFilters((f: any) => ({ ...f, seekingMentor: e.target.checked })); setPage(1); }}
                  className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 focus:outline-none"
                />
                <span className="text-sm text-slate-700">Seeking Mentor</span>
              </label>
            </div>
            <div className="flex items-end">
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="btn-ghost flex items-center gap-1 text-sm w-full justify-center text-slate-550 hover:text-red-500">
                  <X size={14} /> Clear Filters
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
