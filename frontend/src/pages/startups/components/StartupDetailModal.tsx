import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Rocket, Users, DollarSign, Globe, ExternalLink, MapPin, Calendar, Briefcase, Award, ArrowUpRight } from 'lucide-react';
import { useEffect } from 'react';

interface StartupDetailModalProps {
  alumni: any | null;
  onClose: () => void;
}

export default function StartupDetailModal({ alumni, onClose }: StartupDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (alumni) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [alumni, onClose]);

  if (!alumni) return null;

  const startup = alumni.startup || {};
  const user = alumni.user || {};
  const founderName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'IITRAM Founder';

  const getStageBadgeStyle = (stage: string) => {
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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-10 my-auto"
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-br from-[#001f54] via-slate-900 to-brand-950 p-6 sm:p-8 text-white">
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl p-2 flex items-center justify-center shadow-lg shrink-0">
                {startup.logo ? (
                  <img src={startup.logo} alt={startup.name} className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <Rocket size={32} className="text-brand-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">{startup.name || 'Startup'}</h2>
                  {startup.stage && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStageBadgeStyle(startup.stage)}`}>
                      {startup.stage}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  {startup.sector || 'Technology'} {startup.founded ? `· Founded ${startup.founded}` : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About the Venture</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {startup.description || 'No description provided for this venture yet.'}
              </p>
            </div>

            {/* Key Metrics Grid (Only if available) */}
            {(startup.teamSize || startup.valuation || startup.location || startup.founded) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {startup.teamSize && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                      <Users size={12} className="text-brand-500" /> Team Size
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">{startup.teamSize} members</p>
                  </div>
                )}

                {startup.valuation && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                      <DollarSign size={12} className="text-brand-500" /> Valuation
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{startup.valuation}</p>
                  </div>
                )}

                {startup.location && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                      <MapPin size={12} className="text-brand-500" /> Location
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{startup.location}</p>
                  </div>
                )}

                {startup.founded && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                      <Calendar size={12} className="text-brand-500" /> Founded
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">{startup.founded}</p>
                  </div>
                )}
              </div>
            )}

            {/* Founder Highlight */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                {user.avatar ? (
                  <img src={user.avatar} alt={founderName} className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-xs shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
                    {founderName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                )}
                <div className="min-w-0">
                  <span className="inline-block text-[10px] font-bold text-brand-600 uppercase tracking-wider mb-0.5">IITRAM Alumni Founder</span>
                  <h4 className="font-bold text-slate-900 text-sm truncate">{founderName}</h4>
                  <p className="text-[11px] text-slate-500 font-semibold truncate">
                    {alumni.degreeType || 'B.Tech'} · {alumni.department || 'Engineering'} · Batch {alumni.batch || 'Alumnus'}
                  </p>
                </div>
              </div>

              <Link
                to={`/alumni/${user._id || alumni._id}`}
                onClick={onClose}
                className="btn btn-outline btn-sm font-bold text-xs shrink-0"
              >
                View Profile
              </Link>
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Award size={14} className="text-amber-500 shrink-0" />
              <span>Verified IITRAM Entrepreneur</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {startup.website && (
                <a
                  href={startup.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm flex-1 sm:flex-none font-bold text-xs shadow-xs"
                >
                  <Globe size={13} />
                  Visit Website
                  <ArrowUpRight size={13} />
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline btn-sm flex-1 sm:flex-none font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
