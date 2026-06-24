import { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MessageCircle, Loader2 } from 'lucide-react';
import { postApi } from '../../lib/api';
import CreatePostBox from './components/CreatePostBox';
import { PostCard, PostSkeleton } from './components/PostCard';

export default function FeedPage() {
  const [filter, setFilter] = useState<string>('all');
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['feed', filter],
    queryFn: async ({ pageParam }) => {
      const res = await postApi.getFeed({
        limit: 10,
        postType: filter !== 'all' ? filter : undefined,
        filter,
        cursor: pageParam || undefined,
      });
      return res.data;
    },
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage: any) => lastPage.nextCursor || undefined,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const posts = data ? data.pages.flatMap((page: any) => page.data) : [];

  return (
    <div className="pb-12 max-w-2xl mx-auto px-4 mt-4">
      {/* Header */}
      <div className="relative bg-white border border-slate-200 p-6 rounded-2xl shadow-xs mb-5 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">Community Feed</h1>
          <p className="text-slate-500 text-xs mt-1 font-semibold">Connect, share, and engage with the IITRAM alumni and student network</p>
        </div>
      </div>

      <div>
        {/* Create Post */}
        <CreatePostBox />

        {/* Feed Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2 mb-4">
          {[
            { label: 'All', value: 'all' },
            { label: 'Announcements', value: 'announcements' },
            { label: 'Achievements', value: 'achievement' },
            { label: 'Jobs', value: 'job' },
            { label: 'Events', value: 'event' },
            { label: 'Articles', value: 'article' },
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={filter === value ? 'filter-pill-active' : 'filter-pill'}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Posts */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <MessageCircle size={40} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          <div>
            <div className="space-y-4">
              {posts.map((post: any) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Load More Observer Anchor */}
            {hasNextPage && (
              <div ref={loadMoreRef} className="flex justify-center py-6">
                {isFetchingNextPage ? (
                  <Loader2 className="animate-spin text-brand-600" size={20} />
                ) : (
                  <span className="text-xs text-slate-400 font-semibold">Loading more posts...</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
