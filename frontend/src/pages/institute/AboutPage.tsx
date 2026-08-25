import { InstitutePageHeader } from '../../components/institute/InstitutePageHeader';
import { OfficialSourceBadge, SourceAttribution } from '../../components/institute/OfficialSource';
import { TimelineSection } from '../../components/institute/TimelineSection';
import { StatMetricGrid } from '../../components/institute/StatMetricGrid';
import { usePageMeta } from '../../hooks/usePageMeta';
import { institute, institutionalHistory, instituteStatistics } from '../../data/iitram';

export default function AboutPage() {
  usePageMeta(
    'About IITRAM',
    'Learn about IITRAM — Institute of Infrastructure, Technology, Research And Management. Vision, mission, and institutional background from official sources.',
  );

  return (
    <>
      <InstitutePageHeader
        title="About IITRAM"
        subtitle={institute.fullName}
      />

      <div className="space-y-6">
        <section className="card p-5 sm:p-6">
          <OfficialSourceBadge className="mb-4" />
          <h2 className="text-sm font-bold text-slate-900 mb-3">Institutional Overview</h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">{institute.about}</p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <dt className="font-bold text-slate-700">Status</dt>
              <dd className="text-slate-500 font-medium mt-0.5">{institute.status}</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-700">Legal Basis</dt>
              <dd className="text-slate-500 font-medium mt-0.5">{institute.legalBasis}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-bold text-slate-700">Academic Philosophy</dt>
              <dd className="text-slate-500 font-medium mt-0.5">{institute.academicPhilosophy}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-bold text-slate-700">Interdisciplinary Approach</dt>
              <dd className="text-slate-500 font-medium mt-0.5">{institute.interdisciplinaryApproach}</dd>
            </div>
          </dl>
          <SourceAttribution source={institute.source} className="mt-4" />
        </section>

        <section className="card p-5 sm:p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-3">Vision</h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">{institute.vision}</p>
          <SourceAttribution source={institute.source} className="mt-4" />
        </section>

        <section className="card p-5 sm:p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-3">Mission</h2>
          <ul className="space-y-2">
            {institute.mission.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-slate-600 font-medium leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <SourceAttribution source={institute.source} className="mt-4" />
        </section>

        <div className="card p-5 sm:p-6">
          <StatMetricGrid statistics={instituteStatistics} />
        </div>

        <div className="card p-5 sm:p-6">
          <TimelineSection events={institutionalHistory} />
        </div>
      </div>
    </>
  );
}
