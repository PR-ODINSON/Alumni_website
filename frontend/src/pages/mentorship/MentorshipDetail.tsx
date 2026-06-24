import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Calendar, Clock, User, CheckCircle, XCircle, Plus, Loader2,
  ChevronLeft, Star, MessageSquare, Video, Globe, Play, Check, AlertCircle
} from 'lucide-react';
import { mentorshipApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { formatDate } from '../../lib/utils';
import Avatar from '../../components/ui/Avatar';
import toast from 'react-hot-toast';

export default function MentorshipDetailPage() {
  const { mentorshipId } = useParams<{ mentorshipId: string }>();
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [sessionForm, setSessionForm] = useState({
    scheduledAt: '',
    duration: 60,
    platform: 'google-meet',
    meetingLink: '',
  });

  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    comment: '',
    wouldRecommend: true,
  });

  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['mentorship', mentorshipId],
    queryFn: () => mentorshipApi.getOne(mentorshipId!),
    enabled: !!mentorshipId,
  });

  const respondMutation = useMutation({
    mutationFn: (action: 'accept' | 'reject') =>
      mentorshipApi.respond(mentorshipId!, { action }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorship', mentorshipId] });
      toast.success('Mentorship request updated.');
    },
    onError: () => toast.error('Failed to respond to request.'),
  });

  const scheduleMutation = useMutation({
    mutationFn: (data: any) => mentorshipApi.scheduleSession(mentorshipId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorship', mentorshipId] });
      setShowScheduleForm(false);
      setSessionForm({ scheduledAt: '', duration: 60, platform: 'google-meet', meetingLink: '' });
      toast.success('Session scheduled successfully.');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to schedule session.'),
  });

  const completeSessionMutation = useMutation({
    mutationFn: (sessionId: string) =>
      mentorshipApi.updateSession(mentorshipId!, sessionId, { status: 'completed' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorship', mentorshipId] });
      toast.success('Session marked as completed.');
    },
    onError: () => toast.error('Failed to update session.'),
  });

  const cancelSessionMutation = useMutation({
    mutationFn: (sessionId: string) =>
      mentorshipApi.updateSession(mentorshipId!, sessionId, { status: 'cancelled' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorship', mentorshipId] });
      toast.success('Session cancelled.');
    },
    onError: () => toast.error('Failed to cancel session.'),
  });

  const completeMentorshipMutation = useMutation({
    mutationFn: () => mentorshipApi.complete(mentorshipId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorship', mentorshipId] });
      toast.success('Mentorship program completed successfully!');
    },
    onError: () => toast.error('Failed to complete mentorship.'),
  });

  const feedbackMutation = useMutation({
    mutationFn: (data: any) => mentorshipApi.submitFeedback(mentorshipId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorship', mentorshipId] });
      toast.success('Feedback submitted. Thank you!');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to submit feedback.'),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center items-center">
        <Loader2 className="animate-spin text-[#0169FC]" size={36} />
      </div>
    );
  }

  if (isError || !data?.data?.success) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-slate-500 font-sans">
        <AlertCircle size={40} className="mx-auto text-red-400 mb-2 animate-bounce" />
        <p className="font-bold text-slate-700">Mentorship session not found or access denied.</p>
        <Link to="/mentorship" className="btn btn-secondary btn-sm mt-4 inline-flex items-center gap-1">
          <ChevronLeft size={14} /> Back to Mentorships
        </Link>
      </div>
    );
  }

  const mentorship = data.data.data;
  const isMentor = mentorship.mentor?._id === currentUser?._id;
  const otherUser = isMentor ? mentorship.mentee : mentorship.mentor;
  const hasSubmittedFeedback = mentorship.finalFeedback?.fromMentee?.submittedAt;

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionForm.scheduledAt || !sessionForm.meetingLink) {
      toast.error('Please enter date/time and meeting link.');
      return;
    }
    scheduleMutation.mutate({
      scheduledAt: new Date(sessionForm.scheduledAt).toISOString(),
      duration: Number(sessionForm.duration),
      platform: sessionForm.platform,
      meetingLink: sessionForm.meetingLink,
    });
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    feedbackMutation.mutate(feedbackForm);
  };

  const statusStyles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    completed: 'bg-slate-100 text-slate-600 border-slate-200',
    rejected: 'bg-red-150 text-red-800 border-red-200',
    cancelled: 'bg-slate-150 text-slate-500 border-slate-200',
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Back navigation */}
        <Link to="/mentorship" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors font-semibold">
          <ChevronLeft size={16} /> Back to Mentorship Hub
        </Link>

        {/* Top Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-center flex-shrink-0 text-[#0169FC]">
              <User size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Mentorship Program</h1>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                Connecting {isMentor ? 'you' : mentorship.mentor?.firstName} with {isMentor ? mentorship.mentee?.firstName : 'you'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`badge border capitalize font-bold text-xs px-3 py-1 rounded-full ${statusStyles[mentorship.status]}`}>
              {mentorship.status}
            </span>
            {mentorship.status === 'active' && isMentor && (
              <button
                onClick={() => completeMentorshipMutation.mutate()}
                className="btn btn-primary btn-sm rounded-lg text-xs font-bold py-1.5 px-3"
              >
                Complete Mentorship
              </button>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Left 2 Columns: Mentorship Details and Session Timeline */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Overview / Goals */}
            <div className="card p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <h3 className="text-xs font-bold text-[#0169FC] uppercase tracking-wider mb-4">Program Goals</h3>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl mb-4">
                <p className="text-sm text-slate-705 leading-relaxed font-semibold italic">
                  "{mentorship.goals}"
                </p>
              </div>
              <div className="mb-4">
                <p className="text-xs text-slate-400 font-bold mb-1.5">Request Message</p>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {mentorship.message || 'No additional message provided.'}
                </p>
              </div>
              {mentorship.areas?.length > 0 && (
                <div>
                  <p className="text-xs text-slate-400 font-bold mb-1.5 font-sans">Focus Areas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {mentorship.areas.map((area: string) => (
                      <span key={area} className="text-xs font-bold px-2.5 py-0.5 bg-blue-50/70 border border-blue-100 text-[#0169FC] rounded-md">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pending actions for Mentor */}
            {mentorship.status === 'pending' && isMentor && (
              <div className="card p-6 border-2 border-[#0169FC]/20 bg-blue-50/20 rounded-2xl">
                <h4 className="font-bold text-slate-900 mb-2">Pending Request Response</h4>
                <p className="text-xs text-slate-500 font-semibold mb-4 leading-relaxed">
                  Review the student's details, focus areas, and goals before responding.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => respondMutation.mutate('accept')}
                    disabled={respondMutation.isPending}
                    className="btn btn-primary text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1 shadow-sm flex-1 justify-center"
                  >
                    <CheckCircle size={14} /> Accept Request
                  </button>
                  <button
                    onClick={() => respondMutation.mutate('reject')}
                    disabled={respondMutation.isPending}
                    className="btn btn-danger text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1 border-red-200 flex-1 justify-center"
                  >
                    <XCircle size={14} /> Decline Request
                  </button>
                </div>
              </div>
            )}

            {/* Session Timeline */}
            {mentorship.status !== 'pending' && (
              <div className="card p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-[#0169FC] uppercase tracking-wider">Scheduled Sessions</h3>
                  {mentorship.status === 'active' && isMentor && !showScheduleForm && (
                    <button
                      onClick={() => setShowScheduleForm(true)}
                      className="btn btn-primary btn-sm flex items-center gap-1 rounded-lg py-1.5 px-3 text-xs font-bold"
                    >
                      <Plus size={13} /> Schedule Session
                    </button>
                  )}
                </div>

                {/* Schedule form */}
                {showScheduleForm && (
                  <form onSubmit={handleScheduleSubmit} className="mb-6 p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Date & Time</label>
                        <input
                          type="datetime-local"
                          value={sessionForm.scheduledAt}
                          onChange={(e) => setSessionForm((p) => ({ ...p, scheduledAt: e.target.value }))}
                          className="input text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Duration (Mins)</label>
                        <select
                          value={sessionForm.duration}
                          onChange={(e) => setSessionForm((p) => ({ ...p, duration: Number(e.target.value) }))}
                          className="input text-xs h-10 px-2"
                        >
                          <option value={30}>30 Minutes</option>
                          <option value={60}>1 Hour</option>
                          <option value={90}>1.5 Hours</option>
                          <option value={120}>2 Hours</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Platform</label>
                        <select
                          value={sessionForm.platform}
                          onChange={(e) => setSessionForm((p) => ({ ...p, platform: e.target.value }))}
                          className="input text-xs h-10 px-2"
                        >
                          <option value="google-meet">Google Meet</option>
                          <option value="zoom">Zoom</option>
                          <option value="teams">Microsoft Teams</option>
                          <option value="other">Other Link</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Meeting Link</label>
                        <input
                          type="url"
                          value={sessionForm.meetingLink}
                          onChange={(e) => setSessionForm((p) => ({ ...p, meetingLink: e.target.value }))}
                          placeholder="https://meet.google.com/..."
                          className="input text-xs"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowScheduleForm(false)}
                        className="btn btn-secondary btn-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={scheduleMutation.isPending}
                        className="btn btn-primary btn-sm flex items-center gap-1"
                      >
                        {scheduleMutation.isPending && <Loader2 size={12} className="animate-spin" />}
                        Save Session
                      </button>
                    </div>
                  </form>
                )}

                {/* Session list */}
                {mentorship.sessions?.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    <Calendar className="mx-auto mb-2 text-slate-300" size={28} />
                    <p className="text-xs font-semibold">No sessions scheduled yet.</p>
                    {isMentor && (
                      <p className="text-[10px] text-slate-450 mt-1">Click Schedule Session above to schedule your first meeting.</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mentorship.sessions.map((session: any, idx: number) => {
                      const isUpcoming = new Date(session.scheduledAt) >= new Date();
                      return (
                        <div key={session._id || idx} className="p-4 border border-slate-200 rounded-xl bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                              session.status === 'completed'
                                ? 'bg-emerald-50 border border-emerald-100 text-emerald-600'
                                : session.status === 'cancelled'
                                ? 'bg-red-50 border border-red-100 text-red-500'
                                : 'bg-blue-50 border border-blue-100 text-[#0169FC]'
                            }`}>
                              {idx + 1}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">
                                {formatDate(session.scheduledAt, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 font-semibold">
                                <span className="flex items-center gap-1"><Clock size={11} /> {session.duration} mins</span>
                                <span className="capitalize px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] border border-slate-200">{session.platform}</span>
                                {session.status && (
                                  <span className={`capitalize text-[10px] font-bold ${
                                    session.status === 'completed' ? 'text-emerald-600' :
                                    session.status === 'cancelled' ? 'text-red-500' : 'text-[#0169FC]'
                                  }`}>{session.status}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end md:self-center">
                            {session.status === 'scheduled' && (
                              <a
                                href={session.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary btn-sm inline-flex items-center gap-1 py-1 px-3 text-xs"
                              >
                                <Video size={13} className="text-[#0169FC]" /> Join Meeting
                              </a>
                            )}
                            {session.status === 'scheduled' && isMentor && (
                              <>
                                <button
                                  onClick={() => completeSessionMutation.mutate(session._id)}
                                  disabled={completeSessionMutation.isPending}
                                  className="btn btn-success btn-sm p-1.5 rounded-lg border-emerald-150 hover:bg-emerald-50"
                                  title="Mark completed"
                                >
                                  <Check size={13} className="text-emerald-600" />
                                </button>
                                <button
                                  onClick={() => cancelSessionMutation.mutate(session._id)}
                                  disabled={cancelSessionMutation.isPending}
                                  className="btn btn-danger btn-sm p-1.5 rounded-lg border-red-150 hover:bg-red-50"
                                  title="Cancel session"
                                >
                                  <XCircle size={13} className="text-red-500" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Feedback & Review Form (Mentees/Students) */}
            {mentorship.status === 'completed' && !isMentor && (
              <div className="card p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <h3 className="text-xs font-bold text-[#0169FC] uppercase tracking-wider mb-4">Program Review & Feedback</h3>
                
                {hasSubmittedFeedback ? (
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl font-sans">
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < mentorship.finalFeedback.fromMentee.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-emerald-800">Feedback Submitted</span>
                    </div>
                    <p className="text-xs text-slate-705 leading-relaxed font-semibold italic">
                      "{mentorship.finalFeedback.fromMentee.comment}"
                    </p>
                    {mentorship.finalFeedback.fromMentee.wouldRecommend && (
                      <p className="text-[10px] text-emerald-700 font-bold mt-2">✓ Recommended this mentor</p>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Rating (1 to 5 Stars)</label>
                      <div className="flex gap-2">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const val = i + 1;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setFeedbackForm((p) => ({ ...p, rating: val }))}
                              className="text-amber-500 hover:scale-110 transition-transform"
                            >
                              <Star
                                size={22}
                                className={val <= feedbackForm.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Comments & Review</label>
                      <textarea
                        value={feedbackForm.comment}
                        onChange={(e) => setFeedbackForm((p) => ({ ...p, comment: e.target.value }))}
                        rows={3}
                        placeholder="Tell us how your mentorship experience went and what you learned..."
                        className="input text-xs p-3 h-20"
                        required
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600">
                        <input
                          type="checkbox"
                          checked={feedbackForm.wouldRecommend}
                          onChange={(e) => setFeedbackForm((p) => ({ ...p, wouldRecommend: e.target.checked }))}
                          className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                        />
                        I would recommend this mentor to other students
                      </label>
                    </div>
                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={feedbackMutation.isPending}
                        className="btn btn-primary text-xs font-bold py-2 px-5 rounded-lg flex items-center gap-1 shadow-sm"
                      >
                        {feedbackMutation.isPending && <Loader2 size={12} className="animate-spin" />}
                        Submit Feedback
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Program Completion/Feedback notes (Mentor viewpoint) */}
            {mentorship.status === 'completed' && isMentor && (
              <div className="card p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <h3 className="text-xs font-bold text-[#0169FC] uppercase tracking-wider mb-4">Program Wrap Up</h3>
                {mentorship.finalFeedback?.fromMentee?.submittedAt ? (
                  <div>
                    <p className="text-xs text-slate-400 font-bold mb-2">Mentee's Feedback & Rating</p>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="flex text-amber-500 mb-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < mentorship.finalFeedback.fromMentee.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-650 leading-relaxed font-semibold italic">
                        "{mentorship.finalFeedback.fromMentee.comment}"
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-semibold">
                    Mentee has not submitted feedback/rating for this program yet.
                  </p>
                )}
              </div>
            )}

          </div>

          {/* Right Column: Other User Profile Card */}
          <div className="md:col-span-1">
            <div className="card p-5 bg-white border border-slate-200 rounded-2xl shadow-xs text-center font-sans sticky top-24">
              <h3 className="text-xs font-bold text-[#0169FC] uppercase tracking-wider mb-4 text-left">
                {isMentor ? 'Mentee Info' : 'Mentor Info'}
              </h3>
              
              <div className="flex flex-col items-center py-2">
                <Avatar
                  src={otherUser?.avatar}
                  name={`${otherUser?.firstName} ${otherUser?.lastName}`}
                  size="2xl"
                  verified={otherUser?.role === 'alumni'}
                />
                
                <h4 className="font-bold text-slate-900 mt-3 text-sm">
                  {otherUser?.firstName} {otherUser?.lastName}
                </h4>
                <p className="text-xs text-[#0169FC] font-bold capitalize mt-0.5">
                  {otherUser?.role}
                </p>

                {otherUser?.role === 'student' ? (
                  <div className="mt-4 w-full text-xs font-semibold text-slate-500 space-y-2 border-t border-slate-100 pt-4 text-left">
                    <p className="flex justify-between">
                      <span className="text-slate-400 font-bold">Email:</span>
                      <span className="text-slate-800">{otherUser?.email}</span>
                    </p>
                    <div className="pt-2">
                      <Link
                        to={`/students/${otherUser?._id}`}
                        className="btn btn-secondary btn-sm w-full justify-center rounded-lg text-xs py-2"
                      >
                        View Student Profile
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 w-full text-xs font-semibold text-slate-500 space-y-2 border-t border-slate-100 pt-4 text-left">
                    <p className="flex justify-between">
                      <span className="text-slate-400 font-bold">Email:</span>
                      <span className="text-slate-800">{otherUser?.email}</span>
                    </p>
                    <div className="pt-2">
                      <Link
                        to={`/alumni/${otherUser?._id}`}
                        className="btn btn-secondary btn-sm w-full justify-center rounded-lg text-xs py-2"
                      >
                        View Mentor Profile
                      </Link>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
