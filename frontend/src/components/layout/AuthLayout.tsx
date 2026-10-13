import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Users, Briefcase, Award, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Users,     value: '5,000+',  label: 'Alumni Network' },
  { icon: Briefcase, value: '2,000+',  label: 'Jobs Posted' },
  { icon: Award,     value: '500+',    label: 'Success Stories' },
  { icon: TrendingUp,value: '10+',     label: 'Batches' },
];

const features = [
  'Connect with 5,000+ IITRAM graduates',
  'Exclusive alumni job referrals',
  'Find mentors in your field',
  'Attend alumni events & reunions',
];

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center p-0 md:p-6 lg:p-8 font-sans bg-slate-50">

      {/* Main Card */}
      <div
        className="w-full max-w-6xl bg-white border border-slate-200/80 shadow-2xl rounded-none md:rounded-2xl overflow-hidden grid lg:grid-cols-12 min-h-screen md:min-h-[720px] lg:h-[800px] relative z-10"
        style={{ boxShadow: '0 25px 60px -12px rgba(7,63,124,0.14)' }}
      >

        {/* ── Left Panel ──────────────────────────────────────────────── */}
        <div
          className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-10 xl:p-12 overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #042226 0%, #073F7C 42%, #0B6169 75%, #1597A2 100%)',
          }}
        >
          {/* IITRAM Building Background Photo */}
          <img
            src="/iitram-bg.jpg"
            alt="IITRAM Campus"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-35 mix-blend-overlay"
          />

          {/* Animated gradient mesh */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
              style={{
                background: 'radial-gradient(circle, #D6DF8E 0%, transparent 70%)',
                top: '-10%',
                right: '-15%',
                animation: 'float 6s ease-in-out infinite',
              }}
            />
            <div
              className="absolute w-72 h-72 rounded-full opacity-20 blur-3xl"
              style={{
                background: 'radial-gradient(circle, #1597A2 0%, transparent 70%)',
                bottom: '10%',
                left: '-10%',
                animation: 'float 8s ease-in-out infinite reverse',
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between gap-6">

            {/* Logos */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl shadow-xs">
                <img
                  src="/new/iitram cdr logo.png"
                  alt="IITRAM Logo"
                  className="w-8 h-8 object-contain"
                />
                <div className="w-px h-5 bg-slate-200" />
                <img
                  src="/new/alumani.jpeg"
                  alt="Alumni Logo"
                  className="w-8 h-8 object-contain rounded-full"
                />
              </div>
              <div>
                <span className="text-lg font-extrabold font-display text-white tracking-wide block leading-none">IITRAM</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7dd3dc] block mt-1">
                  Alumni Relations
                </span>
              </div>
            </Link>

            {/* Middle section */}
            <div className="my-auto space-y-6">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/25"
              >
                <span className="w-2 h-2 rounded-full animate-pulse bg-[#7dd3dc]" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-white">
                  IITRAM · Ahmedabad
                </span>
              </div>

              {/* Headline */}
              <div>
                <h1 className="text-3xl xl:text-4xl font-bold font-display leading-tight text-white mb-3">
                  Where Alumni
                  <br />
                  <span className="font-extrabold text-[#7dd3dc]">
                    Shape Futures
                  </span>
                </h1>
                <p className="text-sm leading-relaxed max-w-xs text-white/85">
                  Connect with graduates, find mentors, and contribute to the IITRAM legacy.
                </p>
              </div>

              {/* Feature list */}
              <ul className="space-y-2.5">
                {features.map((f, i) => (
                  <motion.li
                    key={f}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                    className="flex items-center gap-2.5 text-xs font-medium text-white/90"
                  >
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 bg-[#1597A2] text-white"
                    >
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 12 12">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {f}
                  </motion.li>
                ))}
              </ul>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {stats.map(({ icon: Icon, value, label }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.07 }}
                    className="p-3 rounded-xl transition-colors bg-white/10 border border-white/15"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-white/15 text-[#7dd3dc]">
                        <Icon size={12} />
                      </div>
                      <p className="text-base font-bold text-white font-display leading-none">{value}</p>
                    </div>
                    <p className="text-[10px] font-semibold text-white/80">{label}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="p-4 rounded-xl bg-white/10 border border-white/15"
            >
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3 h-3 fill-current text-amber-400" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <p className="text-[11px] leading-relaxed italic mb-3 text-white/90">
                "The IITRAM Alumni Network helped me find my first job abroad and connected me with a mentor who transformed my career."
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 bg-[#1597A2] text-white"
                >
                  RS
                </div>
                <div>
                  <p className="text-white text-[11px] font-bold leading-none">Rahul Sharma</p>
                  <p className="text-[9px] mt-0.5 font-medium text-white/75">B.Tech Civil '19 · Senior Engineer, Google</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* ── Right Side — Form Area ─────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-between overflow-y-auto scrollbar-none h-full bg-white">
          <div className="flex-1 flex flex-col justify-center py-8 px-6 sm:px-10">
            <div className="w-full max-w-md mx-auto">

              {/* Mobile logo */}
              <Link to="/" className="flex lg:hidden items-center gap-2.5 mb-6 justify-center">
                <div className="flex items-center gap-2">
                  <img
                    src="/new/iitram cdr logo.png"
                    alt="IITRAM Logo"
                    className="w-8 h-8 object-contain"
                  />
                  <div className="w-px h-5 bg-slate-200" />
                  <img
                    src="/new/alumani.jpeg"
                    alt="Alumni Logo"
                    className="w-8 h-8 object-contain rounded-full"
                  />
                </div>
                <div>
                  <span className="font-bold font-display text-base block text-[#073F7C] leading-none">IITRAM</span>
                  <span className="text-[10px] font-bold uppercase text-[#1597A2] block mt-0.5">
                    Alumni Relations
                  </span>
                </div>
              </Link>

              <Outlet />
            </div>
          </div>

          <div className="pb-4 pt-2 text-center text-[10px] text-slate-400 font-medium border-t border-slate-100">
            © {new Date().getFullYear()} IITRAM Alumni Platform · Ahmedabad, India
          </div>
        </div>

      </div>
    </div>
  );
}
