import { Link } from 'react-router-dom';
import { Award, Building, MapPin, Star } from 'lucide-react';
import Avatar from '../../../components/ui/Avatar';

export default function AlumniCard({ alumni }: { alumni: any }) {
  const user = alumni.user;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-4 sm:p-5 flex flex-col justify-between hover:border-brand-500/40 hover:shadow-md transition-all duration-200 group relative">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <Link to={`/alumni/${user?._id}`} className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar
              src={user?.avatar}
              name={`${user?.firstName || ''} ${user?.lastName || ''}`}
              size="md"
              verified={alumni.verificationStatus === 'verified'}
            />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-900 text-xs sm:text-sm leading-snug group-hover:text-brand-600 transition-colors truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5 truncate">
                {alumni.currentDesignation || 'Alumnus'}
              </p>
            </div>
          </Link>
          {alumni.isDistinguished && (
            <span title="Distinguished Alumni" className="shrink-0 mt-0.5">
              <Award size={15} className="text-amber-500" />
            </span>
          )}
        </div>

        {/* Current company */}
        {alumni.currentCompany && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1.5 font-medium">
            <Building size={12} className="shrink-0 text-slate-400" />
            <span className="truncate">{alumni.currentCompany}</span>
          </div>
        )}

        {/* Location */}
        {user?.location?.city && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2.5 font-medium">
            <MapPin size={12} className="shrink-0 text-slate-400" />
            <span className="truncate">{user.location.city}{user.location.country ? `, ${user.location.country}` : ''}</span>
          </div>
        )}

        {/* Batch & Dept */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          <span className="bg-brand-50 text-brand-700 border border-brand-200/60 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
            {alumni.degreeType || 'B.Tech'} · Batch {alumni.batch}
          </span>
          {alumni.isMentor && (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
              Mentor
            </span>
          )}
        </div>

        {/* Skills */}
        {alumni.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {alumni.skills.slice(0, 3).map((skill: string) => (
              <span key={skill} className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md border border-slate-200 font-semibold">
                {skill}
              </span>
            ))}
            {alumni.skills.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded-md border border-slate-200 font-semibold">
                +{alumni.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-slate-100 mt-auto" onClick={(e) => e.stopPropagation()}>
        <Link
          to={`/alumni/${user?._id}`}
          className="btn btn-outline btn-sm flex-1 font-bold text-xs"
        >
          View Profile
        </Link>
        {alumni.isMentor && (
          <Link
            to={`/mentorship?mentor=${user?._id}`}
            className="btn btn-primary btn-sm px-3 shadow-xs"
            title="Request Mentorship"
          >
            <Star size={13} className="fill-white" />
          </Link>
        )}
      </div>
    </div>
  );
}
