import { ExternalLink } from 'lucide-react';
import { InstitutePageHeader } from '../../components/institute/InstitutePageHeader';
import { OfficialSourceBadge, SourceAttribution } from '../../components/institute/OfficialSource';
import { usePageMeta } from '../../hooks/usePageMeta';
import { campusConnectivity, campusFacilities, workingHours } from '../../data/iitram';
import { institute } from '../../data/iitram';

export default function CampusPage() {
  usePageMeta(
    'IITRAM Campus & Facilities',
    'Official campus facilities at IITRAM — hostel, library, laboratories, medical, sports, and more.',
  );

  return (
    <>
      <InstitutePageHeader
        title="Campus & Facilities"
        subtitle={institute.location.address}
      />

      <div className="mb-4">
        <OfficialSourceBadge />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {campusFacilities.map((facility) => (
          <article key={facility.id} className="card p-5">
            <h2 className="text-sm font-bold text-slate-900">{facility.name}</h2>
            {facility.description && (
              <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">{facility.description}</p>
            )}
            {facility.officialUrl && (
              <a
                href={facility.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 mt-3"
              >
                Official page <ExternalLink size={12} />
              </a>
            )}
            <SourceAttribution source={facility.source} className="mt-3" />
          </article>
        ))}
      </div>

      <section className="card p-5 sm:p-6 mb-4">
        <h2 className="text-sm font-bold text-slate-900 mb-4">How to Reach IITRAM</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 font-bold text-slate-700">Connecting Point</th>
                <th className="text-left py-2 font-bold text-slate-700">Distance</th>
              </tr>
            </thead>
            <tbody>
              {campusConnectivity.map((row) => (
                <tr key={row.point} className="border-b border-slate-50">
                  <td className="py-2 text-slate-600 font-medium">{row.point}</td>
                  <td className="py-2 text-slate-500 font-medium">{row.distance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="text-sm font-bold text-slate-900 mb-3">Working Hours</h2>
        <ul className="space-y-1 text-xs text-slate-600 font-medium">
          <li>{workingHours.weekdays}</li>
          <li>{workingHours.lunchBreak}</li>
          <li>{workingHours.weekends}</li>
        </ul>
        <SourceAttribution source={workingHours.source} className="mt-4" />
      </section>
    </>
  );
}
