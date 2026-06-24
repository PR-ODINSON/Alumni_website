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
    <div className="h-[calc(100vh-6rem)] flex bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden my-3">
      {/* Conversations List */}
      <div className={`w-full md:w-80 border-r border-slate-200/60 flex flex-col bg-slate-50/50 ${activeConv ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-200/60 bg-white">
          <h2 className="font-bold font-display text-slate-900 text-sm mb-3">Messages</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9 text-xs h-9 bg-slate-50 border-slate-200 focus:bg-white" placeholder="Search conversations..." />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-white">
              <MessageCircle size={28} className="text-slate-300 mb-3" />
              <p className="text-slate-500 text-xs font-semibold">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv: any) => {
              const other = getOtherParticipant(conv);
              const isActive = activeConv?._id === conv._id;
              return (
                <div
                  key={conv._id}
                  onClick={() => setActiveConv(conv)}
                  className={`flex items-center gap-3 p-4 cursor-pointer border-b border-slate-100 hover:bg-slate-50 transition-colors ${isActive ? 'bg-[#001f54]/5 border-l-4 border-l-[#001f54]' : ''}`}
                >
                  <Avatar src={other?.avatar} name={`${other?.firstName} ${other?.lastName}`} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-800 text-xs truncate leading-none">{other?.firstName} {other?.lastName}</p>
                      {conv.lastMessageAt && (
                        <p className="text-[9px] text-slate-400">{formatRelativeTime(conv.lastMessageAt)}</p>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate flex items-center mt-1.5 font-semibold">
                      {(conv.unreadCounts?.[user?._id as string] || 0) > 0 && (
                        <span className="inline-block w-1.5 h-1.5 bg-[#001f54] rounded-full mr-1.5 shrink-0" />
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
      <div className={`flex-1 flex flex-col bg-white ${!activeConv ? 'hidden md:flex' : 'flex'}`}>
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-200/60 bg-slate-50/50">
              <button onClick={() => setActiveConv(null)} className="md:hidden p-1.5 -ml-1 text-slate-400 hover:text-slate-700 hover:bg-slate-150 rounded-lg transition-colors">
                <ArrowLeft size={18} />
              </button>
              {(() => {
                const other = getOtherParticipant(activeConv);
                return (
                  <>
                    <Avatar src={other?.avatar} name={`${other?.firstName} ${other?.lastName}`} size="sm" />
                    <div>
                      <p className="font-bold text-slate-900 text-xs leading-none">{other?.firstName} {other?.lastName}</p>
                      <p className="text-[10px] text-slate-450 capitalize mt-1 font-bold">{other?.role}</p>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
              {messages.map((msg: any) => {
                const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
                return (
                  <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-xl text-xs shadow-sm ${
                      isMine
                        ? 'bg-[#001f54] text-white rounded-br-sm'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-sm'
                    }`}>
                      <p className="leading-relaxed font-semibold">{msg.content}</p>
                      <p className={`text-[9px] mt-1 text-right ${isMine ? 'text-slate-300' : 'text-slate-400'}`}>
                        {formatRelativeTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200/60 bg-slate-50/30">
              <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-250 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100 transition-all p-1">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && newMessage.trim()) sendMutation.mutate(newMessage); }}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none px-3 py-2"
                />
                <button
                  onClick={() => newMessage.trim() && sendMutation.mutate(newMessage)}
                  disabled={!newMessage.trim() || sendMutation.isPending}
                  className="p-2.5 rounded-xl bg-[#001f54] text-white hover:bg-slate-900 transition-colors disabled:opacity-40"
                >
                  <Send size={13} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/20">
            <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
              <MessageCircle size={26} className="text-slate-400" />
            </div>
            <h3 className="text-base font-bold font-display text-slate-900 mb-1">Your Messages</h3>
            <p className="text-slate-400 text-xs max-w-xs leading-relaxed font-semibold">Select a conversation to start messaging, or connect with alumni to begin a new chat.</p>
          </div>
        )}
      </div>
    </div>
  );
}
