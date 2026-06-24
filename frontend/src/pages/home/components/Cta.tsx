import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Award } from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6 },
  },
};

export default function Cta() {
  return (
    <section className="py-16 bg-white relative">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative rounded-[2rem] bg-gradient-to-br from-[#001f54] to-slate-900 text-white p-10 md:p-14 text-center overflow-hidden border border-slate-800 shadow-lg"
        >
          <div className="relative z-10 max-w-3xl mx-auto">
            <Award size={36} className="text-white/80 mx-auto mb-5" />
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 leading-tight tracking-tight text-white">
              Be Part of the IITRAM Legacy
            </h2>
            <p className="text-slate-300 text-xs md:text-sm mb-8 max-w-lg mx-auto leading-relaxed font-medium">
              Join thousands of IITRAM alumni who are shaping industries, building companies, and making an impact across the world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register" className="btn btn-lg btn-primary shadow-md hover:-translate-y-0.5">
                Create Your Profile
                <ArrowRight size={16} />
              </Link>
              <Link to="/alumni" className="btn btn-lg border border-white/20 text-white hover:bg-white/10 transition-colors">
                Explore Alumni
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
