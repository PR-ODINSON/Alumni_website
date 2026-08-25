import { ExternalLink } from 'lucide-react';
import { InstitutePageHeader } from '../../components/institute/InstitutePageHeader';
import { OfficialSourceBadge, SourceAttribution } from '../../components/institute/OfficialSource';
import { usePageMeta } from '../../hooks/usePageMeta';
import { centersOfExcellence } from '../../data/iitram';

export default function CentersPage() {
  usePageMeta(
    'IITRAM Centers of Excellence',
    'Official Centres of Excellence at IITRAM — AI/ML, Drone Technology, Aerospace & Defence, Siemens, and SSDRI.',
  );

  return (
    <>
      <InstitutePageHeader
        title="Centers of Excellence"
        subtitle="State-of-the-art laboratories and facilities established with support from Government of Gujarat and industry"
      />

      <div className="mb-4">
        <OfficialSourceBadge />
      </div>

      <div className="space-y-4">
        {centersOfExcellence.map((center) => (
          <article key={center.id} className="card p-5 sm:p-6">
            <h2 className="text-sm font-bold text-slate-900">{center.name}</h2>
            {center.description && (
              <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">{center.description}</p>
            )}
            {center.focusAreas && (
              <div className="mt-3">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Focus Areas</h3>
                <div className="flex flex-wrap gap-1.5">
                  {center.focusAreas.map((area) => (
                    <span key={area} className="badge badge-primary text-[10px]">{area}</span>
                  ))}
                </div>
              </div>
            )}
            <a
              href={center.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 mt-4"
            >
              Official page <ExternalLink size={12} />
            </a>
            <SourceAttribution source={center.source} className="mt-3" />
          </article>
        ))}
      </div>
    </>
  );
}
