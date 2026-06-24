import { Link } from 'react-router-dom';
import { Award, Building, MapPin, Star } from 'lucide-react';
import Avatar from '../../../components/ui/Avatar';

export default function AlumniCard({ alumni }: { alumni: any }) {
  const user = alumni.user;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col justify-between hover:border-[#0169FC]/40 transition-all duration-200 group relative">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <Link to={`/alumni/${user?._id}`} className="flex items-center gap-2.5 min-w-0 flex-1">
            <Avatar
              src={user?.avatar}
              name={`${user?.firstName} ${user?.lastName}`}
              size="md"
              verified={alumni.verificationStatus === 'verified'}
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900 text-xs leading-snug group-hover:text-[#0169FC] transition-colors truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5 truncate">
                {alumni.currentDesignation || 'Alumni'}
              </p>
            </div>
          </Link>
          {alumni.isDistinguished && (
            <Award size={14} className="text-amber-500 flex-shrink-0 ml-1.5" />
          )}
        </div>

        {/* Current company */}
        {alumni.currentCompany && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1.5 font-medium">
            <Building size={11} className="flex-shrink-0 text-slate-400" />
            <span className="truncate">{alumni.currentCompany}</span>
          </div>
        )}

        {/* Location */}
        {user?.location?.city && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-450 mb-2.5 font-medium">
            <MapPin size={11} className="flex-shrink-0 text-slate-400" />
            <span className="truncate">{user.location.city}{user.location.country ? `, ${user.location.country}` : ''}</span>
          </div>
        )}

        {/* Batch & Dept */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          <span className="bg-blue-50/70 text-[#0169FC] border border-blue-100 text-[10px] px-2 py-0.5 rounded-full font-bold">
            {alumni.degreeType} {alumni.batch}
          </span>
          {alumni.isMentor && (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] px-2 py-0.5 rounded-full font-bold">
              Mentor
            </span>
          )}
        </div>

        {/* Skills */}
        {alumni.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3.5">
            {alumni.skills.slice(0, 3).map((skill: string) => (
              <span key={skill} className="text-[10px] px-1.5 py-0.5 bg-slate-50 text-slate-600 rounded-md border border-slate-200/60 font-semibold">
                {skill}
              </span>
            ))}
            {alumni.skills.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded-md border border-slate-200/60 font-semibold">
                +{alumni.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2.5 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
        <div className="flex-1">
          <Link
            to={`/alumni/${user?._id}`}
            className="w-full btn btn-outline py-1.5 text-center justify-center rounded-lg font-bold text-xs cursor-pointer bg-white"
          >
            View Profile
          </Link>
        </div>
        {alumni.isMentor && (
          <Link
            to={`/mentorship?mentor=${user?._id}`}
            className="btn btn-primary px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-xs flex items-center justify-center"
            title="Request Mentorship"
          >
            <Star size={12} className="fill-white" />
          </Link>
        )}
      </div>
    </div>
  );
}
