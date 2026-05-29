import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Calendar, MapPin, Users, Clock, Globe, Video, Plus,
  Filter, Search, ChevronRight, Star, Ticket,
} from 'lucide-react';
import { eventApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { formatDate } from '../../lib/utils';

const EVENT_TYPES = ['reunion', 'alumni-meet', 'workshop', 'webinar', 'guest-lecture', 'conference', 'other'];

export default function EventsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ eventType: '', isVirtual: '' });
  const [upcoming, setUpcoming] = useState(true);
  const tab = searchParams.get('tab') || 'upcoming';

  const { data, isLoading } = useQuery({
    queryKey: ['events', search, filters, upcoming],
    queryFn: () => eventApi.getAll({
      search: search || undefined,
      upcoming: upcoming ? 'true' : undefined,
      ...filters,
      limit: 20,
    }),
  });

  const { data: myEventsData } = useQuery({
    queryKey: ['my-events'],
    queryFn: eventApi.getMyEvents,
    enabled: isAuthenticated,
  });

  const events = data?.data?.data || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="relative bg-slate-900 border-b border-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/events-hero.png" alt="Events" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 iitram-gradient opacity-90" />
          <div className="absolute inset-0 pattern-dots opacity-30 mix-blend-overlay" />
        </div>
        <div className="relative z-10 page-container py-12 md:py-16">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Events</h1>
              <p className="text-slate-300 text-lg">Alumni meets, workshops, webinars and more</p>
            </div>
            {isAuthenticated && (user?.role === 'alumni' || user?.role === 'faculty' || user?.role === 'admin') && (
              <Link to="/events/create" className="btn bg-white text-iitram-800 hover:bg-slate-100 font-semibold shrink-0">
                <Plus size={16} /> Create Event
              </Link>
            )}
          </div>

          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-60 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events..."
                className="input pl-10 h-11"
              />
            </div>
            <select
              value={filters.eventType}
              onChange={(e) => setFilters(f => ({ ...f, eventType: e.target.value }))}
              className="input h-11 w-44"
            >
              <option value="">All Types</option>
              {EVENT_TYPES.map(t => (
                <option key={t} value={t} className="capitalize">{t.replace('-', ' ')}</option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUpcoming(true)}
                className={upcoming ? 'filter-pill-active' : 'filter-pill'}
              >
                Upcoming
              </button>
              <button
                onClick={() => setUpcoming(false)}
                className={!upcoming ? 'filter-pill-active' : 'filter-pill'}
              >
                All Events
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        {/* Featured Event */}
        {events.filter((e: any) => e.isFeatured)[0] && (
          <FeaturedEvent event={events.filter((e: any) => e.isFeatured)[0]} />
        )}

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 skeleton rounded-t-2xl" />
                <div className="p-5 space-y-2">
                  <div className="h-5 skeleton rounded w-3/4" />
                  <div className="h-4 skeleton rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="card p-16 text-center">
            <Calendar size={40} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No events found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.filter((e: any) => !e.isFeatured).map((event: any, i: number) => (
              <EventCard key={event._id} event={event} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FeaturedEvent({ event }: { event: any }) {
  return (
    <Link to={`/events/${event._id}`} className="group block mb-8">
      <div className="relative h-64 rounded-2xl overflow-hidden">
        {event.coverImage ? (
          <img src={event.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-iitram-800 to-iitram-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-gold"><Star size={11} /> Featured</span>
            <span className="badge bg-white/20 text-white border-0 capitalize">{event.eventType.replace('-', ' ')}</span>
            {event.isVirtual && <span className="badge bg-teal-500/80 text-white border-0">Virtual</span>}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
          <div className="flex items-center gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDate(event.startDate)}</span>
            {event.city && <span className="flex items-center gap-1.5"><MapPin size={14} /> {event.city}</span>}
            <span className="flex items-center gap-1.5"><Users size={14} /> {event.registeredCount} registered</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function EventCard({ event, index }: { event: any; index: number }) {
  const eventTypeColors: Record<string, string> = {
    reunion: 'from-violet-700 to-purple-600',
    webinar: 'from-blue-700 to-iitram-600',
    workshop: 'from-accent-700 to-accent-600',
    'guest-lecture': 'from-amber-700 to-gold-600',
    conference: 'from-slate-700 to-slate-600',
  };

  const color = eventTypeColors[event.eventType] || 'from-iitram-700 to-iitram-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-hover overflow-hidden group"
    >
      {/* Cover */}
      <div className="relative h-48 overflow-hidden">
        {event.coverImage ? (
          <img src={event.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Calendar size={32} className="text-white/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="badge bg-white/90 text-slate-700 border-0 capitalize text-xs">{event.eventType.replace('-', ' ')}</span>
          {event.isVirtual && <span className="badge bg-teal-500 text-white border-0">Virtual</span>}
        </div>
        {event.isFree && (
          <div className="absolute top-3 right-3">
            <span className="badge badge-success">Free</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <Link to={`/events/${event._id}`} className="group/link">
          <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover/link:text-iitram-700 transition-colors">
            {event.title}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 line-clamp-2 mb-4">{event.shortDescription || event.description}</p>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar size={12} />
            <span>{formatDate(event.startDate, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          {event.city && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin size={12} />
              <span>{event.city}, {event.country}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Users size={12} />
            <span>{event.registeredCount} registered{event.maxAttendees ? ` / ${event.maxAttendees} max` : ''}</span>
          </div>
        </div>

        <Link to={`/events/${event._id}`} className="btn btn-primary btn-sm w-full justify-center">
          {event.isRegistrationOpen ? (
            <><Ticket size={14} /> Register Now</>
          ) : (
            <>View Details</>
          )}
        </Link>
      </div>
    </motion.div>
  );
}
