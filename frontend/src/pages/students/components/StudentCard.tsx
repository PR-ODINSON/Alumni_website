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
      whileHover={{ y: -4, scale: 1.012, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
    >
      <Link to={`/students/${user._id}`} className="block group">
        <div className="card-hover p-5 flex items-start gap-4 h-full">
          <Avatar
            src={user.avatar}
            initials={`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-slate-900 group-hover:text-brand-500 transition-colors truncate text-sm">
                {fullName || 'IITRAM Student'}
              </h3>
              <div className="flex items-center gap-1 shrink-0 flex-wrap">
                {student.openToWork && (
                  <span className="badge badge-success text-2xs">Open to Work</span>
                )}
                {student.seekingMentor && (
                  <span className="badge badge-primary text-2xs">Seeking Mentor</span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <GraduationCap size={13} className="text-slate-400" />
              <span>{student.department} · Batch {student.batch}</span>
            </p>

            {user.location?.city && (
              <p className="text-2xs text-slate-400 mt-1 flex items-center gap-1">
                <MapPin size={11} className="text-slate-400" />
                {user.location.city}{user.location.country ? `, ${user.location.country}` : ''}
              </p>
            )}

            {student.currentRole && (
              <p className="text-2xs text-slate-500 mt-1 flex items-center gap-1">
                <Briefcase size={11} className="text-slate-400" />
                {student.currentRole}
              </p>
            )}

            {user.bio && (
              <p className="text-2xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{user.bio}</p>
            )}

            {student.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {student.skills.slice(0, 3).map((skill: string) => (
                  <span key={skill} className="badge bg-slate-100 text-slate-605 text-xs">{skill}</span>
                ))}
                {student.skills.length > 3 && (
                  <span className="badge bg-slate-100 text-slate-500 text-xs">+{student.skills.length - 3}</span>
                )}
              </div>
            )}

            {student.interests?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {student.interests.slice(0, 2).map((interest: string) => (
                  <span key={interest} className="badge bg-brand-50 text-brand-700 text-xs">{interest}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-5 flex items-start gap-4 animate-pulse">
      <div className="skeleton w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-36 rounded" />
        <div className="skeleton h-3 w-48 rounded" />
        <div className="skeleton h-3 w-32 rounded" />
        <div className="flex gap-1 mt-3">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-5 w-16 rounded-full" />)}
        </div>
      </div>
    </div>
  );
}
