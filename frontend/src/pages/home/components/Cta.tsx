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
    <section className="py-14 sm:py-16 relative" style={{ background: '#DFF3F5' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative rounded-3xl text-white p-8 sm:p-12 md:p-14 text-center overflow-hidden shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #073F7C 0%, #0B6169 50%, #1597A2 100%)',
            border: '3px solid #D6DF8E',
          }}
        >
          <div className="relative z-10 max-w-3xl mx-auto">
            <div
              className="inline-flex items-center gap-3 p-2 rounded-2xl mb-4 shadow-sm"
              style={{ background: '#DFF3F5', border: '2px solid #D6DF8E' }}
            >
              <img
                src="/new/iitram cdr logo.png"
                alt="IITRAM Logo"
                className="w-10 h-10 object-contain bg-white rounded-full p-0.5"
              />
              <div className="w-[1px] h-7 bg-[#1597A2]/30" />
              <img
                src="/new/alumani.jpeg"
                alt="IITRAM Alumni Relations Logo"
                className="w-10 h-10 object-contain bg-white rounded-full p-0.5"
              />
            </div>
            <div className="mb-3">
              <span
                className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider"
                style={{ background: '#D6DF8E', color: '#000000' }}
              >
                ALUMNI RELATIONS, IITRAM
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display mb-3 sm:mb-4 leading-tight tracking-tight text-white">
              Be Part of the IITRAM Legacy
            </h2>
            <p className="text-xs sm:text-sm mb-6 sm:mb-8 max-w-lg mx-auto leading-relaxed font-medium" style={{ color: '#DFF3F5' }}>
              Create your profile to connect with IITRAM alumni and students, explore opportunities, and stay close to the institute.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
              <Link
                to="/register"
                className="btn btn-lg w-full sm:w-auto shadow-md font-extrabold"
                style={{ background: '#D6DF8E', color: '#000000', border: '1px solid #c3cf6d' }}
              >
                Create Your Profile
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/directory"
                className="btn btn-lg border text-white hover:bg-white/15 w-full sm:w-auto transition-colors"
                style={{ borderColor: '#DFF3F5', background: 'rgba(223,243,245,0.12)' }}
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
