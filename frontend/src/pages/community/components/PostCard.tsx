import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react';
import { postApi } from '../../../lib/api';
import { useAuthStore } from '../../../stores/authStore';
import { formatRelativeTime } from '../../../lib/utils';
import Avatar from '../../../components/ui/Avatar';
import toast from 'react-hot-toast';

export function PostCard({ post }: { post: any }) {
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

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden mb-4 font-sans text-slate-800">
      {/* Post Header */}
      <div className="p-4 pb-2.5">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <Avatar
              src={post.author?.avatar}
              name={`${post.author?.firstName} ${post.author?.lastName}`}
              size="sm"
              verified={post.author?.isVerified}
            />
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="font-semibold text-slate-900 text-xs hover:underline cursor-pointer">
                  {post.author?.firstName} {post.author?.lastName}
                </p>
                {post.isAnnouncement && (
                  <span className="bg-red-50 text-red-700 border border-red-100 text-[9px] px-1.5 py-0.2 rounded-md font-bold">Announcement</span>
                )}
                {post.postType === 'achievement' && (
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] px-1.5 py-0.2 rounded-md font-bold">Achievement</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 font-semibold capitalize">
                {post.author?.role} · {formatRelativeTime(post.createdAt)}
              </p>
            </div>
          </div>
          <button className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-650 transition-colors">
            <MoreHorizontal size={14} />
          </button>
        </div>

        {/* Content */}
        <p className="text-slate-800 text-xs leading-relaxed whitespace-pre-line mt-1.5 px-0.5">{post.content}</p>

        {/* Media */}
        {post.media?.length > 0 && (
          <div className={`mt-2.5 grid gap-1.5 rounded-lg overflow-hidden border border-slate-100 ${post.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {post.media.map((m: any, i: number) => (
              <img key={i} src={m.url} alt={m.caption} className="w-full rounded-md object-cover max-h-72" />
            ))}
          </div>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2 px-0.5">
            {post.tags.map((tag: string) => (
              <span key={tag} className="text-[11px] text-[#0169FC] hover:underline cursor-pointer font-bold">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Engagement stats */}
      <div className="px-4 py-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 font-semibold">
        <button onClick={() => setShowComments(!showComments)} className="hover:underline hover:text-slate-700 transition-colors">
          {post.comments?.length || 0} comments
        </button>
        <span>{post.views} views</span>
      </div>

      {/* Actions */}
      <div className="px-2 py-1 flex items-center justify-between border-t border-slate-100 bg-white">
        <button
          onClick={() => likeMutation.mutate()}
          className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex-1 hover:bg-slate-50 cursor-pointer ${liked ? 'text-[#0169FC]' : 'text-slate-500'}`}
        >
          <ThumbsUp size={14} className={liked ? 'fill-[#0169FC] stroke-[#0169FC]' : ''} />
          <span>Like</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all flex-1 cursor-pointer"
        >
          <MessageCircle size={14} />
          <span>Comment</span>
        </button>
        <button
          className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all flex-1 cursor-pointer"
        >
          <Share2 size={14} />
          <span>Share</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="border-t border-slate-100 bg-slate-50/50">
          <div className="p-3.5 space-y-2.5">
            {post.comments?.slice(0, 3).map((c: any) => (
              <div key={c._id} className="flex gap-2">
                <Avatar src={c.author?.avatar} name={`${c.author?.firstName} ${c.author?.lastName}`} size="sm" />
                <div className="flex-1 bg-white rounded-xl px-3 py-1.5 border border-slate-200/60 shadow-2xs">
                  <p className="text-[11px] font-bold text-slate-900">{c.author?.firstName} {c.author?.lastName}</p>
                  <p className="text-[11px] text-slate-700 mt-0.5 leading-normal">{c.content}</p>
                </div>
              </div>
            ))}

            {user && (
              <div className="flex gap-2 mt-2">
                <Avatar src={user.avatar} name={`${user.firstName} ${user.lastName}`} size="sm" />
                <div className="flex-1 flex items-center gap-1.5 bg-white rounded-xl border border-slate-200 pr-1.5 focus-within:border-brand-500/35 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                  <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && comment.trim()) commentMutation.mutate(comment); }}
                    placeholder="Write a comment..."
                    className="flex-1 bg-transparent text-[11px] text-slate-900 placeholder-slate-400 outline-none px-3 py-1.5"
                  />
                  <button
                    onClick={() => comment.trim() && commentMutation.mutate(comment)}
                    disabled={!comment.trim() || commentMutation.isPending}
                    className="p-1 rounded-lg text-brand-600 hover:bg-brand-50 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <Send size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { PostSkeleton } from './PostSkeleton';
