import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Rocket, Users, DollarSign, Globe, ExternalLink } from 'lucide-react';

interface StartupCardProps {
  alumni: any;
}

export default function StartupCard({ alumni }: StartupCardProps) {
  const startup = alumni.startup || {};
  const user = alumni.user || {};
  const founderName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200"
    >
      {/* Startup Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center">
            {startup.logo ? (
              <img src={startup.logo} alt={startup.name} className="w-10 h-10 object-contain rounded-lg" />
            ) : (
              <Rocket size={22} className="text-slate-600" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 font-display text-sm truncate">{startup.name}</h3>
            <p className="text-2xs text-slate-500 truncate">{startup.sector} · {startup.founded ? startup.founded : 'Est.'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {startup.stage && (
            <span className={`badge text-2xs font-semibold ${
              startup.stage === 'Series A' || startup.stage === 'Series B+' || startup.stage === 'Acquired'
                ? 'badge-success bg-emerald-50 text-emerald-800 border-emerald-200'
                : startup.stage === 'Seed' || startup.stage === 'MVP'
                ? 'badge-warning bg-amber-50 text-amber-800 border-amber-200'
                : 'badge-primary bg-slate-50 text-slate-700 border-slate-200'
            }`}>
              {startup.stage}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {startup.description && (
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 min-h-[3.75rem] font-medium">{startup.description}</p>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-wide">
        {startup.teamSize && (
          <span className="flex items-center gap-1">
            <Users size={12} className="text-slate-400" /> {startup.teamSize} employees
          </span>
        )}
        {startup.valuation && (
          <span className="flex items-center gap-1">
            <DollarSign size={12} className="text-slate-400" /> {startup.valuation}
          </span>
        )}
        {startup.location && (
          <span className="flex items-center gap-1">
            <Globe size={12} className="text-slate-400" /> {startup.location}
          </span>
        )}
      </div>

      {/* Founder */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
            {founderName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate leading-tight">{founderName}</p>
            <p className="text-[9px] text-slate-400 truncate">Batch {alumni.batch} · {alumni.department}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {startup.website && (
            <a
              href={startup.website}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-700"
            >
              <ExternalLink size={13} />
            </a>
          )}
          <Link
            to={`/alumni/${alumni.user?._id}`}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
          >
            Profile →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
