import { ExternalLink, ShieldCheck } from 'lucide-react';
import type { OfficialSource } from '../../data/iitram/types';

interface OfficialSourceBadgeProps {
  className?: string;
}

export function OfficialSourceBadge({ className = '' }: OfficialSourceBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70 ${className}`}
    >
      <ShieldCheck size={12} aria-hidden="true" />
      Official IITRAM Source
    </span>
  );
}

interface SourceAttributionProps {
  source: OfficialSource;
  className?: string;
}

export function SourceAttribution({ source, className = '' }: SourceAttributionProps) {
  return (
    <p className={`text-[10px] text-slate-400 font-medium ${className}`}>
      Source:{' '}
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-600 hover:text-brand-700 hover:underline inline-flex items-center gap-0.5"
      >
        {source.name}
        <ExternalLink size={10} aria-hidden="true" />
      </a>
      {' · '}Verified {source.verifiedAt}
    </p>
  );
}
