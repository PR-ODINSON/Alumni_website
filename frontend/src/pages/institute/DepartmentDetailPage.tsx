import { Link, useParams } from 'react-router-dom';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { InstitutePageHeader } from '../../components/institute/InstitutePageHeader';
import { OfficialSourceBadge, SourceAttribution } from '../../components/institute/OfficialSource';
import { usePageMeta } from '../../hooks/usePageMeta';
import { getDepartmentById } from '../../data/iitram';
import NotFoundPage from '../NotFound';

export default function DepartmentDetailPage() {
  const { departmentId } = useParams<{ departmentId: string }>();
  const department = departmentId ? getDepartmentById(departmentId) : undefined;

  usePageMeta(
    department ? `${department.name}` : 'Department Not Found',
    department?.description,
  );

  if (!department) return <NotFoundPage />;

  return (
    <>
      <Link
        to="/institute/departments"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 mb-4"
      >
        <ArrowLeft size={14} /> Back to Departments
      </Link>

      <InstitutePageHeader title={department.name} subtitle={department.shortName} />

      <div className="space-y-4">
        <section className="card p-5 sm:p-6">
          <OfficialSourceBadge className="mb-4" />
          {department.description && (
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{department.description}</p>
          )}
          <a
            href={department.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 mt-4"
          >
            View on IITRAM website <ExternalLink size={12} />
          </a>
          <SourceAttribution source={department.source} className="mt-4" />
        </section>

        {department.disciplines && (
          <section className="card p-5 sm:p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Disciplines</h2>
            <ul className="space-y-1">
              {department.disciplines.map((d) => (
                <li key={d} className="text-xs text-slate-600 font-medium">{d}</li>
              ))}
            </ul>
          </section>
        )}

        {department.programs && (
          <section className="card p-5 sm:p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Programs</h2>
            <ul className="space-y-1">
              {department.programs.map((p) => (
                <li key={p} className="text-xs text-slate-600 font-medium">{p}</li>
              ))}
            </ul>
          </section>
        )}

        {department.researchAreas && (
          <section className="card p-5 sm:p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Research Areas</h2>
            <ul className="space-y-2">
              {department.researchAreas.map((area) => (
                <li key={area} className="text-xs text-slate-600 font-medium leading-relaxed flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" aria-hidden="true" />
                  {area}
                </li>
              ))}
            </ul>
            <SourceAttribution source={department.source} className="mt-4" />
          </section>
        )}
      </div>
    </>
  );
}
