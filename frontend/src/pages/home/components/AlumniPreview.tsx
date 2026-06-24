import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Award, GraduationCap } from 'lucide-react';

interface AlumniPreviewProps {
  featured: any[];
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6 },
  },
};

export default function AlumniPreview({ featured }: AlumniPreviewProps) {
  if (featured.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-[10px] font-bold shadow-sm">
              <Award size={13} className="text-amber-500" /> Distinguished Alumni
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 tracking-tight">
              IITRAM's<br />Finest
            </h2>
          </div>
          <Link to="/alumni" className="btn btn-outline group shrink-0">
            View All
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((alumnus: any, i: number) => (
            <motion.div
              key={alumnus._id}
              variants={fadeUp}
              custom={i * 0.1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 rounded-2xl p-6 flex flex-col justify-between h-full transition-all duration-200"
            >
              <Link to={`/alumni/${alumnus.user?._id}`} className="flex flex-col h-full justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={alumnus.user?.avatar || `https://ui-avatars.com/api/?name=${alumnus.user?.firstName}&background=001f54&color=fff`}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 border border-slate-200"
                    alt=""
                  />
                  <div className="min-w-0">
                    <p className="font-bold font-display text-slate-900 text-sm truncate">{alumnus.user?.firstName} {alumnus.user?.lastName}</p>
                    <p className="text-xs font-bold text-brand-600 mt-0.5 truncate">{alumnus.currentDesignation}</p>
                    <p className="text-[10px] text-slate-400 font-semibold truncate">{alumnus.currentCompany}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                    <GraduationCap size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{alumnus.degreeType} · {alumnus.department} · {alumnus.batch}</span>
                  </div>
                  {alumnus.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {alumnus.skills.slice(0, 3).map((skill: string) => (
                        <span key={skill} className="text-[9px] px-2.5 py-0.5 bg-slate-50 text-slate-500 rounded-full border border-slate-150 font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
