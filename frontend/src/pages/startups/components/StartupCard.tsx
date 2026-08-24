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
        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 mb-4 pt-3 border-t border-slate-100">
          {startup.teamSize ? (
            <div className="flex items-center gap-1.5 truncate">
              <Users size={12} className="text-brand-500 shrink-0" />
              <span className="truncate">{startup.teamSize} team</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-400">
              <Users size={12} className="shrink-0" />
              <span>Growing</span>
            </div>
          )}

          {startup.valuation ? (
            <div className="flex items-center gap-1.5 truncate">
              <DollarSign size={12} className="text-brand-500 shrink-0" />
              <span className="truncate">{startup.valuation}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-400">
              <DollarSign size={12} className="shrink-0" />
              <span>Bootstrapped</span>
            </div>
          )}

          {startup.location && (
            <div className="col-span-2 flex items-center gap-1.5 truncate text-slate-400">
              <MapPin size={12} className="shrink-0 text-slate-400" />
              <span className="truncate">{startup.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Founder Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto" onClick={e => e.stopPropagation()}>
        <Link
          to={`/alumni/${user._id || alumni._id}`}
          className="flex items-center gap-2.5 min-w-0 group/founder hover:opacity-85 transition-opacity"
        >
          {user.avatar ? (
            <img src={user.avatar} alt={founderName} className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 shrink-0" />
          ) : (
            <div className="w-7 h-7 bg-brand-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
              {founderName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate leading-tight group-hover/founder:text-brand-600 transition-colors">
              {founderName}
            </p>
            <p className="text-[9px] text-slate-400 font-semibold truncate">
              Batch {alumni.batch || 'N/A'} · {alumni.department || 'IITRAM'}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 shrink-0">
          {startup.website && (
            <a
              href={startup.website}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-brand-600"
              title="Visit Website"
            >
              <ExternalLink size={14} />
            </a>
          )}
          <button
            type="button"
            onClick={() => onSelect?.(alumni)}
            className="p-1.5 hover:bg-brand-50 text-brand-600 rounded-lg transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Details</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
