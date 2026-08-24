import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Rocket, Users, DollarSign, Globe, ExternalLink, MapPin, ArrowRight } from 'lucide-react';

interface StartupCardProps {
  alumni: any;
  onSelect?: (alumni: any) => void;
}

export default function StartupCard({ alumni, onSelect }: StartupCardProps) {
  const startup = alumni.startup || {};
  const user = alumni.user || {};
  const founderName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'IITRAM Founder';

  const getStageBadgeClass = (stage: string) => {
    switch (stage) {
      case 'Series A':
      case 'Series B+':
      case 'Acquired':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Seed':
      case 'MVP':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-50 text-brand-700 border-blue-200';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      onClick={() => onSelect?.(alumni)}
      className="bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-brand-500/50 hover:shadow-lg p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 group cursor-pointer relative"
    >
      <div>
        {/* Startup Header */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 flex items-center justify-center shrink-0 group-hover:border-brand-500/30 group-hover:bg-brand-50/50 transition-colors">
              {startup.logo ? (
                <img src={startup.logo} alt={startup.name} className="w-full h-full object-contain rounded-xl" />
              ) : (
                <Rocket size={22} className="text-brand-600 transition-transform group-hover:scale-110" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-900 font-display text-sm sm:text-base truncate group-hover:text-brand-600 transition-colors">
                {startup.name || 'Untitled Startup'}
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold truncate mt-0.5">
                {startup.sector || 'General Tech'} {startup.founded ? `· Est. ${startup.founded}` : ''}
              </p>
            </div>
          </div>
          {startup.stage && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${getStageBadgeClass(startup.stage)}`}>
              {startup.stage}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 min-h-[3.75rem] font-medium mb-4">
          {startup.description || 'Alumni venture transforming industry with innovative technology.'}
        </p>

        {/* Metrics Grid */}
        {(startup.teamSize || startup.valuation || startup.location) ? (
          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-600 mb-4 pt-3 border-t border-slate-100">
            {startup.teamSize && (
              <div className="flex items-center gap-1.5 truncate">
                <Users size={13} className="text-brand-600 shrink-0" />
                <span className="truncate">{startup.teamSize} team</span>
              </div>
            )}

            {startup.valuation && (
              <div className="flex items-center gap-1.5 truncate">
                <DollarSign size={13} className="text-brand-600 shrink-0" />
                <span className="truncate">{startup.valuation}</span>
              </div>
            )}

            {startup.location && (
              <div className="col-span-2 flex items-center gap-1.5 truncate text-slate-500">
                <MapPin size={13} className="shrink-0 text-slate-400" />
                <span className="truncate">{startup.location}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-4 pt-2" />
        )}
      </div>

      {/* Founder Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto bg-slate-50/50 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-2xl" onClick={e => e.stopPropagation()}>
        <Link
          to={`/alumni/${user._id || alumni._id}`}
          className="flex items-center gap-2.5 min-w-0 group/founder hover:opacity-90 transition-opacity"
        >
          {user.avatar ? (
            <img src={user.avatar} alt={founderName} className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-2xs shrink-0" />
          ) : (
            <div className="w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
              {founderName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-slate-900 truncate leading-tight group-hover/founder:text-brand-600 transition-colors">
                {founderName}
              </p>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-bold">Founder</span>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold truncate mt-0.5">
              Batch {alumni.batch || 'Alumnus'} · {alumni.department || 'Engineering'}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 shrink-0">
          {startup.website && (
            <a
              href={startup.website}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-slate-600 hover:text-brand-600 shadow-2xs"
              title="Visit Website"
            >
              <ExternalLink size={14} />
            </a>
          )}
          <button
            type="button"
            onClick={() => onSelect?.(alumni)}
            className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200/80 rounded-xl transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <span>Details</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
