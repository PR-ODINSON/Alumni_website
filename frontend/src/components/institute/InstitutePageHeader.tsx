import { Link, useLocation } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { instituteNavItems } from '../../data/iitram';

interface InstitutePageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function InstitutePageHeader({ title, subtitle, badge = 'IITRAM Institutional Information' }: InstitutePageHeaderProps) {
  return (
    <header className="bg-white border border-slate-200 shadow-xs rounded-xl p-5 md:p-6 mb-4">
      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-2">
        <Building2 size={14} className="text-brand-500" aria-hidden="true" />
        <span>{badge}</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 tracking-tight leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mt-2.5 font-medium max-w-3xl">
          {subtitle}
        </p>
      )}
    </header>
  );
}

export function InstituteNav() {
  const location = useLocation();

  return (
    <nav aria-label="Institutional information" className="mb-6">
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        <Link
          to="/institute"
          className={`filter-pill shrink-0 ${location.pathname === '/institute' ? 'filter-pill-active' : ''}`}
        >
          Overview
        </Link>
        {instituteNavItems.map((item) => {
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`filter-pill shrink-0 ${isActive ? 'filter-pill-active' : ''}`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
