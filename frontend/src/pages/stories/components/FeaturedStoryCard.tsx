import { Link } from 'react-router-dom';
import { Eye, Heart } from 'lucide-react';
import { formatDate, truncate } from '../../../lib/utils';

export default function FeaturedStoryCard({ story, size }: { story: any; size: 'large' | 'small' }) {
  if (size === 'large') {
    return (
      <Link to={`/success-stories/${story._id}`} className="group block">
        <div className="relative h-72 rounded-2xl overflow-hidden mb-5 border border-white/40 shadow-soft">
          {story.coverImage ? (
            <img src={story.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-900 to-brand-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <span className="badge bg-gold-500 text-white border-0 capitalize w-fit mb-3">{story.category}</span>
            <h2 className="text-2xl font-bold text-white font-serif leading-tight group-hover:text-brand-200 transition-colors">
              {story.title}
            </h2>
            {story.subtitle && <p className="text-slate-300 text-sm mt-2 line-clamp-2">{story.subtitle}</p>}
          </div>
        </div>
        {story.quote && (
          <blockquote className="border-l-4 border-gold-400 pl-4 mb-4">
            <p className="text-slate-600 italic text-sm">"{truncate(story.quote, 120)}"</p>
          </blockquote>
        )}
        <div className="flex items-center gap-3">
          <img
            src={story.alumni?.avatar || `https://ui-avatars.com/api/?name=${story.alumni?.firstName}&background=1d2f88&color=fff`}
            className="w-9 h-9 rounded-full object-cover"
            alt=""
          />
          <div>
            <p className="font-semibold text-slate-900 text-sm">{story.alumni?.firstName} {story.alumni?.lastName}</p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>{formatDate(story.publishedAt || story.createdAt)}</span>
              <span className="flex items-center gap-1"><Eye size={10} />{story.views}</span>
              <span className="flex items-center gap-1"><Heart size={10} />{story.likes?.length}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/success-stories/${story._id}`} className="group flex gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_15px_40px_rgba(1,105,252,0.04)] hover:border-[#0169FC]/20 hover:-translate-y-1 transition-all duration-300">
      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
        {story.coverImage ? (
          <img src={story.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-700 to-brand-500" />
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <span className="badge badge-gold capitalize text-2xs mb-1 w-fit">{story.category}</span>
        <h3 className="font-semibold text-slate-900 text-sm leading-tight group-hover:text-brand-600 transition-colors line-clamp-2 mt-1">
          {story.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1">{story.alumni?.firstName} {story.alumni?.lastName}</p>
      </div>
    </Link>
  );
}
