import { InstitutePageHeader } from '../../components/institute/InstitutePageHeader';
import { OfficialSourceBadge, SourceAttribution } from '../../components/institute/OfficialSource';
import { usePageMeta } from '../../hooks/usePageMeta';
import { academicPrograms, institute } from '../../data/iitram';

const levelLabels = {
  undergraduate: 'Undergraduate',
  postgraduate: 'Postgraduate',
  doctoral: 'Doctoral',
  addon: 'Add-on Programs',
} as const;

export default function AcademicsPage() {
  usePageMeta(
    'IITRAM Academics',
    'Official academic programs at IITRAM — B.Tech., M.Tech., Ph.D., honours, minors, and micro-specializations.',
  );

  const grouped = {
    undergraduate: academicPrograms.filter((p) => p.level === 'undergraduate'),
    postgraduate: academicPrograms.filter((p) => p.level === 'postgraduate'),
    doctoral: academicPrograms.filter((p) => p.level === 'doctoral'),
    addon: academicPrograms.filter((p) => p.level === 'addon'),
  };

  return (
    <>
      <InstitutePageHeader
        title="Academics"
        subtitle="Academic programs and offerings at IITRAM"
      />

      <div className="card p-5 sm:p-6 mb-6">
        <OfficialSourceBadge className="mb-3" />
        <p className="text-xs text-slate-600 leading-relaxed font-medium">{institute.academicPhilosophy}</p>
        <p className="text-xs text-slate-500 leading-relaxed font-medium mt-3">{institute.teachingMethodology}</p>
        <p className="text-xs text-slate-500 leading-relaxed font-medium mt-2">{institute.neepAlignment}</p>
      </div>

      <div className="space-y-6">
        {(Object.keys(grouped) as Array<keyof typeof grouped>).map((level) => (
          <section key={level} className="card p-5 sm:p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-4">{levelLabels[level]}</h2>
            <div className="space-y-4">
              {grouped[level].map((program) => (
                <article key={program.id} className="border border-slate-100 rounded-xl p-4">
                  <h3 className="text-xs font-bold text-slate-900">{program.name}</h3>
                  {program.disciplines && (
                    <ul className="mt-2 space-y-1">
                      {program.disciplines.map((d) => (
                        <li key={d} className="text-xs text-slate-500 font-medium flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-brand-400" aria-hidden="true" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                  {program.admissionInfo && (
                    <p className="text-[10px] text-slate-400 font-medium mt-2 leading-relaxed">
                      {program.admissionInfo}
                    </p>
                  )}
                  <SourceAttribution source={program.source} className="mt-3" />
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
