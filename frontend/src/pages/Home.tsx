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
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-sky-50 via-white to-sky-50/50 pt-20">
        {/* Background Decorative */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-100/50 to-transparent rounded-b-[100%]" />
        
        {/* Floating clouds/elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 right-10 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl animate-float" />

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center mt-12 md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6 animate-fade-in">
              IITRAM Alumni Community — Est. 2013
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif text-slate-900 tracking-tight leading-tight mb-6">
              Beyond Graduation Starts <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                Your Real Growth
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with {stats?.totalAlumni?.toLocaleString() || '5,000+'} alumni worldwide. 
              Find mentors, discover opportunities, and shape the IITRAM legacy together.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link to="/alumni" className="btn btn-primary btn-lg shadow-lg shadow-blue-500/30 hover:-translate-y-1">
                  Explore Network
                </Link>
              ) : (
                <div className="inline-flex bg-white p-2 rounded-full shadow-soft border border-slate-100">
                  <Link to="/register" className="btn btn-primary btn-lg shadow-md hover:-translate-y-0.5">
                    Explore Community
                  </Link>
                  <Link to="/login" className="btn btn-ghost btn-lg text-slate-600 hover:text-slate-900 px-8">
                    Login
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Hero Image Section - Emulating the students cutout */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-16 relative max-w-5xl mx-auto"
          >
             <div className="relative rounded-3xl overflow-hidden shadow-soft-xl bg-white border border-slate-100 p-2 lg:p-3">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="IITRAM Community" 
                  className="w-full h-[350px] md:h-[500px] object-cover rounded-2xl"
                />
                
                {/* Floating stats card over image */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 md:gap-8 backdrop-blur-xl bg-white/95 p-5 md:p-6 rounded-2xl shadow-2xl border border-white/50 w-[90%] md:w-auto justify-center items-center">
                  {[
                    { value: stats?.totalAlumni || '5,000+', label: 'Alumni' },
                    { value: stats?.totalJobs || '86%', label: 'Placement' },
                    { value: stats?.activeMentorships || '300+', label: 'Mentors' },
                  ].map(({ value, label }) => (
                    <div key={label} className="text-center px-2 md:px-6">
                      <p className="text-2xl md:text-3xl font-bold font-serif text-slate-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                      <p className="text-xs md:text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">{label}</p>
                    </div>
                  ))}
                </div>
             </div>
          </motion.div>
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
        <section className="py-24 bg-slate-50 text-slate-900">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-end justify-between mb-12"
            >
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-gold-100 border border-gold-200 rounded-full text-gold-700 text-xs font-medium mb-4">
                  <Award size={12} /> Distinguished Alumni
                </span>
                <h2 className="text-4xl font-bold text-slate-900 font-serif">IITRAM's<br />Finest</h2>
              </div>
              <Link to="/alumni" className="btn btn-outline group">
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
                    className="group block p-6 rounded-3xl bg-white border border-slate-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={alumnus.user?.avatar || `https://ui-avatars.com/api/?name=${alumnus.user?.firstName}&background=1d2f88&color=fff`}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100"
                        alt=""
                      />
                      <div>
                        <p className="font-bold text-slate-900">{alumnus.user?.firstName} {alumnus.user?.lastName}</p>
                        <p className="text-sm font-medium text-blue-600">{alumnus.currentDesignation}</p>
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
                          <span key={skill} className="text-2xs px-2.5 py-1 bg-slate-50 text-slate-600 rounded-full border border-slate-100">
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
