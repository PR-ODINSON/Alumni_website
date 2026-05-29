import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bell, Check, CheckCheck, Trash2, UserPlus, MessageCircle, Briefcase, Calendar, Star, Award, BookOpen } from 'lucide-react';
import { notificationApi } from '../../lib/api';
import { formatRelativeTime } from '../../lib/utils';
import toast from 'react-hot-toast';

const ICON_MAP: Record<string, React.ReactNode> = {
  connection_request: <UserPlus size={16} className="text-blue-500" />,
  connection_accepted: <UserPlus size={16} className="text-green-500" />,
  message: <MessageCircle size={16} className="text-purple-500" />,
  job_posted: <Briefcase size={16} className="text-amber-500" />,
  event_reminder: <Calendar size={16} className="text-indigo-500" />,
  mentorship_request: <Star size={16} className="text-yellow-500" />,
  achievement: <Award size={16} className="text-gold-500" />,
  research: <BookOpen size={16} className="text-teal-500" />,
};

function NotificationItem({ notification, onRead, onDelete }: {
  notification: any;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const icon = ICON_MAP[notification.type] || <Bell size={16} className="text-slate-400" />;
  const senderName = notification.sender
    ? `${notification.sender.firstName} ${notification.sender.lastName}`
    : 'IITRAM';

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${
        !notification.isRead ? 'bg-iitram-50/50 border border-iitram-100' : 'hover:bg-slate-50'
      }`}
    >
      {/* Icon */}
      <div className="w-9 h-9 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-800">
          <span className="font-medium">{senderName}</span>{' '}
          <span>{notification.message}</span>
        </p>
        {notification.link && (
          <Link to={notification.link} className="text-xs text-iitram-600 hover:underline mt-0.5 block">
            View details →
          </Link>
        )}
        <p className="text-xs text-slate-400 mt-1">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {!notification.isRead && (
          <button
            onClick={() => onRead(notification._id)}
            className="p-1.5 rounded-lg hover:bg-iitram-100 text-iitram-600 transition-colors"
            title="Mark as read"
          >
            <Check size={14} />
          </button>
        )}
        <button
          onClick={() => onDelete(notification._id)}
          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}

export default function Notifications() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getAll({ limit: 50 }),
  });

  const readMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const readAllMutation = useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const notifications = (data as any)?.data?.data || [];
  const unreadCount = (data as any)?.data?.unreadCount || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50">
        <div className="page-container py-10">
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="card p-4 flex gap-4">
                <div className="skeleton w-9 h-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-2/3 rounded" />
                  <div className="skeleton h-3 w-1/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="page-container py-10 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-slate-500 mt-0.5">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => readAllMutation.mutate()}
              disabled={readAllMutation.isPending}
              className="btn-outline btn-sm flex items-center gap-1.5"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications list */}
        {notifications.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Bell size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">All caught up!</h3>
            <p className="text-slate-400 mt-1">No notifications yet</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {/* Unread */}
            {notifications.filter((n: any) => !n.isRead).length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 mb-2">New</p>
                <div className="space-y-2">
                  {notifications
                    .filter((n: any) => !n.isRead)
                    .map((notification: any) => (
                      <NotificationItem
                        key={notification._id}
                        notification={notification}
                        onRead={id => readMutation.mutate(id)}
                        onDelete={id => deleteMutation.mutate(id)}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Read */}
            {notifications.filter((n: any) => n.isRead).length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 mb-2">Earlier</p>
                <div className="space-y-1">
                  {notifications
                    .filter((n: any) => n.isRead)
                    .map((notification: any) => (
                      <NotificationItem
                        key={notification._id}
                        notification={notification}
                        onRead={id => readMutation.mutate(id)}
                        onDelete={id => deleteMutation.mutate(id)}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
