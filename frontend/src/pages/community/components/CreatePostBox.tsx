import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, FileText, Megaphone, Send, AtSign, Loader2 } from 'lucide-react';
import { postApi } from '../../../lib/api';
import { useAuthStore } from '../../../stores/authStore';
import Avatar from '../../../components/ui/Avatar';
import toast from 'react-hot-toast';

export default function CreatePostBox() {
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
    <div className="bg-white border border-slate-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] p-4 mb-4 font-sans text-slate-850 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3">
        <Avatar src={user?.avatar} name={`${user?.firstName} ${user?.lastName}`} size="sm" />
        <button
          onClick={() => setOpen(true)}
          className="flex-1 text-left px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-400 text-xs hover:bg-slate-100/60 transition-all cursor-pointer font-medium"
        >
          Share something with the community...
        </button>
      </div>

      <div className="flex gap-1 mt-3 pt-3 border-t border-slate-100">
        {[
          { icon: Image, label: 'Photo', color: 'text-emerald-650' },
          { icon: FileText, label: 'Article', color: 'text-brand-500' },
          { icon: Megaphone, label: 'Achievement', color: 'text-amber-600' },
        ].map(({ icon: Icon, label, color }) => (
          <button
            key={label}
            onClick={() => { setOpen(true); setPostType(label.toLowerCase()); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-850 transition-colors cursor-pointer"
          >
            <Icon size={14} className={color} />
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-soft-xl border border-slate-200 w-full max-w-lg overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150">
                <h3 className="font-semibold text-slate-900">Create Post</h3>
                <div className="flex items-center gap-3">
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value)}
                    className="text-xs border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-650 bg-slate-50/50 outline-none focus:border-brand-500/30"
                  >
                    <option value="update">Update</option>
                    <option value="achievement">Achievement</option>
                    <option value="article">Article</option>
                    <option value="question">Question</option>
                    <option value="announcement">Announcement</option>
                  </select>
                  <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-650 text-xl font-bold">×</button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Avatar src={user?.avatar} name={`${user?.firstName} ${user?.lastName}`} size="md" />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{user?.firstName} {user?.lastName}</p>
                    <span className="text-xs text-slate-400 font-medium capitalize">{postType}</span>
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
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-150">
                <div className="flex gap-2">
                  <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"><Image size={18} /></button>
                  <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"><AtSign size={18} /></button>
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
