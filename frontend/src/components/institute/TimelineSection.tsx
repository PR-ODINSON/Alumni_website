import { Milestone } from 'lucide-react';
import type { TimelineEvent } from '../../data/iitram/types';
import { SourceAttribution } from './OfficialSource';

interface TimelineSectionProps {
  events: TimelineEvent[];
  title?: string;
}

export function TimelineSection({ events, title = 'Institutional History' }: TimelineSectionProps) {
  return (
    <section aria-labelledby="timeline-heading">
      <div className="flex items-center gap-1.5 mb-4 px-1">
        <Milestone size={16} className="text-brand-500" aria-hidden="true" />
        <h2 id="timeline-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </h2>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200" aria-hidden="true" />

        <ol className="space-y-5">
          {events.map((event) => (
            <li key={`${event.year}-${event.title}`} className="relative pl-12">
              <div
                className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 border-brand-500 bg-white"
                aria-hidden="true"
              />
              <article className="card p-4 sm:p-5">
                <time className="text-brand-600 font-bold text-sm">{event.year}</time>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{event.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">{event.description}</p>
                <SourceAttribution source={event.source} className="mt-3" />
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
