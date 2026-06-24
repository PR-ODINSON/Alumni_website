import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Eye, BookOpen, ArrowRight } from 'lucide-react';
import { successStoryApi } from '../../../lib/api';
import { useAuthStore } from '../../../stores/authStore';
import { formatDate } from '../../../lib/utils';

export default function StoryCard({ story, index }: { story: any; index: number }) {
  const { isAuthenticated } = useAuthStore();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(story.likes?.length || 0);

  const likeMutation = useMutation({
    mutationFn: () => successStoryApi.like(story._id),
    onMutate: () => { setLiked(!liked); setLikes((l: number) => liked ? l - 1 : l + 1); },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-hover p-4 group"
    >
      <Link to={`/success-stories/${story._id}`}>
        <div className="relative h-48 rounded-xl overflow-hidden mb-4">
          {story.coverImage ? (
            <img src={story.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center">
              <BookOpen size={32} className="text-white/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <span className="badge bg-white/90 text-slate-700 border-0 capitalize text-xs">{story.category.replace('-', ' ')}</span>
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-2 mb-2">
        <img
          src={story.alumni?.avatar || `https://ui-avatars.com/api/?name=${story.alumni?.firstName}&background=1d2f88&color=fff`}
          className="w-7 h-7 rounded-full object-cover"
          alt=""
        />
        <p className="text-xs text-slate-500">{story.alumni?.firstName} {story.alumni?.lastName}</p>
        <span className="text-slate-300">·</span>
        <p className="text-xs text-slate-400">{formatDate(story.publishedAt || story.createdAt, { month: 'short', year: 'numeric' })}</p>
      </div>

      <Link to={`/success-stories/${story._id}`}>
        <h3 className="font-bold text-slate-900 text-base leading-tight mb-2 group-hover:text-brand-600 transition-colors">
          {story.title}
        </h3>
        {story.subtitle && (
          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{story.subtitle}</p>
        )}
      </Link>

      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
        <button
          onClick={() => isAuthenticated && likeMutation.mutate()}
          className={`flex items-center gap-1 hover:text-red-500 transition-colors ${liked ? 'text-red-500' : ''}`}
        >
          <Heart size={13} className={liked ? 'fill-current' : ''} />
          {likes}
        </button>
        <span className="flex items-center gap-1"><Eye size={13} />{story.views}</span>
        <Link to={`/success-stories/${story._id}`} className="ml-auto flex items-center gap-1 text-brand-600 hover:text-brand-700">
          Read more <ArrowRight size={12} />
        </Link>
      </div>
    </motion.div>
  );
}
