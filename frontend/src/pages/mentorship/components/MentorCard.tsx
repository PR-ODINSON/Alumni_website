import { Link } from 'react-router-dom';
import { GraduationCap, Star } from 'lucide-react';
import Avatar from '../../../components/ui/Avatar';

export default function MentorCard({ mentor, onRequest }: { mentor: any; index: number; onRequest: (m: any) => void }) {
  const user = mentor.user;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col justify-between hover:border-[#0169FC]/40 transition-all duration-200 group relative font-sans text-slate-800">
      <div>
        {/* Header */}
        <div className="flex items-start gap-3 mb-3.5">
          <Link to={`/alumni/${user?._id}`}>
            <Avatar src={user?.avatar} name={`${user?.firstName} ${user?.lastName}`} size="md" verified />
          </Link>
          <div className="flex-1 min-w-0">
            <Link to={`/alumni/${user?._id}`} className="font-bold text-slate-900 group-hover:text-[#0169FC] transition-colors text-xs hover:underline block truncate">
              {user?.firstName} {user?.lastName}
            </Link>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5 truncate">{mentor.currentDesignation} at {mentor.currentCompany}</p>
            <div className="flex items-center gap-1.5 mt-1 font-semibold text-slate-400">
              <GraduationCap size={12} className="text-slate-400 flex-shrink-0" />
              <span className="text-[10px] truncate">{mentor.department} · Batch {mentor.batch}</span>
            </div>
          </div>
        </div>

        {/* Mentor areas / Skills */}
        {mentor.mentorAreas?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {mentor.mentorAreas.slice(0, 4).map((area: string) => (
              <span key={area} className="text-[10px] px-2 py-0.5 bg-blue-50/70 text-[#0169FC] rounded-md border border-blue-100 font-bold">
                {area}
              </span>
            ))}
          </div>
        )}
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        {/* Availability details */}
        <div className="flex items-center justify-between mb-3 text-[11px] text-slate-500 font-semibold border-t border-slate-100 pt-3">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border ${
            mentor.mentorAvailability === 'available'
              ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
              : 'text-amber-700 bg-amber-50 border-amber-100'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${mentor.mentorAvailability === 'available' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
            {mentor.mentorAvailability === 'available' ? 'Available' : 'Limited'}
          </span>
          <span className="text-slate-450 font-bold">Max {mentor.maxMentees} mentees</span>
        </div>

        {/* Request button */}
        <button
          onClick={() => onRequest(mentor)}
          className="w-full btn btn-primary py-2 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#0158d3] transition-colors"
        >
          <Star size={13} className="fill-white" /> Request Mentorship
        </button>
      </div>
    </div>
  );
}
