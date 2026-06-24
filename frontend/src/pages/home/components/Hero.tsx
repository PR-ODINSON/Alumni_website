import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { FaGraduationCap } from 'react-icons/fa';

interface HeroProps {
  stats: any;
  isAuthenticated: boolean;
}

export default function Hero({ stats, isAuthenticated }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const badgeRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
    tl.fromTo(badgeRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, delay: 0.2 })
      .fromTo(titleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, '-=0.5')
      .fromTo(descRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, '-=0.5')
      .fromTo(ctaRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0 }, '-=0.5');
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-24 pb-16 bg-slate-50 border-b border-slate-200">
      <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center mt-6">
        <div>
          <span ref={badgeRef} className="inline-flex items-center gap-1.5 justify-center px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold mb-6 opacity-0 shadow-sm">
            <FaGraduationCap className="text-slate-600" size={14} />
            IITRAM Alumni Community — Est. 2013
          </span>
          <h1 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-slate-900 tracking-tight leading-tight mb-6 opacity-0">
            Beyond Graduation Starts <br className="hidden md:block" />
            <span className="text-[#001f54]">
              Your Real Growth
            </span>
          </h1>
          
          <p ref={descRef} className="text-sm md:text-base text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed opacity-0 font-medium">
            Connect with {stats?.totalAlumni?.toLocaleString() || '5,000+'} alumni worldwide. 
            Find mentors, discover opportunities, and shape the IITRAM legacy together.
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0">
            {isAuthenticated ? (
              <Link to="/alumni" className="btn btn-primary btn-lg shadow-sm hover:-translate-y-0.5">
                Explore Network
              </Link>
            ) : (
              <div className="inline-flex bg-white p-1.5 rounded-full shadow-sm border border-slate-200">
                <Link to="/register" className="btn btn-primary btn-lg hover:-translate-y-0.5">
                  Explore Community
                </Link>
                <Link to="/login" className="btn btn-ghost btn-lg text-slate-600 hover:text-slate-900 px-8">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Hero Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-12 relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-md bg-white border border-slate-200 p-2">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="IITRAM Community" 
              className="w-full h-[250px] md:h-[400px] object-cover rounded-xl"
            />
            
            {/* Solid stats card over image */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 md:gap-8 bg-white p-4 rounded-xl shadow-lg border border-slate-200 w-[90%] md:w-auto justify-center items-center">
              {[
                { value: stats?.totalAlumni || '5,000+', label: 'Alumni' },
                { value: stats?.totalJobs || '86%', label: 'Placement' },
                { value: stats?.activeMentorships || '300+', label: 'Mentors' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center px-2 md:px-6 border-r border-slate-100 last:border-0">
                  <p className="text-lg md:text-xl font-bold font-display text-slate-900 leading-none">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
