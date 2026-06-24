import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Calendar, MapPin, Globe, Video, Users, Award, Tag, Loader2, Image } from 'lucide-react';
import { eventApi } from '../../lib/api';
import toast from 'react-hot-toast';

const EVENT_TYPES = [
  { value: 'reunion', label: 'Reunion' },
  { value: 'alumni-meet', label: 'Alumni Meet' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'guest-lecture', label: 'Guest Lecture' },
  { value: 'conference', label: 'Conference' },
  { value: 'other', label: 'Other' },
];

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    shortDescription: '',
    eventType: 'reunion',
    startDate: '',
    endDate: '',
    isVirtual: false,
    virtualLink: '',
    venue: '',
    city: '',
    country: '',
    maxAttendees: '',
    isFree: true,
    fee: '',
    hasCertificate: false,
    coverImage: '',
    tagsInput: '',
    speakersInput: '',
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => eventApi.createEvent(data),
    onSuccess: () => {
      toast.success('Event created successfully!');
      navigate('/events');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create event. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.startDate || !form.endDate) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (new Date(form.startDate) >= new Date(form.endDate)) {
      toast.error('End date/time must be after start date/time.');
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      shortDescription: form.shortDescription || undefined,
      eventType: form.eventType,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      isVirtual: form.isVirtual,
      virtualLink: form.isVirtual ? form.virtualLink || undefined : undefined,
      venue: !form.isVirtual ? form.venue || undefined : undefined,
      city: !form.isVirtual ? form.city || undefined : undefined,
      country: !form.isVirtual ? form.country || undefined : undefined,
      maxAttendees: form.maxAttendees ? Number(form.maxAttendees) : undefined,
      isFree: form.isFree,
      fee: !form.isFree && form.fee ? Number(form.fee) : undefined,
      hasCertificate: form.hasCertificate,
      coverImage: form.coverImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=60',
      tags: form.tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
      speakers: form.speakersInput
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      isPublished: true, // Auto-publish for simplification
    };

    createMutation.mutate(payload);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link to="/events" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Events
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8 bg-slate-900 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0169FC]/15 rounded-full blur-3xl pointer-events-none" />
            <h1 className="text-2xl font-bold font-display">Create a New Event</h1>
            <p className="text-slate-400 text-xs mt-1 font-semibold">Organize a meetup, webinar, workshop or session for the community</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 font-sans text-slate-800">
            
            {/* Section: Basic info */}
            <div>
              <h3 className="text-xs font-bold text-[#0169FC] uppercase tracking-wider mb-4">1. Event Info</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Event Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Annual Alumni Reunion 2026, Core Placement Prep Talk"
                    className="input text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Event Type</label>
                  <select
                    name="eventType"
                    value={form.eventType}
                    onChange={handleChange}
                    className="input text-xs h-10 px-2"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Short Description</label>
                  <input
                    type="text"
                    name="shortDescription"
                    value={form.shortDescription}
                    onChange={handleChange}
                    placeholder="e.g. Join us for a panel discussion with industry experts on placement preparedness."
                    className="input text-xs"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Full Description <span className="text-red-500">*</span></label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Detailed agenda, requirements, registration terms..."
                    className="input text-xs p-3 h-32"
                    required
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Section: Date & Time */}
            <div>
              <h3 className="text-xs font-bold text-[#0169FC] uppercase tracking-wider mb-4">2. Date & Time</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Start Date & Time <span className="text-red-500">*</span></label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="input text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">End Date & Time <span className="text-red-500">*</span></label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="input text-xs"
                    required
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Section: Location and Format */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-[#0169FC] uppercase tracking-wider">3. Format & Venue</h3>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600">
                  <input
                    type="checkbox"
                    name="isVirtual"
                    checked={form.isVirtual}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <Video size={14} className="text-teal-500 inline fill-teal-100" /> This is a Virtual Event
                </label>
              </div>

              {form.isVirtual ? (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Meeting Link / Virtual Link</label>
                  <input
                    type="url"
                    name="virtualLink"
                    value={form.virtualLink}
                    onChange={handleChange}
                    placeholder="https://meet.google.com/xyz-abc-123 or Zoom link"
                    className="input text-xs"
                  />
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Venue Address</label>
                    <input
                      type="text"
                      name="venue"
                      value={form.venue}
                      onChange={handleChange}
                      placeholder="e.g. Block 1 Seminar Hall, IITRAM Campus"
                      className="input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">City</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="e.g. Ahmedabad"
                      className="input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="e.g. India"
                      className="input text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            <hr className="border-slate-100" />

            {/* Section: Capacity and Certificates */}
            <div>
              <h3 className="text-xs font-bold text-[#0169FC] uppercase tracking-wider mb-4">4. Capacity & Registration Details</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Max Attendees Limit</label>
                  <input
                    type="number"
                    name="maxAttendees"
                    value={form.maxAttendees}
                    onChange={handleChange}
                    placeholder="e.g. 100 (Leave blank for unlimited)"
                    className="input text-xs"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Registration Status</label>
                  <select
                    name="isFree"
                    value={form.isFree ? 'free' : 'paid'}
                    onChange={(e) => setForm((prev) => ({ ...prev, isFree: e.target.value === 'free' }))}
                    className="input text-xs h-10 px-2"
                  >
                    <option value="free">Free Event</option>
                    <option value="paid">Paid Event</option>
                  </select>
                </div>
                {!form.isFree && (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Event Fee (INR)</label>
                    <input
                      type="number"
                      name="fee"
                      value={form.fee}
                      onChange={handleChange}
                      placeholder="e.g. 500"
                      className="input text-xs"
                      min={0}
                      required
                    />
                  </div>
                )}
                <div className="md:col-span-3 flex items-center pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600">
                    <input
                      type="checkbox"
                      name="hasCertificate"
                      checked={form.hasCertificate}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                    />
                    <Award size={14} className="text-amber-500 inline fill-amber-100" /> Attendees will receive participation certificates
                  </label>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Section: Additional content */}
            <div>
              <h3 className="text-xs font-bold text-[#0169FC] uppercase tracking-wider mb-4">5. Additional Info</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Banner / Cover Image URL (Optional)</label>
                  <input
                    type="url"
                    name="coverImage"
                    value={form.coverImage}
                    onChange={handleChange}
                    placeholder="https://example.com/banner.jpg"
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Speakers (One per line)</label>
                  <textarea
                    name="speakersInput"
                    value={form.speakersInput}
                    onChange={handleChange}
                    rows={3}
                    placeholder="e.g. Dr. A.K. Sharma (IITRAM)&#10;Mr. Rohit Patel (Alumni, Google)"
                    className="input text-xs p-3 h-20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Tags (Comma separated)</label>
                  <input
                    type="text"
                    name="tagsInput"
                    value={form.tagsInput}
                    onChange={handleChange}
                    placeholder="e.g. Reunion, Seminar, Coding, Networking"
                    className="input text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
              <Link to="/events" className="btn btn-secondary py-2.5 px-5 text-xs font-bold rounded-lg cursor-pointer">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="btn btn-primary py-2.5 px-6 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-2 shadow-md hover:-translate-y-0.5 transition-all"
              >
                {createMutation.isPending ? (
                  <><Loader2 size={14} className="animate-spin" /> Creating...</>
                ) : (
                  <>Create Event</>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
