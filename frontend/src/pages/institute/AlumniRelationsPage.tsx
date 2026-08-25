import { ExternalLink } from 'lucide-react';
import { InstitutePageHeader } from '../../components/institute/InstitutePageHeader';
import { OfficialSourceBadge, SourceAttribution } from '../../components/institute/OfficialSource';
import { usePageMeta } from '../../hooks/usePageMeta';
import {
  alumniCommitteeMembers,
  alumniLeadership,
  alumniRelations,
  alumniStudentCoordinator,
  alumniStudentTeam,
} from '../../data/iitram';
import { contactInformation } from '../../data/iitram';

export default function AlumniRelationsPage() {
  usePageMeta(
    'IITRAM Alumni Relations',
    'Official Alumni Relations Office at IITRAM — connect with your alma mater, events, and alumni affairs coordinators.',
  );

  return (
    <>
      <InstitutePageHeader
        title="Alumni Relations"
        subtitle="Official alumni engagement with IITRAM Ahmedabad"
      />

      <div className="space-y-4">
        <section className="card p-5 sm:p-6">
          <OfficialSourceBadge className="mb-4" />
          <h2 className="text-sm font-bold text-slate-900 mb-2">Purpose</h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">{alumniRelations.purpose}</p>
          <h2 className="text-sm font-bold text-slate-900 mt-4 mb-2">Alumni Engagement</h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">{alumniRelations.engagement}</p>
          <h2 className="text-sm font-bold text-slate-900 mt-4 mb-2">Connection with the Institute</h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">{alumniRelations.connection}</p>
          <SourceAttribution source={alumniRelations.source} className="mt-4" />
          <a
            href="https://alumni.iitram.ac.in/about"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 mt-3"
          >
            Official Alumni Relations page <ExternalLink size={12} />
          </a>
        </section>

        <section className="card p-5 sm:p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Leadership & Coordinators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[...alumniLeadership, ...alumniCommitteeMembers, alumniStudentCoordinator].map((person) => (
              <div key={person.name} className="border border-slate-100 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-900">{person.name}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{person.designation}</p>
                {person.email && (
                  <a href={`mailto:${person.email}`} className="text-[10px] text-brand-600 hover:underline mt-1 block">
                    {person.email}
                  </a>
                )}
                {person.phone && (
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">{person.phone}</p>
                )}
              </div>
            ))}
          </div>
          <SourceAttribution source={alumniRelations.source} className="mt-4" />
        </section>

        <section className="card p-5 sm:p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Student Team — Alumni Relations</h2>
          <div className="flex flex-wrap gap-2">
            {alumniStudentTeam.map((name) => (
              <span key={name} className="badge badge-primary">{name}</span>
            ))}
          </div>
          <SourceAttribution source={alumniRelations.source} className="mt-4" />
        </section>

        <section className="card p-5 sm:p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Contact Information</h2>
          <dl className="space-y-3 text-xs">
            <div>
              <dt className="font-bold text-slate-700">Institute</dt>
              <dd className="text-slate-500 font-medium mt-0.5">{contactInformation.alumni.email}</dd>
              <dd className="text-slate-500 font-medium">{contactInformation.alumni.phones.join(' / ')}</dd>
            </div>
          </dl>
          <SourceAttribution source={contactInformation.alumni.source} className="mt-4" />
        </section>
      </div>
    </>
  );
}
