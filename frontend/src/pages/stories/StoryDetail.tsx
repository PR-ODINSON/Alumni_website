import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, Eye, ChevronLeft, Award, ArrowRight, GraduationCap, ExternalLink, Quote } from 'lucide-react';
import { successStoryApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { formatDate } from '../../lib/utils';
import { useState } from 'react';

export default function StoryDetailPage() {
  const { storyId } = useParams<{ storyId: string }>();
  const { isAuthenticated } = useAuthStore();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['story', storyId],
    queryFn: () => successStoryApi.getOne(storyId!),
  });

  // Initialize likes from data
  const storyData = (data as any)?.data?.data;
  if (storyData && likes === 0 && storyData.likes?.length > 0) {
    setLikes(storyData.likes.length);
  }

  const likeMutation = useMutation({
    mutationFn: () => successStoryApi.like(storyId!),
    onMutate: () => { setLiked(!liked); setLikes(l => liked ? l - 1 : l + 1); },
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-64 skeleton rounded-2xl mb-8" />
        <div className="space-y-3">
          <div className="h-8 skeleton rounded w-3/4" />
          <div className="h-4 skeleton rounded w-1/2" />
        </div>
      </div>
    );
  }

  const story = (data as any)?.data?.data;
  if (!story) return <div className="text-center py-24 text-slate-400">Story not found</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-80 sm:h-96 overflow-hidden">
        {story.coverImage ? (
          <img src={story.coverImage} className="w-full h-full object-cover" alt="" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-iitram-900 to-iitram-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-3xl">
          <span className="badge bg-gold-500 text-white border-0 capitalize mb-3">{story.category.replace('-', ' ')}</span>
          <h1 className="text-4xl font-bold text-white font-serif leading-tight">{story.title}</h1>
          {story.subtitle && <p className="text-slate-300 text-lg mt-2">{story.subtitle}</p>}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-10">
        <Link to="/success-stories" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-8">
          <ChevronLeft size={16} /> All Stories
        </Link>

        {/* Author info */}
        <div className="flex items-center justify-between gap-4 mb-10 pb-8 border-b border-slate-100">
          <Link to={`/alumni/${story.alumni?._id}`} className="flex items-center gap-4 group">
            <img
              src={story.alumni?.avatar || `https://ui-avatars.com/api/?name=${story.alumni?.firstName}&background=1d2f88&color=fff`}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100"
              alt=""
            />
            <div>
              <p className="font-semibold text-slate-900 group-hover:text-iitram-700 transition-colors">
                {story.alumni?.firstName} {story.alumni?.lastName}
              </p>
              <p className="text-sm text-slate-500">{story.alumni?.bio}</p>
              <p className="text-xs text-slate-400 mt-0.5">{formatDate(story.publishedAt || story.createdAt)}</p>
            </div>
          </Link>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <button
              onClick={() => isAuthenticated && likeMutation.mutate()}
              className={`flex items-center gap-1.5 transition-colors ${liked ? 'text-red-500' : 'hover:text-red-400'}`}
            >
              <Heart size={16} className={liked ? 'fill-current' : ''} />
              {likes}
            </button>
            <span className="flex items-center gap-1.5"><Eye size={16} />{story.views}</span>
          </div>
        </div>

        {/* Quote */}
        {story.quote && (
          <blockquote className="border-l-4 border-gold-400 pl-6 py-2 my-8 bg-gold-50 rounded-r-xl">
            <Quote size={24} className="text-gold-400 mb-2" />
            <p className="text-xl font-medium text-slate-800 italic leading-relaxed">{story.quote}</p>
          </blockquote>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-10 text-slate-700 leading-relaxed">
          {story.content.split('\n').map((para: string, i: number) => (
            para ? <p key={i} className="mb-4">{para}</p> : null
          ))}
        </div>

        {/* Highlights */}
        {story.highlights?.length > 0 && (
          <div className="my-10 p-6 bg-iitram-50 rounded-2xl border border-iitram-100">
            <h3 className="font-bold text-iitram-900 mb-4 flex items-center gap-2">
              <Award size={18} className="text-iitram-600" /> Key Highlights
            </h3>
            <ul className="space-y-2">
              {story.highlights.map((h: string, i: number) => (
                <li key={i} className="flex items-center gap-3 text-sm text-iitram-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-iitram-500 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Timeline */}
        {story.timeline?.length > 0 && (
          <div className="my-10">
            <h3 className="font-bold text-slate-900 text-xl mb-6">Journey Timeline</h3>
            <div className="relative pl-8">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-200" />
              {story.timeline.map((item: any, i: number) => (
                <div key={i} className="relative mb-6">
                  <div className="absolute -left-5 top-1 w-3 h-3 rounded-full border-2 border-iitram-600 bg-white" />
                  <span className="text-iitram-600 font-bold text-sm">{item.year}</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{item.milestone}</p>
                  {item.description && <p className="text-sm text-slate-500 mt-0.5">{item.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {story.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-slate-100">
            {story.tags.map((tag: string) => (
              <span key={tag} className="text-sm px-3 py-1 bg-slate-100 text-slate-600 rounded-full">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
