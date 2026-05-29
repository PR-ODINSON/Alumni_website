import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Calendar, MapPin, Users, Clock, Video, Ticket, CheckCircle,
  ChevronLeft, Globe, Star, Share2, ExternalLink, BookOpen,
} from 'lucide-react';
import { eventApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventApi.getEvent(eventId!),
  });

  const registerMutation = useMutation({
    mutationFn: () => eventApi.register(eventId!),
    onSuccess: (res) => {
      toast.success(res.data.message || 'Registered successfully!');
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Registration failed'),
  });

  const cancelMutation = useMutation({
    mutationFn: () => eventApi.cancelRegistration(eventId!),
    onSuccess: () => {
      toast.success('Registration cancelled');
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
    onError: () => toast.error('Failed to cancel registration'),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-64 skeleton rounded-2xl mb-6" />
        <div className="card p-8 space-y-4">
          <div className="h-8 skeleton rounded w-1/2" />
          <div className="h-4 skeleton rounded w-1/3" />
        </div>
      </div>
    );
  }

  const event = data?.data?.data;
  if (!event) return <div className="text-center py-24 text-slate-400">Event not found</div>;

  const isRegistered = event.registrations?.some((r: any) => r.user === user?._id || r.user?._id === user?._id);
  const isFull = event.maxAttendees && event.registeredCount >= event.maxAttendees;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/events" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ChevronLeft size={16} /> Back to Events
        </Link>

        {/* Cover */}
        <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-6">
          {event.coverImage ? (
            <img src={event.coverImage} className="w-full h-full object-cover" alt="" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-iitram-800 to-iitram-600" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex gap-2 mb-3 flex-wrap">
              <span className="badge bg-white/20 text-white border-0 capitalize">{event.eventType.replace('-', ' ')}</span>
              {event.isVirtual && <span className="badge bg-teal-500 text-white border-0">Virtual</span>}
              {event.isFeatured && <span className="badge badge-gold"><Star size={11} /> Featured</span>}
              {event.isFree && <span className="badge badge-success">Free</span>}
            </div>
            <h1 className="text-3xl font-bold text-white">{event.title}</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick info */}
            <div className="card p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Date</p>
                  <p className="font-semibold text-slate-900 text-sm">{formatDate(event.startDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Time</p>
                  <p className="font-semibold text-slate-900 text-sm">
                    {new Date(event.startDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Location</p>
                  <p className="font-semibold text-slate-900 text-sm">
                    {event.isVirtual ? 'Online' : event.city || 'TBD'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Registered</p>
                  <p className="font-semibold text-slate-900 text-sm">
                    {event.registeredCount}{event.maxAttendees ? `/${event.maxAttendees}` : ''} attendees
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="font-bold text-slate-900 text-lg mb-4">About This Event</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>

            {/* Schedule */}
            {event.schedule?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-bold text-slate-900 text-lg mb-5">Schedule</h2>
                <div className="space-y-4">
                  {event.schedule.map((item: any, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-16 text-sm font-semibold text-iitram-700 flex-shrink-0">{item.time}</div>
                      <div className="flex-1 pb-4 border-b border-slate-100 last:border-0">
                        <p className="font-medium text-slate-900 text-sm">{item.title}</p>
                        {item.speaker && <p className="text-xs text-slate-500 mt-0.5">by {item.speaker}</p>}
                        {item.description && <p className="text-xs text-slate-400 mt-1">{item.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers */}
            {event.speakers?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-bold text-slate-900 text-lg mb-5">Speakers</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {event.speakers.map((speaker: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                      {speaker.photo ? (
                        <img src={speaker.photo} className="w-12 h-12 rounded-full object-cover" alt="" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-iitram-100 flex items-center justify-center text-iitram-700 font-semibold">
                          {speaker.name?.[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{speaker.name}</p>
                        <p className="text-xs text-slate-500">{speaker.designation}</p>
                        <p className="text-xs text-slate-400">{speaker.organization}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {event.gallery?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-bold text-slate-900 text-lg mb-4">Gallery</h2>
                <div className="grid grid-cols-3 gap-2">
                  {event.gallery.map((img: any, i: number) => (
                    <img key={i} src={img.url} className="w-full h-24 object-cover rounded-xl" alt={img.caption} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="card p-5 sticky top-20">
              {/* Progress */}
              {event.maxAttendees && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>{event.registeredCount} registered</span>
                    <span>{event.maxAttendees - event.registeredCount} spots left</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-iitram-600 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (event.registeredCount / event.maxAttendees) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {!event.isFree && event.fee && (
                <div className="text-center py-3 mb-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400">Registration Fee</p>
                  <p className="text-2xl font-bold text-slate-900 mt-0.5">₹{event.fee}</p>
                </div>
              )}

              {isAuthenticated ? (
                <>
                  {isRegistered ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 py-3 bg-emerald-50 rounded-xl text-emerald-700 text-sm font-medium">
                        <CheckCircle size={16} /> You're Registered
                      </div>
                      {event.isVirtual && event.virtualLink && (
                        <a href={event.virtualLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full justify-center">
                          <Video size={15} /> Join Meeting
                        </a>
                      )}
                      <button onClick={() => cancelMutation.mutate()} className="btn btn-outline w-full justify-center text-red-600 border-red-200 hover:bg-red-50">
                        Cancel Registration
                      </button>
                    </div>
                  ) : event.isRegistrationOpen && !isFull ? (
                    <button
                      onClick={() => registerMutation.mutate()}
                      disabled={registerMutation.isPending}
                      className="btn btn-primary w-full justify-center"
                    >
                      <Ticket size={15} /> Register Now
                    </button>
                  ) : (
                    <div className="text-center py-3 text-sm text-slate-500 bg-slate-50 rounded-xl">
                      {isFull ? 'Event is full' : 'Registration closed'}
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login" className="btn btn-primary w-full justify-center">
                  Sign In to Register
                </Link>
              )}

              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 text-center">
                  {event.hasCertificate ? '✓ Certificate provided' : 'No certificate'}
                </p>
              </div>
            </div>

            {/* Organizer */}
            <div className="card p-5">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Organized By</p>
              <div className="flex items-center gap-3">
                <img
                  src={event.organizer?.avatar || `https://ui-avatars.com/api/?name=${event.organizer?.firstName}&background=1d2f88&color=fff`}
                  className="w-10 h-10 rounded-full object-cover"
                  alt=""
                />
                <div>
                  <p className="font-medium text-slate-900 text-sm">{event.organizer?.firstName} {event.organizer?.lastName}</p>
                  <p className="text-xs text-slate-400 capitalize">{event.organizer?.role}</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {event.tags?.length > 0 && (
              <div className="card p-5">
                <div className="flex flex-wrap gap-1.5">
                  {event.tags.map((tag: string) => (
                    <span key={tag} className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">#{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
