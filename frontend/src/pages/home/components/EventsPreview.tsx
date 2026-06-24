import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { formatDate } from '../../../lib/utils';

interface EventsPreviewProps {
  events: any[];
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6 },
  },
};

export default function EventsPreview({ events }: EventsPreviewProps) {
  if (events.length === 0) return null;

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="badge badge-primary mb-3 text-[10px] font-bold">Upcoming</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 tracking-tight">
              Events &<br />Gatherings
            </h2>
          </div>
          <Link to="/events" className="btn btn-outline group shrink-0">
            View All Events
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {events.map((event: any, i: number) => (
            <motion.div
              key={event._id}
              variants={fadeUp}
              custom={i * 0.1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 rounded-xl overflow-hidden flex flex-col h-full transition-all duration-200"
            >
              <Link to={`/events/${event._id}`} className="flex flex-col h-full">
                <div className="relative h-32 overflow-hidden border-b border-slate-100 bg-slate-50">
                  {event.coverImage ? (
                    <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full bg-[#001f54] flex items-center justify-center">
                      <Calendar size={22} className="text-white/40" />
                    </div>
                  )}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="badge bg-white border border-slate-200 text-slate-700 capitalize text-[9px] font-bold shadow-sm">{event.eventType.replace('-', ' ')}</span>
                  </div>
                  {event.isVirtual && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="badge bg-emerald-600 text-white border-0 text-[9px] font-bold shadow-sm">Virtual</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex-1 flex flex-col justify-between gap-3 bg-white">
                  <h3 className="font-bold font-display text-slate-900 text-xs leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                      <Calendar size={12} className="text-slate-400" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    {event.city && (
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                        <MapPin size={12} className="text-slate-400" />
                        <span className="truncate">{event.city}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
