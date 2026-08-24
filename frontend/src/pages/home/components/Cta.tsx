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
    <section className="py-14 sm:py-16 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-to-br from-[#001f54] to-slate-900 text-white p-8 sm:p-12 md:p-14 text-center overflow-hidden border border-slate-800 shadow-md"
        >
          <div className="relative z-10 max-w-3xl mx-auto">
            <Award size={36} className="text-white/80 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display mb-3 sm:mb-4 leading-tight tracking-tight text-white">
              Be Part of the IITRAM Legacy
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mb-6 sm:mb-8 max-w-lg mx-auto leading-relaxed font-medium">
              Join thousands of IITRAM alumni who are shaping industries, building companies, and making an impact across the world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
              <Link to="/register" className="btn btn-lg btn-primary w-full sm:w-auto shadow-sm">
                Create Your Profile
                <ArrowRight size={15} />
              </Link>
              <Link to="/directory" className="btn btn-lg border border-white/20 text-white hover:bg-white/10 w-full sm:w-auto transition-colors">
                Explore Network
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
