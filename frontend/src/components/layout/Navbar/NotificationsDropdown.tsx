import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { notificationApi } from '../../../lib/api';

export default function NotificationsDropdown() {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: notifData } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationApi.getAll({ unreadOnly: true, limit: 8 }),
    refetchInterval: 30000,
  });

  const unreadCount = notifData?.data?.unreadCount || 0;
  const notifications = notifData?.data?.data || [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
    } catch {}
  };

  return (
    <div ref={notifRef} className="relative">
      <button
        onClick={() => setNotifOpen(!notifOpen)}
        className="relative p-2.5 rounded-2xl text-slate-500 hover:bg-slate-100/60 backdrop-blur-sm transition-colors border border-transparent hover:border-white/50 cursor-pointer"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {notifOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-soft-xl border border-slate-100/80 overflow-hidden z-40"
          >
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs font-display">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-2xs font-bold text-brand-600 hover:text-brand-700 cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 font-medium">
                  No new notifications
                </div>
              ) : (
                notifications.map((n: any) => (
                  <div
                    key={n._id}
                    className={`px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 cursor-pointer flex items-start gap-3 transition-colors ${!n.isRead ? 'bg-brand-50/40' : ''}`}
                    onClick={() => {
                      if (n.link) navigate(n.link);
                      setNotifOpen(false);
                    }}
                  >
                    {n.sender?.avatar ? (
                      <img src={n.sender.avatar} className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-slate-100" alt="" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0">
                        <Bell size={12} className="text-brand-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-2xs font-medium text-slate-700 leading-normal">{n.message}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5 font-medium">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!n.isRead && <div className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0 mt-1" />}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
