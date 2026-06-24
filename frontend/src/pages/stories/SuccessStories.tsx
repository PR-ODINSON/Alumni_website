import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Eye, Star, Award, ArrowRight, Search, BookOpen, Quote } from 'lucide-react';
import { successStoryApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { formatDate, truncate } from '../../lib/utils';

import StoryCard from './components/StoryCard';
import FeaturedStoryCard from './components/FeaturedStoryCard';

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
    <div className="pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-brand-950 to-slate-950 text-white py-12 px-6 rounded-3xl mt-4 mb-8 shadow-soft-xl overflow-hidden border border-brand-900/50">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-500/20 border border-brand-500/30 rounded-full text-brand-300 text-xs font-semibold mb-4">
              <Award size={12} /> IITRAM Legacy Archive
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 font-serif tracking-tight">Success Stories</h1>
            <p className="text-slate-350 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              Journeys of IITRAM graduates who transformed industries, built companies, and made an impact across the world.
            </p>
          </motion.div>
        </div>
      </div>

      <div>
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


