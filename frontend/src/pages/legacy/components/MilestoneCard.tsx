import type { LucideIcon } from 'lucide-react';

interface Milestone {
  year: string;
  title: string;
  desc: string;
  icon: LucideIcon;
}

interface MilestoneCardProps {
  milestone: Milestone;
  index: number;
}

export default function MilestoneCard({ milestone }: MilestoneCardProps) {
  return (
    <div className="relative pl-12 md:pl-14 font-sans text-slate-800">
      {/* Connector year marker - positioned exactly at left-0 to align its center (16px) with left-4 (16px) vertical line */}
      <div className="absolute left-0 top-1 w-8 h-8 bg-[#0169FC] rounded-full flex items-center justify-center border-4 border-slate-50 shadow-sm z-10">
        <milestone.icon size={11} className="text-white" />
      </div>

      <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-4.5 hover:border-brand-500/25 transition-all duration-200">
        <span className="bg-slate-50 border border-slate-200 text-[#0169FC] text-[10px] px-2 py-0.5 rounded-full font-bold mb-2 inline-block">
          {milestone.year}
        </span>
        <h3 className="font-bold text-slate-900 text-xs font-display">{milestone.title}</h3>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">{milestone.desc}</p>
      </div>
    </div>
  );
}
