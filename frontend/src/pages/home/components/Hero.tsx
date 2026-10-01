import { Link } from 'react-router-dom';
import { motion, useInView, type Variants } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ArrowRight, GraduationCap, Building2, Users, Lightbulb } from 'lucide-react';

interface HeroProps { stats: any; isAuthenticated: boolean; }

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to }: { to?: number | null }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView || typeof to !== 'number' || !Number.isFinite(to)) return;
    let start = 0;
    const step = to / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [inView, to]);
  return <span ref={ref}>{typeof to === 'number' ? val.toLocaleString() : '—'}</span>;
}

// ── Fade variants ─────────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Hero({ stats, isAuthenticated }: HeroProps) {
  const departmentNames = [
    ...(stats?.byDepartment || []),
    ...(stats?.studentsByDepartment || []),
  ].map((entry: any) => entry?._id).filter(Boolean);
  const academicFields = new Set(departmentNames).size;

  const metrics = [
    { icon: GraduationCap, value: stats?.total, label: 'Verified Alumni' },
    { icon: Users, value: stats?.totalStudents, label: 'Enrolled Students' },
    { icon: Building2, value: stats ? academicFields : null, label: 'Academic Fields' },
    { icon: Lightbulb, value: stats?.mentors, label: 'Mentors' },
  ];

  return (
    <section className="relative isolate flex min-h-[78vh] items-center overflow-hidden bg-slate-950">
      <img
        src="/images/iitram-building.jpg"
        alt="IITRAM campus building"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/20" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          <span className="mb-6 inline-flex items-center gap-2 border-l-2 border-emerald-400 pl-3 text-xs font-semibold text-white/80">
            IITRAM · Ahmedabad
          </span>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.08 }}
            className="mb-5 text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-7xl"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            IITRAM Alumni Network
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.16 }}
            className="mb-8 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
          >
            Find graduates and students by engineering branch, explore opportunities, and stay connected to the institute.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.22 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Link to="/directory" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-slate-100">
              Explore the directory <ArrowRight size={15} />
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/60 bg-black/15 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10">
                Join the network
              </Link>
            )}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.3 }}
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/30 pt-5 sm:max-w-2xl sm:grid-cols-4"
          >
            {metrics.map(({ icon: Icon, value, label }) => (
              <div key={label}>
                <div className="mb-1 flex items-center gap-2 text-white/70">
                  <Icon size={14} />
                  <span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
                </div>
                <p className="text-2xl font-bold leading-none text-white">
                  <Counter to={value} />
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
