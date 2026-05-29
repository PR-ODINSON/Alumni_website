import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Eye, Star, Award, ArrowRight, Search, BookOpen, Quote } from 'lucide-react';
import { successStoryApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { formatDate, truncate } from '../../lib/utils';

const CATEGORIES = ['all', 'career', 'entrepreneurship', 'research', 'social-impact', 'leadership', 'arts', 'sports'];

export default function SuccessStoriesPage() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['stories', category, search],
    queryFn: () => successStoryApi.getAll({
      category: category !== 'all' ? category : undefined,
      search: search || undefined,
      limit: 20,
    }),
  });

  const stories = data?.data?.data || [];
  const featured = stories.filter((s: any) => s.isFeatured);
  const regular = stories.filter((s: any) => !s.isFeatured);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Editorial Header */}
      <div className="relative bg-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/success-stories.png" alt="Success Stories" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 premium-gradient opacity-90" />
        </div>
        <div className="absolute inset-0 pattern-dots opacity-20 mix-blend-overlay" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-400 text-xs font-medium mb-6">
              <Award size={12} /> IITRAM Legacy Archive
            </span>
            <h1 className="text-5xl font-bold mb-4 font-serif">Success Stories</h1>
            <p className="text-slate-300 text-lg max-w-xl mx-auto">
              Journeys of IITRAM graduates who transformed industries, built companies, and made an impact across the world.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stories..."
              className="input pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-shrink-0 capitalize ${category === cat ? 'filter-pill-active' : 'filter-pill'}`}
              >
                {cat === 'all' ? 'All Stories' : cat.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Stories - Magazine Layout */}
        {featured.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Featured</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Hero story */}
              <div className="lg:col-span-3">
                <FeaturedStoryCard story={featured[0]} size="large" />
              </div>
              {/* Side stories */}
              {featured.slice(1, 3).length > 0 && (
                <div className="lg:col-span-2 space-y-6">
                  {featured.slice(1, 3).map((story: any) => (
                    <FeaturedStoryCard key={story._id} story={story} size="small" />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Regular Stories Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-52 skeleton rounded-2xl mb-4" />
                <div className="h-5 skeleton rounded mb-2 w-3/4" />
                <div className="h-4 skeleton rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {regular.length > 0 && (
              <>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1 bg-slate-100" />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">All Stories</span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regular.map((story: any, i: number) => (
                    <StoryCard key={story._id} story={story} index={i} />
                  ))}
                </div>
              </>
            )}

            {stories.length === 0 && (
              <div className="text-center py-20">
                <BookOpen size={40} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No stories found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FeaturedStoryCard({ story, size }: { story: any; size: 'large' | 'small' }) {
  if (size === 'large') {
    return (
      <Link to={`/success-stories/${story._id}`} className="group block">
        <div className="relative h-72 rounded-2xl overflow-hidden mb-5">
          {story.coverImage ? (
            <img src={story.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-iitram-900 to-iitram-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <span className="badge bg-gold-500 text-white border-0 capitalize w-fit mb-3">{story.category}</span>
            <h2 className="text-2xl font-bold text-white font-serif leading-tight group-hover:text-iitram-200 transition-colors">
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
    <Link to={`/success-stories/${story._id}`} className="group flex gap-4">
      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
        {story.coverImage ? (
          <img src={story.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-iitram-700 to-iitram-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className="badge badge-gold capitalize text-2xs mb-1">{story.category}</span>
        <h3 className="font-semibold text-slate-900 text-sm leading-tight group-hover:text-iitram-700 transition-colors line-clamp-2 mt-1">
          {story.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1">{story.alumni?.firstName} {story.alumni?.lastName}</p>
      </div>
    </Link>
  );
}

function StoryCard({ story, index }: { story: any; index: number }) {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
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
        <h3 className="font-bold text-slate-900 text-base leading-tight mb-2 group-hover:text-iitram-700 transition-colors">
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
        <Link to={`/success-stories/${story._id}`} className="ml-auto flex items-center gap-1 text-iitram-600 hover:text-iitram-700">
          Read more <ArrowRight size={12} />
        </Link>
      </div>
    </motion.div>
  );
}
