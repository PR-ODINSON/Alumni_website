import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Briefcase } from 'lucide-react';
import Avatar from '../../../components/ui/Avatar';

export default function StudentCard({ student }: { student: any }) {
  const user = student.user || {};
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="h-full"
    >
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col justify-between hover:border-[#0169FC]/40 transition-all duration-200 group relative h-full">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <Link to={`/students/${user._id}`} className="flex items-center gap-2.5 min-w-0 flex-1">
              <Avatar
                src={user.avatar}
                initials={`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 text-xs leading-snug group-hover:text-[#0169FC] transition-colors truncate">
                  {fullName || 'IITRAM Student'}
                </p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5 truncate">
                  {student.degreeType} Student
                </p>
              </div>
            </Link>
          </div>

          {/* Department */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1.5 font-medium">
            <GraduationCap size={11} className="flex-shrink-0 text-slate-450" />
            <span className="truncate">{student.department}</span>
          </div>

          {/* Location */}
          {user.location?.city && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-450 mb-2.5 font-medium">
              <MapPin size={11} className="flex-shrink-0 text-slate-400" />
              <span className="truncate">{user.location.city}{user.location.country ? `, ${user.location.country}` : ''}</span>
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            <span className="bg-blue-50/70 text-[#0169FC] border border-blue-100 text-[10px] px-2 py-0.5 rounded-full font-bold">
              Batch {student.batch}
            </span>
            {student.openToWork && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] px-2 py-0.5 rounded-full font-bold">
                Open to Work
              </span>
            )}
            {student.seekingMentor && (
              <span className="bg-purple-50 text-purple-700 border border-purple-100 text-[10px] px-2 py-0.5 rounded-full font-bold">
                Seeking Mentor
              </span>
            )}
          </div>

          {/* Skills */}
          {student.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3.5">
              {student.skills.slice(0, 3).map((skill: string) => (
                <span key={skill} className="text-[10px] px-1.5 py-0.5 bg-slate-50 text-slate-600 rounded-md border border-slate-200/60 font-semibold">
                  {skill}
                </span>
              ))}
              {student.skills.length > 3 && (
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded-md border border-slate-200/60 font-semibold">
                  +{student.skills.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Bio snippet */}
          {user.bio && (
            <p className="text-[10px] text-slate-450 mt-2 line-clamp-2 leading-relaxed border-t border-slate-50 pt-2">{user.bio}</p>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex gap-2 pt-2.5 border-t border-slate-100 mt-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex-1">
            <Link
              to={`/students/${user._id}`}
              className="w-full btn btn-outline py-1.5 text-center justify-center rounded-lg font-bold text-xs cursor-pointer bg-white"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col justify-between h-[200px] animate-pulse">
      <div>
        <div className="flex gap-2.5 mb-3">
          <div className="skeleton w-8 h-8 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-2 w-14 rounded" />
          </div>
        </div>
        <div className="skeleton h-2.5 w-32 rounded mb-2" />
        <div className="flex gap-1">
          <div className="skeleton h-4 w-12 rounded-full" />
          <div className="skeleton h-4 w-12 rounded-full" />
        </div>
      </div>
      <div className="skeleton h-7 w-full rounded-lg mt-3" />
    </div>
  );
}
