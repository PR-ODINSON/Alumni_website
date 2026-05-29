import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image, Link2, FileText, Send, Heart, MessageCircle, Share2,
  MoreHorizontal, Bookmark, Pin, Megaphone, ThumbsUp, AtSign,
  Loader2, ChevronDown, Smile,
} from 'lucide-react';
import { postApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { formatRelativeTime } from '../../lib/utils';
import Avatar from '../../components/ui/Avatar';
import toast from 'react-hot-toast';

export default function FeedPage() {
  const { user } = useAuthStore();
  const [filter, setFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['feed', filter],
    queryFn: () => postApi.getFeed({ limit: 20, postType: filter !== 'all' ? filter : undefined, filter }),
  });

  const posts = (data as any)?.data?.data || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="relative bg-slate-900 border-b border-slate-800 text-white mb-8 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/community-feed.png" alt="Community Feed" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 iitram-gradient opacity-90" />
          <div className="absolute inset-0 pattern-dots opacity-30 mix-blend-overlay" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-16 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Community Feed</h1>
          <p className="text-iitram-100 text-lg max-w-lg mx-auto">Connect, share, and engage with the IITRAM network</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-8">
        {/* Create Post */}
        <CreatePostBox />

        {/* Feed Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2 mb-6">
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
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="card p-12 text-center">
            <MessageCircle size={40} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((post: any) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CreatePostBox() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('update');
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: any) => postApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      setContent('');
      setOpen(false);
      toast.success('Post published!');
    },
    onError: () => toast.error('Failed to publish post.'),
  });

  return (
    <div className="card-hover p-5 mb-8">
      <div className="flex items-center gap-4 mb-4">
        <Avatar src={user?.avatar} name={`${user?.firstName} ${user?.lastName}`} size="md" />
        <button
          onClick={() => setOpen(true)}
          className="flex-1 text-left px-5 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-sm hover:bg-white hover:shadow-soft hover:border-iitram-200 transition-all"
        >
          Share something with the community...
        </button>
      </div>

      <div className="flex gap-2">
        {[
          { icon: Image, label: 'Photo', color: 'text-emerald-600' },
          { icon: FileText, label: 'Article', color: 'text-iitram-600' },
          { icon: Megaphone, label: 'Achievement', color: 'text-gold-600' },
        ].map(({ icon: Icon, label, color }) => (
          <button
            key={label}
            onClick={() => { setOpen(true); setPostType(label.toLowerCase()); }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors`}
          >
            <Icon size={15} className={color} />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-soft-xl border border-slate-100 w-full max-w-lg"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900">Create Post</h3>
                <div className="flex items-center gap-3">
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600"
                  >
                    <option value="update">Update</option>
                    <option value="achievement">Achievement</option>
                    <option value="article">Article</option>
                    <option value="question">Question</option>
                    <option value="announcement">Announcement</option>
                  </select>
                  <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <Avatar src={user?.avatar} name={`${user?.firstName} ${user?.lastName}`} size="md" />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{user?.firstName} {user?.lastName}</p>
                    <span className="text-xs text-slate-400 capitalize">{postType}</span>
                  </div>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`Share your ${postType === 'achievement' ? 'achievement' : postType === 'article' ? 'article' : 'thoughts'}...`}
                  rows={6}
                  className="w-full text-slate-900 text-sm placeholder-slate-400 resize-none outline-none leading-relaxed"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"><Image size={18} /></button>
                  <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"><AtSign size={18} /></button>
                </div>
                <button
                  onClick={() => createMutation.mutate({ content, postType })}
                  disabled={!content.trim() || createMutation.isPending}
                  className="btn btn-primary btn-sm"
                >
                  {createMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PostCard({ post }: { post: any }) {
  const { user } = useAuthStore();
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  const [liked, setLiked] = useState(user ? post.likes?.includes(user._id) : false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

  const likeMutation = useMutation({
    mutationFn: () => postApi.likePost(post._id),
    onMutate: () => {
      setLiked(!liked);
      setLikesCount((c: number) => liked ? c - 1 : c + 1);
    },
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) => postApi.addComment(post._id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      setComment('');
    },
    onError: () => toast.error('Failed to add comment'),
  });

  const postTypeColors: Record<string, string> = {
    achievement: 'border-gold-400',
    announcement: 'border-red-400',
    job: 'border-accent-500',
    article: 'border-iitram-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card-hover overflow-hidden mb-5 ${postTypeColors[post.postType] ? `border-t-4 ${postTypeColors[post.postType]} border-l-0 border-r-0 border-b-0` : ''}`}
    >
      {/* Post Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <Avatar
              src={post.author?.avatar}
              name={`${post.author?.firstName} ${post.author?.lastName}`}
              size="md"
              verified={post.author?.isVerified}
            />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-900 text-sm">{post.author?.firstName} {post.author?.lastName}</p>
                {post.isAnnouncement && (
                  <span className="badge badge-danger text-2xs">Announcement</span>
                )}
                {post.postType === 'achievement' && (
                  <span className="badge badge-gold text-2xs">Achievement</span>
                )}
              </div>
              <p className="text-xs text-slate-400 capitalize">{post.author?.role} · {formatRelativeTime(post.createdAt)}</p>
            </div>
          </div>
          <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Content */}
        <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">{post.content}</p>

        {/* Media */}
        {post.media?.length > 0 && (
          <div className={`mt-3 grid gap-2 ${post.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {post.media.map((m: any, i: number) => (
              <img key={i} src={m.url} alt={m.caption} className="w-full rounded-xl object-cover max-h-80" />
            ))}
          </div>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.map((tag: string) => (
              <span key={tag} className="text-xs text-iitram-600 hover:underline cursor-pointer">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Engagement stats */}
      <div className="px-5 py-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-50">
        <button onClick={() => setShowComments(!showComments)} className="hover:text-slate-600 transition-colors">
          {post.comments?.length || 0} comments
        </button>
        <span>{post.views} views</span>
      </div>

      {/* Actions */}
      <div className="px-3 py-2 flex items-center gap-1 border-t border-slate-100">
        <button
          onClick={() => likeMutation.mutate()}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${liked ? 'text-iitram-700 bg-iitram-50' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <ThumbsUp size={15} className={liked ? 'fill-iitram-700' : ''} />
          {likesCount > 0 ? likesCount : ''} Like
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all flex-1 justify-center"
        >
          <MessageCircle size={15} />
          Comment
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all flex-1 justify-center">
          <Share2 size={15} />
          Share
        </button>
      </div>

      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-100 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {post.comments?.slice(0, 3).map((c: any) => (
                <div key={c._id} className="flex gap-2.5">
                  <Avatar src={c.author?.avatar} name={`${c.author?.firstName} ${c.author?.lastName}`} size="sm" />
                  <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2">
                    <p className="text-xs font-semibold text-slate-900">{c.author?.firstName} {c.author?.lastName}</p>
                    <p className="text-xs text-slate-700 mt-0.5">{c.content}</p>
                  </div>
                </div>
              ))}

              {user && (
                <div className="flex gap-2.5 mt-3">
                  <Avatar src={user.avatar} name={`${user.firstName} ${user.lastName}`} size="sm" />
                  <div className="flex-1 flex items-center gap-2 bg-slate-50 rounded-xl border border-slate-200 pr-2 focus-within:border-iitram-300 focus-within:ring-2 focus-within:ring-iitram-100 transition-all">
                    <input
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && comment.trim()) commentMutation.mutate(comment); }}
                      placeholder="Write a comment..."
                      className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 outline-none px-3 py-2"
                    />
                    <button
                      onClick={() => comment.trim() && commentMutation.mutate(comment)}
                      disabled={!comment.trim() || commentMutation.isPending}
                      className="p-1.5 rounded-lg text-iitram-600 hover:bg-iitram-100 transition-colors disabled:opacity-40"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PostSkeleton() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex gap-3 mb-4">
        <div className="w-10 h-10 rounded-full skeleton" />
        <div className="flex-1">
          <div className="h-4 skeleton rounded mb-2 w-1/3" />
          <div className="h-3 skeleton rounded w-1/4" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 skeleton rounded" />
        <div className="h-4 skeleton rounded w-5/6" />
        <div className="h-4 skeleton rounded w-4/6" />
      </div>
    </div>
  );
}
