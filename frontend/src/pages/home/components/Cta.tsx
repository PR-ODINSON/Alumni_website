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
    <section className="py-14 sm:py-16 bg-slate-50 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative rounded-3xl text-white p-8 sm:p-12 md:p-14 text-center overflow-hidden shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #073F7C 0%, #0B6169 50%, #1597A2 100%)',
          }}
        >
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white text-[11px] font-bold mb-4 uppercase tracking-wider">
              <Award size={13} />
              <span>Join the Community</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display mb-3 sm:mb-4 leading-tight tracking-tight text-white">
              Be Part of the IITRAM Legacy
            </h2>
            <p className="text-xs sm:text-sm text-white/85 mb-6 sm:mb-8 max-w-lg mx-auto leading-relaxed font-medium">
              Create your profile to connect with IITRAM alumni and students, explore opportunities, and stay close to the institute.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
              <Link
                to="/register"
                className="btn bg-white text-[#073F7C] hover:bg-slate-50 btn-lg w-full sm:w-auto shadow-md font-bold"
              >
                Create Your Profile
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/directory"
                className="btn btn-lg border border-white/30 bg-white/10 text-white hover:bg-white/20 w-full sm:w-auto transition-colors"
              >
                Explore Network
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
