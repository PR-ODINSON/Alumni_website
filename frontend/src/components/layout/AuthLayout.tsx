import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Users, Briefcase, Award } from 'lucide-react';

const stats = [
  { icon: Users, value: '5,000+', label: 'Alumni Network' },
  { icon: Briefcase, value: '2,000+', label: 'Jobs Posted' },
  { icon: Award, value: '500+', label: 'Success Stories' },
  { icon: GraduationCap, value: '10+', label: 'Batches' },
];

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-slate-900 via-iitram-950 to-slate-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(52, 112, 244, 0.3) 0%, transparent 50%), 
                              radial-gradient(circle at 80% 20%, rgba(234, 179, 8, 0.2) 0%, transparent 50%),
                              radial-gradient(circle at 50% 80%, rgba(52, 112, 244, 0.2) 0%, transparent 50%)`
          }} />
          <div className="absolute inset-0 pattern-grid opacity-30" />
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-iitram-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col p-12 xl:p-16 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-auto">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">IITRAM Alumni</span>
              <p className="text-xs text-slate-400">Career & Community Platform</p>
            </div>
          </Link>

          {/* Main content */}
          <div className="my-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-500/10 border border-gold-500/20 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />
                <span className="text-gold-400 text-xs font-medium">Institute of Infrastructure, Technology, Research and Management</span>
              </div>

              <h1 className="text-4xl xl:text-5xl font-bold leading-tight text-white mb-6">
                Where Alumni<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-iitram-300 to-gold-400">
                  Shape Futures
                </span>
              </h1>

              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                Connect with fellow graduates, discover opportunities, find mentors, and contribute to the IITRAM legacy.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="grid grid-cols-2 gap-4 mt-10"
            >
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-lg bg-iitram-500/20 flex items-center justify-center">
                    <Icon size={18} className="text-iitram-300" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white leading-none">{value}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm"
          >
            <p className="text-slate-300 text-sm leading-relaxed italic">
              "The IITRAM Alumni Network helped me find my first job abroad and connected me with a mentor who transformed my career trajectory."
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-iitram-400 to-gold-500" />
              <div>
                <p className="text-white text-xs font-semibold">Rahul Sharma</p>
                <p className="text-slate-500 text-2xs">B.Tech Civil 2019 · Software Engineer, Google</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col bg-white">
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 xl:px-16 py-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Mobile logo */}
            <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-iitram-700 to-iitram-500 flex items-center justify-center">
                <GraduationCap size={16} className="text-white" />
              </div>
              <span className="font-bold text-slate-900">IITRAM Alumni</span>
            </Link>

            <Outlet />
          </motion.div>
        </div>

        <div className="px-6 sm:px-12 py-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} IITRAM Alumni Platform · Ahmedabad, India
        </div>
      </div>
    </div>
  );
}
