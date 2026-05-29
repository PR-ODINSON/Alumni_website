import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { useRef } from 'react';
import {
  ArrowRight, Users, Briefcase, Calendar, Award, Globe,
  TrendingUp, BookOpen, Star, GraduationCap, ChevronRight,
  Lightbulb, Network, MapPin, Building, Rocket,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { alumniApi, analyticsApi, successStoryApi, eventApi } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { formatDate, formatRelativeTime } from '../lib/utils';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6 },
  },
};

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { data: statsData } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: () => analyticsApi.getOverview(),
  });

  const { data: distinguishedData } = useQuery({
    queryKey: ['distinguished-alumni'],
    queryFn: () => alumniApi.getDistinguished(),
  });

  const { data: storiesData } = useQuery({
    queryKey: ['featured-stories'],
    queryFn: () => successStoryApi.getAll({ featured: true, limit: 3 }),
  });

  const { data: eventsData } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: () => eventApi.getAll({ upcoming: true, limit: 4 }),
  });

  const stats = statsData?.data?.data;
  const featured = distinguishedData?.data?.data?.slice(0, 3) || [];
  const stories = storiesData?.data?.data || [];
  const events = eventsData?.data?.data || [];

  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-iitram-950 to-slate-900">
        {/* Background layers */}
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img 
            src="/images/home-hero.png" 
            alt="IITRAM Alumni Community" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(ellipse at 15% 50%, rgba(52,112,244,0.15) 0%, transparent 60%),
              radial-gradient(ellipse at 85% 20%, rgba(234,179,8,0.10) 0%, transparent 50%)
            `
          }} />
        </motion.div>

        {/* Decorative orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-iitram-500/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-gold-500/8 rounded-full blur-3xl" />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left content */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                  <span className="text-sm text-slate-300 font-medium">IITRAM Alumni Community — Est. 2013</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.7 }}
                  className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] text-white mb-8"
                >
                  Your Alumni<br />
                  <span className="relative">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-iitram-300 via-blue-300 to-gold-400">
                      Network
                    </span>
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                      <path d="M2 8C60 4 120 2 150 3C180 4 240 6 298 8" stroke="url(#underline-gradient)" strokeWidth="3" strokeLinecap="round"/>
                      <defs>
                        <linearGradient id="underline-gradient" x1="0" y1="0" x2="300" y2="0">
                          <stop offset="0%" stopColor="#6badf5" />
                          <stop offset="100%" stopColor="#eab308" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                  {' '}Awaits
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-xl text-slate-400 leading-relaxed mb-10 max-w-lg"
                >
                  Connect with {stats?.totalAlumni?.toLocaleString() || '5,000+'} alumni across industries worldwide.
                  Find mentors, discover opportunities, and shape the IITRAM legacy.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="flex flex-wrap gap-4"
                >
                  {isAuthenticated ? (
                    <Link to="/alumni" className="btn btn-primary btn-lg group">
                      Explore Network
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <>
                      <Link to="/register" className="btn btn-primary btn-lg group">
                        Join the Network
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link to="/login" className="btn btn-lg border border-white/20 text-white hover:bg-white/10">
                        Sign In
                      </Link>
                    </>
                  )}
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-white/10"
                >
                  {[
                    { value: stats?.totalAlumni || '5K+', label: 'Alumni' },
                    { value: stats?.totalJobs || '2K+', label: 'Jobs' },
                    { value: stats?.activeMentorships || '300+', label: 'Active Mentorships' },
                    { value: '30+', label: 'Countries' },
                  ].map(({ value, label }) => (
                    <div key={label}>
                      <p className="text-2xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                      <p className="text-xs text-slate-500">{label}</p>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right - Feature highlights */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { icon: Users, title: 'Alumni Directory', desc: 'Find and connect with IITRAM graduates worldwide', color: 'from-blue-600/20 to-iitram-600/20', border: 'border-blue-500/20', href: '/alumni' },
                  { icon: Briefcase, title: 'Jobs & Referrals', desc: 'Exclusive opportunities from your network', color: 'from-emerald-600/20 to-teal-600/20', border: 'border-emerald-500/20', href: '/jobs' },
                  { icon: Lightbulb, title: 'Mentorship Hub', desc: 'Learn from experienced IITRAM alumni', color: 'from-gold-600/20 to-amber-600/20', border: 'border-gold-500/20', href: '/mentorship' },
                  { icon: Globe, title: 'World Map', desc: 'See where IITRAM alumni are making impact', color: 'from-purple-600/20 to-violet-600/20', border: 'border-purple-500/20', href: '/analytics' },
                ].map(({ icon: Icon, title, desc, color, border, href }, i) => (
                  <Link
                    key={title}
                    to={href}
                    className={`group p-5 rounded-2xl bg-gradient-to-br ${color} border ${border} backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
                  >
                    <Icon size={24} className="text-white/80 mb-3 group-hover:text-white transition-colors" />
                    <h3 className="font-semibold text-white text-sm mb-1">{title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
                  </Link>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-slate-500 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* PLATFORM FEATURES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-primary mb-4">Platform Capabilities</span>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything an Institutional<br />Alumni Platform Should Be</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              A purpose-built ecosystem for IITRAM — far beyond a simple alumni directory.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Network,
                title: 'Professional Network',
                desc: 'Build meaningful connections with alumni across industries. Send connection requests, exchange messages, and grow your professional circle.',
                tag: 'Connect',
              },
              {
                icon: TrendingUp,
                title: 'Career Timeline',
                desc: 'Interactive career journey visualization. Showcase your professional milestones and inspire the next generation of IITRAM graduates.',
                tag: 'Showcase',
              },
              {
                icon: Lightbulb,
                title: 'Mentorship System',
                desc: 'Structured mentorship matching, session scheduling, milestone tracking, and feedback. Transform careers through knowledge sharing.',
                tag: 'Mentor',
              },
              {
                icon: Rocket,
                title: 'Startup Ecosystem',
                desc: 'Celebrate entrepreneur alumni. Explore startups founded by IITRAM graduates across sectors from deep tech to social impact.',
                tag: 'Innovate',
              },
              {
                icon: BookOpen,
                title: 'Research Collaboration',
                desc: 'Bridge academia and industry. Faculty, students, and alumni collaborate on cutting-edge research projects.',
                tag: 'Research',
              },
              {
                icon: Globe,
                title: 'Global Alumni Map',
                desc: 'Visualize the worldwide IITRAM footprint. See where graduates are working across 30+ countries.',
                tag: 'Global',
              },
            ].map(({ icon: Icon, title, desc, tag }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                custom={i * 0.05}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group p-8 rounded-2xl border border-slate-100 hover:border-iitram-200 hover:shadow-soft-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-iitram-50 group-hover:bg-iitram-100 transition-colors flex items-center justify-center mb-6">
                  <Icon size={22} className="text-iitram-700" />
                </div>
                <div className="badge badge-primary mb-3">{tag}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SUCCESS STORIES PREVIEW */}
      {stories.length > 0 && (
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-end justify-between mb-12"
            >
              <div>
                <span className="badge badge-gold mb-3">Alumni Stories</span>
                <h2 className="text-4xl font-bold text-slate-900">Journeys That<br />Inspire</h2>
              </div>
              <Link to="/success-stories" className="btn btn-outline group">
                View All Stories
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {stories.map((story: any, i: number) => (
                <motion.div
                  key={story._id}
                  variants={fadeUp}
                  custom={i * 0.1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Link to={`/success-stories/${story._id}`} className="group block">
                    <div className="relative h-56 rounded-2xl overflow-hidden mb-5">
                      {story.coverImage ? (
                        <img
                          src={story.coverImage}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-iitram-800 to-iitram-600 flex items-center justify-center">
                          <Star size={32} className="text-white/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="badge badge-gold capitalize">{story.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={story.alumni?.avatar || `https://ui-avatars.com/api/?name=${story.alumni?.firstName}&background=1d2f88&color=fff`}
                        className="w-8 h-8 rounded-full object-cover"
                        alt=""
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{story.alumni?.firstName} {story.alumni?.lastName}</p>
                        <p className="text-xs text-slate-400">{formatDate(story.publishedAt || story.createdAt)}</p>
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-iitram-700 transition-colors mb-2">
                      {story.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2">{story.subtitle}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* UPCOMING EVENTS */}
      {events.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-end justify-between mb-12"
            >
              <div>
                <span className="badge badge-primary mb-3">Upcoming</span>
                <h2 className="text-4xl font-bold text-slate-900">Events &<br />Gatherings</h2>
              </div>
              <Link to="/events" className="btn btn-outline group">
                View All Events
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((event: any, i: number) => (
                <motion.div
                  key={event._id}
                  variants={fadeUp}
                  custom={i * 0.1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Link to={`/events/${event._id}`} className="group block card-hover p-0 overflow-hidden">
                    <div className="relative h-40 overflow-hidden">
                      {event.coverImage ? (
                        <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-iitram-700 to-iitram-500 flex items-center justify-center">
                          <Calendar size={28} className="text-white/50" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="badge badge-primary capitalize">{event.eventType.replace('-', ' ')}</span>
                      </div>
                      {event.isVirtual && (
                        <div className="absolute top-3 right-3">
                          <span className="badge bg-teal-500 text-white">Virtual</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2 mb-3 group-hover:text-iitram-700 transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                        <Calendar size={12} />
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      {event.city && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin size={12} />
                          <span>{event.city}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DISTINGUISHED ALUMNI */}
      {featured.length > 0 && (
        <section className="py-24 bg-slate-950 text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-end justify-between mb-12"
            >
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-400 text-xs font-medium mb-4">
                  <Award size={12} /> Distinguished Alumni
                </span>
                <h2 className="text-4xl font-bold text-white">IITRAM's<br />Finest</h2>
              </div>
              <Link to="/alumni" className="btn border border-white/20 text-white hover:bg-white/10 group">
                View All
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {featured.map((alumnus: any, i: number) => (
                <motion.div
                  key={alumnus._id}
                  variants={fadeUp}
                  custom={i * 0.1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/alumni/${alumnus.user._id}`}
                    className="group block p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={alumnus.user?.avatar || `https://ui-avatars.com/api/?name=${alumnus.user?.firstName}&background=1d2f88&color=fff`}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-gold-500/30"
                        alt=""
                      />
                      <div>
                        <p className="font-semibold text-white">{alumnus.user?.firstName} {alumnus.user?.lastName}</p>
                        <p className="text-sm text-slate-400">{alumnus.currentDesignation}</p>
                        <p className="text-xs text-slate-500">{alumnus.currentCompany}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <GraduationCap size={12} />
                      <span>{alumnus.degreeType} · {alumnus.department} · {alumnus.batch}</span>
                    </div>
                    {alumnus.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {alumnus.skills.slice(0, 3).map((skill: string) => (
                          <span key={skill} className="text-2xs px-2 py-0.5 bg-white/10 text-slate-300 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-iitram-700 to-iitram-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Award size={48} className="text-gold-400 mx-auto mb-6" />
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
              Be Part of the<br />IITRAM Legacy
            </h2>
            <p className="text-iitram-200 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Join thousands of IITRAM alumni who are shaping industries, building companies, and making an impact across the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn btn-lg bg-white text-iitram-800 hover:bg-iitram-50 font-semibold shadow-xl">
                Create Your Profile
                <ArrowRight size={18} />
              </Link>
              <Link to="/alumni" className="btn btn-lg border border-white/30 text-white hover:bg-white/10">
                Explore Alumni
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-iitram-700 to-iitram-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">IA</span>
                </div>
                <span className="font-bold text-white text-base">IITRAM Alumni Network</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                The official alumni platform of IITRAM — Institute of Infrastructure, Technology, Research and Management, Ahmedabad.
              </p>
            </div>
            {[
              { title: 'Platform', links: [{ label: 'Alumni Directory', href: '/alumni' }, { label: 'Jobs & Careers', href: '/jobs' }, { label: 'Events', href: '/events' }, { label: 'Mentorship', href: '/mentorship' }] },
              { title: 'Explore', links: [{ label: 'Success Stories', href: '/success-stories' }, { label: 'Research Hub', href: '/research' }, { label: 'Analytics', href: '/analytics' }, { label: 'Community Feed', href: '/feed' }] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
                <ul className="space-y-2">
                  {links.map(({ label, href }) => (
                    <li key={href}>
                      <Link to={href} className="text-sm hover:text-white transition-colors">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© {new Date().getFullYear()} IITRAM Alumni Platform. All rights reserved.</p>
            <p>Institute of Infrastructure, Technology, Research and Management · Ahmedabad, Gujarat, India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
