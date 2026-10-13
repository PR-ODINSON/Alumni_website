import { Link } from 'react-router-dom';
import { motion, useInView, type Variants } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ArrowRight, GraduationCap, Building2, Users, Lightbulb } from 'lucide-react';

interface HeroProps { stats: any; isAuthenticated: boolean; }

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

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

export default function Hero({ stats, isAuthenticated }: HeroProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const departmentNames = [
    ...(stats?.byDepartment || []),
    ...(stats?.studentsByDepartment || []),
  ].map((entry: any) => entry?._id).filter(Boolean);
  const academicFields = new Set(departmentNames).size;

  const metrics = [
    { icon: GraduationCap, value: stats?.total,        label: 'Verified Alumni' },
    { icon: Users,          value: stats?.totalStudents, label: 'Enrolled Students' },
    { icon: Building2,      value: stats ? academicFields : null, label: 'Academic Fields' },
    { icon: Lightbulb,      value: stats?.mentors,       label: 'Mentors' },
  ];

  return (
    <section className="relative isolate flex min-h-[82vh] items-center overflow-hidden" style={{ background: '#042226' }}>

      {/* Official IITRAM campus background photo */}
      <img
        src="/iitram-bg.jpg"
        alt="IITRAM campus"
        onLoad={() => setImgLoaded(true)}
        onError={() => setImgError(true)}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* I-Card Teal & Deep Navy-Teal gradient overlays keeping the IITRAM campus photo clearly visible */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(95deg, rgba(4,34,38,0.88) 0%, rgba(7,63,124,0.62) 52%, rgba(21,151,162,0.18) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(0deg, rgba(4,34,38,0.72) 0%, transparent 45%, rgba(4,34,38,0.25) 100%)',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="max-w-3xl">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.05 }}
            className="mb-6 inline-flex flex-wrap items-center gap-2.5 p-1.5 pr-4 rounded-full shadow-lg"
            style={{ background: '#DFF3F5', border: '2px solid #D6DF8E' }}
          >
            <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-full shadow-2xs">
              <img
                src="/new/iitram cdr logo.png"
                alt="IITRAM Institute Logo"
                className="w-8 h-8 object-contain"
              />
              <div className="w-[1px] h-5 bg-[#1597A2]/30" />
              <img
                src="/new/alumani.jpeg"
                alt="IITRAM Alumni Relations Logo"
                className="w-8 h-8 object-contain rounded-full"
              />
            </div>
            <span
              className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full"
              style={{ background: '#D6DF8E', color: '#000000' }}
            >
              ALUMNI RELATIONS, IITRAM
            </span>
            <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: '#073F7C' }}>
              Ahmedabad
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.1 }}
            className="mb-5 text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-7xl"
            style={{ fontFamily: 'Outfit, sans-serif', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
          >
            IITRAM Alumni
            <br />
            <span style={{ color: '#D6DF8E' }}>Network</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.18 }}
            className="mb-8 max-w-xl text-base leading-relaxed sm:text-lg font-medium"
            style={{ color: '#DFF3F5' }}
          >
            Find graduates and students by engineering branch, explore exclusive opportunities, and stay connected to the institute.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.26 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Link
              to="/directory"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-extrabold transition-all hover:shadow-lg hover:-translate-y-0.5 shadow-md"
              style={{ background: '#D6DF8E', color: '#000000', border: '1px solid #c3cf6d' }}
            >
              Explore the directory <ArrowRight size={15} />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-extrabold text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #1597A2 0%, #0B6169 100%)', border: '1px solid #DFF3F5' }}
              >
                Join the network
              </Link>
            )}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.34 }}
            className="mt-12 grid grid-cols-2 gap-x-8 gap-y-5 border-t pt-6 sm:max-w-2xl sm:grid-cols-4"
            style={{ borderColor: 'rgba(214, 223, 142, 0.35)' }}
          >
            {metrics.map(({ icon: Icon, value, label }) => (
              <div key={label} className="group">
                <div className="mb-1.5 flex items-center gap-1.5" style={{ color: '#D6DF8E' }}>
                  <Icon size={13} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
                </div>
                <p className="text-2xl font-extrabold leading-none text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  <Counter to={value} />
                  {value != null && '+'}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
