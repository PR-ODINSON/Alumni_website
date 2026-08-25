import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InstitutePageHeader } from '../../components/institute/InstitutePageHeader';
import { OfficialSourceBadge, SourceAttribution } from '../../components/institute/OfficialSource';
import { usePageMeta } from '../../hooks/usePageMeta';
import { researchCategories, researchOverview } from '../../data/iitram';

export default function InstituteResearchPage() {
  usePageMeta(
    'IITRAM Research',
    'Official IITRAM research information — research areas, publications, facilities, collaborations, and funding.',
  );

  return (
    <>
      <InstitutePageHeader
        title="Research"
        subtitle="Institutional research at IITRAM"
      />

      <div className="card p-5 sm:p-6 mb-6">
        <OfficialSourceBadge className="mb-3" />
        <p className="text-xs text-slate-600 leading-relaxed font-medium">{researchOverview.summary}</p>
        <SourceAttribution source={researchOverview.source} className="mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {researchCategories.map((item) => (
          <article key={item.id} className="card p-5">
            <span className="badge badge-primary text-[10px] mb-2">{item.category}</span>
            <h2 className="text-sm font-bold text-slate-900">{item.title}</h2>
            {item.description && (
              <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">{item.description}</p>
            )}
            <a
              href={item.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 mt-3"
            >
              Learn more on IITRAM <ExternalLink size={12} />
            </a>
            <SourceAttribution source={item.source} className="mt-3" />
          </article>
        ))}
      </div>

      <p className="text-[10px] text-slate-400 font-medium mt-6 px-1">
        Note: The alumni platform&apos;s{' '}
        <Link to="/research" className="text-brand-600 hover:underline">Research Hub</Link>{' '}
        is a separate community feature for alumni research collaboration.
      </p>
    </>
  );
}
