import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { Building2, ArrowRight } from 'lucide-react';
import { homepageInstituteSections } from '../../../data/iitram';
import { OfficialSourceBadge } from '../../../components/institute/OfficialSource';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function InstitutePreview() {
  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200" aria-labelledby="institute-preview-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12"
        >
          <span className="badge badge-primary mb-3">Your Alma Mater</span>
          <h2 id="institute-preview-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-slate-900 mb-3 tracking-tight">
            Discover IITRAM
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto font-medium">
            Verified institutional information from official IITRAM sources — academics, research, campus life, and alumni relations.
          </p>
          <div className="flex justify-center mt-4">
            <OfficialSourceBadge />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {homepageInstituteSections.map((section, i) => (
            <motion.div
              key={section.title}
              variants={fadeUp}
              custom={i * 0.05}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Link
                to={section.href}
                className="group block h-full p-5 sm:p-6 bg-white border border-slate-200 shadow-xs hover:border-brand-500/40 hover:shadow-md rounded-2xl transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4 group-hover:bg-brand-500 group-hover:border-brand-500 transition-colors">
                  <Building2 size={16} className="text-slate-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-sm font-bold font-display text-slate-900 mb-2">{section.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{section.summary}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 mt-4 group-hover:gap-2 transition-all">
                  {section.cta} <ArrowRight size={14} />
                </span>
              </Link>
            </motion.div>
          ))}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="sm:col-span-2 lg:col-span-3"
          >
            <Link
              to="/institute"
              className="btn btn-outline w-full sm:w-auto mx-auto flex"
            >
              View All Institutional Information
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
