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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-0 md:p-6 lg:p-8 font-sans">
      {/* Main Professional Split Card */}
      <div className="w-full max-w-6xl bg-white border border-slate-200 shadow-xl rounded-none md:rounded-2xl overflow-hidden grid lg:grid-cols-12 min-h-screen md:min-h-[700px] lg:h-[760px] relative z-10">
        
        {/* Left Side - Solid Deep Navy Sidebar */}
        <div className="hidden lg:flex lg:col-span-5 bg-[#001f54] text-white relative flex-col justify-between p-10 xl:p-12 overflow-y-auto scrollbar-none">
          <div className="relative z-10 flex flex-col h-full justify-between gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <GraduationCap size={20} className="text-white" />
              </div>
              <div>
                <span className="text-lg font-bold font-display text-white tracking-wide">IITRAM Alumni</span>
                <p className="text-[10px] text-slate-300 font-semibold">Career & Community</p>
              </div>
            </Link>

            {/* Middle Section */}
            <div className="my-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/15 rounded-full mb-4">
                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
                <span className="text-slate-200 text-[10px] font-bold tracking-wide">IITRAM Ahmedabad</span>
              </div>

              <h1 className="text-3xl xl:text-4xl font-bold font-display leading-tight text-white mb-4">
                Where Alumni<br />
                <span className="text-white font-extrabold">
                  Shape Futures
                </span>
              </h1>

              <p className="text-slate-300 text-xs leading-relaxed max-w-xs mb-8">
                Connect with graduates, find mentors, and contribute to the legacy.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                {stats.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                      <Icon size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-white leading-none font-display">{value}</p>
                      <p className="text-[9px] text-slate-300 mt-1 font-semibold">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-slate-200 text-xs leading-relaxed italic">
                "The IITRAM Alumni Network helped me find my first job abroad and connected me with a mentor who transformed my career trajectory."
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-extrabold text-white">RS</div>
                <div>
                  <p className="text-white text-[11px] font-bold leading-none">Rahul Sharma</p>
                  <p className="text-slate-400 text-[9px] mt-0.5 font-semibold">B.Tech Civil 2019 · Google</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Card Area */}
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-between overflow-y-auto scrollbar-none h-full bg-white">
          <div className="flex-1 flex flex-col justify-center py-5 px-6 sm:px-10">
            <div className="w-full max-w-md mx-auto">
              {/* Mobile logo */}
              <Link to="/" className="flex lg:hidden items-center gap-2.5 mb-4 justify-center">
                <div className="w-8 h-8 rounded-lg bg-[#001f54] flex items-center justify-center shadow-sm">
                  <GraduationCap size={16} className="text-white" />
                </div>
                <span className="font-bold font-display text-slate-900">IITRAM Alumni</span>
              </Link>

              <Outlet />
            </div>
          </div>

          <div className="pb-3 text-center text-[10px] text-slate-400 font-semibold">
            © {new Date().getFullYear()} IITRAM Alumni Platform · Ahmedabad, India
          </div>
        </div>

      </div>
    </div>
  );
}
