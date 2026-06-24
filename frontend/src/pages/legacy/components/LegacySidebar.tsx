import { Link } from 'react-router-dom';
import { ChevronRight, Users, Award, BookOpen, Rocket, TrendingUp } from 'lucide-react';

interface DistinguishedAlumnus {
  name: string;
  batch: string;
  dept: string;
  achievement: string;
  avatar: string | null;
}

interface LegacySidebarProps {
  distinguished: DistinguishedAlumnus[];
}

export default function LegacySidebar({ distinguished }: LegacySidebarProps) {
  const quickLinks = [
    { label: 'Alumni Directory', to: '/alumni', icon: Users },
    { label: 'Success Stories', to: '/stories', icon: Award },
    { label: 'Research Projects', to: '/research', icon: BookOpen },
    { label: 'Startup Ecosystem', to: '/startups', icon: Rocket },
    { label: 'Analytics Dashboard', to: '/analytics', icon: TrendingUp },
  ];

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* Distinguished Alumni Highlights */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-4">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Distinguished Highlights</h2>
          <Link to="/alumni" className="text-[10px] font-bold text-[#0169FC] hover:underline">View all</Link>
        </div>
        <div className="space-y-2.5">
          {distinguished.map((alumni) => (
            <div
              key={alumni.name}
              className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
            >
              <div className="w-8 h-8 bg-[#0169FC]/10 text-[#0169FC] rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                {alumni.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900 text-xs truncate leading-tight">{alumni.name}</p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">{alumni.dept}, Batch {alumni.batch}</p>
                <p className="text-[10px] font-bold text-[#0169FC] mt-0.5 truncate">{alumni.achievement}</p>
              </div>
            </div>
          ))}
        </div>
        <Link
          to="/stories"
          className="mt-3.5 inline-flex items-center gap-1 text-[11px] text-[#0169FC] hover:underline font-bold px-0.5"
        >
          Read Success Stories <ChevronRight size={11} />
        </Link>
      </div>

      {/* Quick Navigation Links */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3 px-0.5">Explore More</h3>
        <div className="space-y-0.5">
          {quickLinks.map(link => (
            <Link
              key={link.label}
              to={link.to}
              className="flex items-center gap-2.5 text-xs text-slate-650 hover:text-[#0169FC] py-2 px-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all font-semibold cursor-pointer"
            >
              <link.icon size={14} className="text-slate-400 shrink-0" />
              <span>{link.label}</span>
              <ChevronRight size={11} className="ml-auto text-slate-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
