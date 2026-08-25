import { Link } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';
import { InstitutePageHeader } from '../../components/institute/InstitutePageHeader';
import { OfficialSourceBadge } from '../../components/institute/OfficialSource';
import { usePageMeta } from '../../hooks/usePageMeta';
import { institute, instituteNavItems } from '../../data/iitram';

export default function InstituteIndexPage() {
  usePageMeta(
    'IITRAM Institutional Information',
    'Explore verified institutional information about IITRAM — academics, departments, research, campus life, and alumni relations.',
  );

  return (
    <>
      <InstitutePageHeader
        title="IITRAM Institutional Information"
        subtitle="Verified information from official IITRAM sources to help alumni understand their alma mater."
      />

      <div className="card p-5 sm:p-6 mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <OfficialSourceBadge />
        </div>
        <h2 className="text-lg font-bold font-display text-slate-900 mb-2">{institute.fullName}</h2>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">{institute.about}</p>
        <p className="text-[10px] text-slate-400 mt-3 font-medium italic">{institute.tagline}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {instituteNavItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="card-hover p-5 group flex flex-col"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4 group-hover:bg-brand-500 group-hover:border-brand-500 transition-colors">
              <Building2 size={16} className="text-slate-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">{item.label}</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed flex-1">{item.description}</p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 mt-4 group-hover:gap-2 transition-all">
              Explore <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
