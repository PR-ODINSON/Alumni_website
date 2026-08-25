import { InstitutePageHeader } from '../../components/institute/InstitutePageHeader';
import { OfficialSourceBadge, SourceAttribution } from '../../components/institute/OfficialSource';
import { usePageMeta } from '../../hooks/usePageMeta';
import { extracurricularActivities, studentLifeCategories, studentLifeOverview } from '../../data/iitram';

export default function StudentLifePage() {
  usePageMeta(
    'IITRAM Campus Life',
    'Student clubs and activities at IITRAM — sports, literary & cultural, and science & technology clubs.',
  );

  return (
    <>
      <InstitutePageHeader
        title="Student Life"
        subtitle="Student activities, clubs, and campus engagement"
      />

      <div className="card p-5 sm:p-6 mb-6">
        <OfficialSourceBadge className="mb-3" />
        <h2 className="text-sm font-bold text-slate-900 mb-2">{studentLifeOverview.title}</h2>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">{studentLifeOverview.description}</p>
        <p className="text-xs text-slate-500 leading-relaxed font-medium mt-3">
          {extracurricularActivities.description}
        </p>
        <SourceAttribution source={studentLifeOverview.source} className="mt-4" />
      </div>

      <div className="space-y-6">
        {Object.values(studentLifeCategories).map((category) => (
          <section key={category.label} className="card p-5 sm:p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-4">{category.label}</h2>
            <div className="flex flex-wrap gap-2">
              {category.clubs.map((club) => (
                <span key={club.id} className="badge badge-primary">{club.name}</span>
              ))}
            </div>
            <SourceAttribution source={category.clubs[0]?.source} className="mt-4" />
          </section>
        ))}
      </div>
    </>
  );
}
