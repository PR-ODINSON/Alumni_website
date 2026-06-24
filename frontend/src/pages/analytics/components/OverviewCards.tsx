import { Users, GraduationCap, Briefcase, Calendar, Target, Award } from 'lucide-react';

interface OverviewCardsProps {
  overview: any;
}

export default function OverviewCards({ overview }: OverviewCardsProps) {
  const cards = [
    { icon: Users, label: 'Total Alumni', value: overview?.totalAlumni, color: 'text-slate-700', bg: 'bg-slate-100' },
    { icon: GraduationCap, label: 'Students', value: overview?.totalStudents, color: 'text-emerald-700', bg: 'bg-emerald-50 border border-emerald-100' },
    { icon: Briefcase, label: 'Active Jobs', value: overview?.totalJobs, color: 'text-[#0169FC]', bg: 'bg-blue-50 border border-blue-100' },
    { icon: Calendar, label: 'Upcoming Events', value: overview?.totalEvents, color: 'text-purple-700', bg: 'bg-purple-50 border border-purple-100' },
    { icon: Target, label: 'Mentorships', value: overview?.activeMentorships, color: 'text-amber-700', bg: 'bg-amber-50 border border-amber-100' },
    { icon: Award, label: 'Verified Alumni', value: overview?.verifiedAlumni, color: 'text-rose-700', bg: 'bg-rose-50 border border-rose-100' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-4 font-sans text-slate-800">
      {cards.map(({ icon: Icon, label, value, color, bg }) => (
        <div
          key={label}
          className="bg-white border border-slate-200 shadow-xs hover:border-[#0169FC]/30 transition-all duration-150 rounded-xl p-4 flex flex-col justify-between"
        >
          <div>
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon size={14} className={color} />
            </div>
            <p className="text-xl font-bold font-display text-slate-900 leading-none">
              {value !== undefined ? value.toLocaleString() : '—'}
            </p>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2.5 leading-none">{label}</p>
        </div>
      ))}
    </div>
  );
}
