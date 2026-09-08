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
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const badgeRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
    tl.fromTo(badgeRef.current, { opacity: 0, y: -16 }, { opacity: 1, y: 0, delay: 0.15 })
      .fromTo(titleRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, '-=0.4')
      .fromTo(descRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, '-=0.4')
      .fromTo(ctaRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0 }, '-=0.4');
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20 sm:pt-24 pb-12 sm:pb-16 bg-slate-50 border-b border-slate-200">
      <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-2 sm:mt-6">
        <div>
          <span ref={badgeRef} className="inline-flex items-center gap-1.5 justify-center px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold mb-5 opacity-0 shadow-2xs">
            <FaGraduationCap className="text-brand-500" size={14} />
            IITRAM Alumni Community — Est. 2013
          </span>
          <h1 ref={titleRef} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-slate-900 tracking-tight leading-[1.15] mb-4 sm:mb-6 opacity-0">
            Beyond Graduation Starts <br className="hidden sm:block" />
            <span className="text-[#001f54]">
              Your Real Growth
            </span>
          </h1>
          
          <p ref={descRef} className="text-xs sm:text-sm md:text-base text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed opacity-0 font-medium px-2">
            Connect with {stats?.totalAlumni?.toLocaleString() || '5,000+'} alumni worldwide. 
            Find mentors, discover opportunities, and shape the IITRAM legacy together.
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 opacity-0 max-w-md mx-auto">
            {isAuthenticated ? (
              <Link to="/directory" className="btn btn-primary btn-lg w-full sm:w-auto shadow-xs">
                Explore Network
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg w-full sm:w-auto shadow-xs">
                  Explore Community
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg w-full sm:w-auto">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Hero Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-8 sm:mt-12 relative max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-200 p-1.5 sm:p-2">
            <img
              src="/images/136743c964bbf4569aec074e5b7004a0.webp"
              alt="IITRAM campus"
              className="w-full h-[200px] xs:h-[260px] sm:h-[340px] md:h-[400px] object-cover rounded-xl"
              loading="lazy"
            />
            
            {/* Stats card over image */}
            <div className="mt-3 sm:mt-0 sm:absolute sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 flex items-center justify-around sm:justify-center gap-2 sm:gap-6 bg-white p-3 sm:p-4 rounded-xl shadow-xs sm:shadow-lg border border-slate-200 w-full sm:w-auto">
              {[
                { value: stats?.totalAlumni || '5,000+', label: 'Alumni' },
                { value: stats?.totalJobs || '86%', label: 'Placement' },
                { value: stats?.activeMentorships || '300+', label: 'Mentors' },
              ].map(({ value, label }, index, arr) => (
                <div key={label} className={`text-center px-2 sm:px-5 ${index !== arr.length - 1 ? 'border-r border-slate-100' : ''}`}>
                  <p className="text-base sm:text-xl font-bold font-display text-slate-900 leading-none">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 sm:mt-1.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
