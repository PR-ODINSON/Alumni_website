import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Search, Send, ArrowLeft } from 'lucide-react';
import { messageApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { formatRelativeTime } from '../../lib/utils';
import Avatar from '../../components/ui/Avatar';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [activeConv, setActiveConv] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const queryClient = useQueryClient();

  const { data: convsData } = useQuery({
    queryKey: ['conversations'],
    queryFn: messageApi.getConversations,
    refetchInterval: 10000,
  });

  const { data: messagesData } = useQuery({
    queryKey: ['messages', activeConv?._id],
    queryFn: () => messageApi.getMessages(activeConv._id),
    enabled: !!activeConv,
    refetchInterval: 3000,
  });

  const sendMutation = useMutation({
    mutationFn: (content: string) => messageApi.sendMessage(activeConv._id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', activeConv?._id] });
      setNewMessage('');
    },
    onError: () => toast.error('Failed to send message'),
  });

  const conversations = convsData?.data?.data || [];
  const messages = messagesData?.data?.data || [];

  const getOtherParticipant = (conv: any) => {
    return conv.participants?.find((p: any) => p._id !== user?._id);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-white">
      {/* Conversations List */}
      <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col ${activeConv ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900 mb-3">Messages</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9 text-sm h-9" placeholder="Search conversations..." />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <MessageCircle size={32} className="text-slate-300 mb-3" />
              <p className="text-slate-500 text-sm">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv: any) => {
              const other = getOtherParticipant(conv);
              const isActive = activeConv?._id === conv._id;
              return (
                <div
                  key={conv._id}
                  onClick={() => setActiveConv(conv)}
                  className={`flex items-center gap-3 p-4 cursor-pointer border-b border-slate-50 hover:bg-slate-50 transition-colors ${isActive ? 'bg-iitram-50 border-l-2 border-l-iitram-600' : ''}`}
                >
                  <Avatar src={other?.avatar} name={`${other?.firstName} ${other?.lastName}`} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900 text-sm">{other?.firstName} {other?.lastName}</p>
                      {conv.lastMessageAt && (
                        <p className="text-2xs text-slate-400">{formatRelativeTime(conv.lastMessageAt)}</p>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {(conv.unreadCounts?.[user?._id as string] || 0) > 0 && (
                        <span className="inline-block w-2 h-2 bg-iitram-500 rounded-full mr-1" />
                      )}
                      Click to view messages
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!activeConv ? 'hidden md:flex' : 'flex'}`}>
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="h-16 px-4 flex items-center gap-3 border-b border-slate-100">
              <button onClick={() => setActiveConv(null)} className="md:hidden p-2 -ml-1 text-slate-400 hover:text-slate-600">
                <ArrowLeft size={20} />
              </button>
              {(() => {
                const other = getOtherParticipant(activeConv);
                return (
                  <>
                    <Avatar src={other?.avatar} name={`${other?.firstName} ${other?.lastName}`} size="sm" />
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{other?.firstName} {other?.lastName}</p>
                      <p className="text-xs text-slate-400 capitalize">{other?.role}</p>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg: any) => {
                const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
                return (
                  <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                      isMine
                        ? 'bg-iitram-700 text-white rounded-br-sm'
                        : 'bg-slate-100 text-slate-900 rounded-bl-sm'
                    }`}>
                      <p>{msg.content}</p>
                      <p className={`text-2xs mt-1 ${isMine ? 'text-iitram-200' : 'text-slate-400'}`}>
                        {formatRelativeTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-100">
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-iitram-300 focus-within:ring-2 focus-within:ring-iitram-100 transition-all">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && newMessage.trim()) sendMutation.mutate(newMessage); }}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none px-4 py-3"
                />
                <button
                  onClick={() => newMessage.trim() && sendMutation.mutate(newMessage)}
                  disabled={!newMessage.trim() || sendMutation.isPending}
                  className="p-3 rounded-xl text-iitram-600 hover:bg-iitram-100 transition-colors disabled:opacity-40"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-full bg-iitram-50 flex items-center justify-center mb-4">
              <MessageCircle size={32} className="text-iitram-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Your Messages</h3>
            <p className="text-slate-500 text-sm max-w-xs">Select a conversation to start messaging, or connect with alumni to begin a new chat.</p>
          </div>
        )}
      </div>
    </div>
  );
}
