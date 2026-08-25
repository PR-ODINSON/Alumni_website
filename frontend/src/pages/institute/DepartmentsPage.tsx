import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { InstitutePageHeader } from '../../components/institute/InstitutePageHeader';
import { OfficialSourceBadge, SourceAttribution } from '../../components/institute/OfficialSource';
import { usePageMeta } from '../../hooks/usePageMeta';
import { departments } from '../../data/iitram';

export default function DepartmentsPage() {
  usePageMeta(
    'IITRAM Departments',
    'Official department directory at IITRAM — Basic Sciences, Civil Engineering, Electrical & Computer Science, HSS, and Mechanical & Aerospace.',
  );

  return (
    <>
      <InstitutePageHeader
        title="Departments"
        subtitle="Research and learning at IITRAM takes place across departments imbued with multidisciplinarity and interdisciplinarity."
      />

      <div className="mb-4">
        <OfficialSourceBadge />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map((dept) => (
          <article key={dept.id} className="card-hover p-5 flex flex-col">
            <h2 className="text-sm font-bold text-slate-900">{dept.name}</h2>
            {dept.description && (
              <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2 line-clamp-3">
                {dept.description}
              </p>
            )}
            {dept.disciplines && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {dept.disciplines.map((d) => (
                  <span key={d} className="badge badge-primary text-[10px]">{d}</span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100">
              <Link
                to={`/institute/departments/${dept.id}`}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
              >
                View details <ArrowRight size={12} />
              </Link>
              <a
                href={dept.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-slate-400 hover:text-slate-600 inline-flex items-center gap-1 ml-auto"
              >
                Official site <ExternalLink size={11} />
              </a>
            </div>
            <SourceAttribution source={dept.source} className="mt-3" />
          </article>
        ))}
      </div>
    </>
  );
}
