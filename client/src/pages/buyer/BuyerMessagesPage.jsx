import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  Send,
  Search,
  Check,
  CheckCheck,
  ArrowLeft,
  Circle,
  Package,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services/messageService';
import { getSocket, connectSocket } from '../../services/socket';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

export const BuyerMessagesPage = () => {
  const { user, profile } = useAuth();
  const location = useLocation();
  const toast = useToast();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputContent, setInputContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    initRealtime();
  }, []);

  useEffect(() => {
    if (location.state?.conversationId && conversations.length > 0) {
      const match = conversations.find((c) => c.id === location.state.conversationId);
      if (match) {
        selectConversation(match);
      }
    }
  }, [location.state, conversations]);

  const initRealtime = async () => {
    const socket = await connectSocket();
    if (!socket) return;

    setSocketConnected(socket.connected);

    socket.on('connect', () => setSocketConnected(true));
    socket.on('disconnect', () => setSocketConnected(false));

    socket.on('new_message', (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      scrollToBottom();
      fetchConversations();
    });

    socket.on('user_typing', (data) => {
      if (data.isTyping) {
        setIsTyping(true);
      } else {
        setIsTyping(false);
      }
    });

    socket.on('messages_read', () => {
      setMessages((prev) =>
        prev.map((m) => ({ ...m, read_at: m.read_at || new Date().toISOString() }))
      );
    });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await messageService.getConversations();
      setConversations(data);
      if (data.length > 0 && !activeConversation && !location.state?.conversationId) {
        selectConversation(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (conv) => {
    setActiveConversation(conv);
    try {
      setMessagesLoading(true);
      const msgs = await messageService.getConversationMessages(conv.id);
      setMessages(msgs);
      scrollToBottom();

      const socket = getSocket();
      if (socket) {
        socket.emit('join_conversation', { conversationId: conv.id });
        socket.emit('mark_as_read', { conversationId: conv.id });
      }

      setConversations((prev) =>
        prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
      );
    } catch (err) {
      toast.error('Failed to load message history');
    } finally {
      setMessagesLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleTyping = (e) => {
    setInputContent(e.target.value);
    const socket = getSocket();
    if (!socket || !activeConversation) return;

    socket.emit('typing', { conversationId: activeConversation.id, isTyping: true });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { conversationId: activeConversation.id, isTyping: false });
    }, 1500);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputContent.trim() || !activeConversation) return;

    const content = inputContent.trim();
    setInputContent('');

    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit(
        'send_message',
        { conversationId: activeConversation.id, content },
        (res) => {
          if (res?.error) {
            toast.error(res.error);
          }
        }
      );
    } else {
      try {
        const saved = await messageService.sendMessage(activeConversation.id, content);
        setMessages((prev) => [...prev, saved]);
        scrollToBottom();
      } catch (err) {
        toast.error('Could not send message: ' + err.message);
      }
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const farmerName = `${c.farmer?.farm_name || ''} ${c.farmer?.profile?.first_name || ''} ${c.farmer?.profile?.last_name || ''}`.toLowerCase();
    return farmerName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col animate-fadeIn">
      <Card padding="p-0" className="flex-1 flex overflow-hidden border border-slate-200 dark:border-[#21453A]">
        {/* Left Panel */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-[#21453A] flex flex-col bg-white dark:bg-[#112D25] shrink-0 ${
            activeConversation ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="p-4 border-b border-slate-100 dark:border-[#21453A]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                Messages
              </h2>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                <Circle className={`w-2 h-2 ${socketConnected ? 'text-emerald-500 fill-emerald-500' : 'text-amber-500 fill-amber-500'}`} />
                {socketConnected ? 'Live' : 'Connecting'}
              </span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search farmers or crops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {loading ? (
              <div className="py-12 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active conversations yet.
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isActive = activeConversation?.id === c.id;
                const farmerName = c.farmer?.farm_name || `${c.farmer?.profile?.first_name || 'Farmer'}`;

                return (
                  <button
                    key={c.id}
                    onClick={() => selectConversation(c)}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                      isActive
                        ? 'bg-teal-50/70 dark:bg-emerald-950/40'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden">
                      {c.farmer?.profile?.avatar_url ? (
                        <img src={c.farmer.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        farmerName[0].toUpperCase()
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between mb-0.5">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {farmerName}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {c.lastMessage?.created_at
                            ? new Date(c.lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : ''}
                        </span>
                      </div>

                      {c.product && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-teal-600 dark:text-teal-400 font-semibold mb-1">
                          <Package className="w-3 h-3" />
                          {c.product.crop_name}
                        </span>
                      )}

                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {c.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>

                    {c.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {c.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className={`flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950/40 ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
          {activeConversation ? (
            <>
              <div className="h-16 px-6 bg-white dark:bg-[#112D25] border-b border-slate-200 dark:border-[#21453A] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveConversation(null)}
                    className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden">
                    {activeConversation.farmer?.profile?.avatar_url ? (
                      <img src={activeConversation.farmer.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (activeConversation.farmer?.farm_name?.[0] || 'F').toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {activeConversation.farmer?.farm_name || `${activeConversation.farmer?.profile?.first_name || 'Farmer'}`}
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      {isTyping ? <span className="text-teal-500 font-semibold">typing...</span> : 'Producer'}
                    </span>
                  </div>
                </div>

                {activeConversation.product && (
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    <Package className="w-3.5 h-3.5 text-teal-600" />
                    <span className="font-semibold">{activeConversation.product.crop_name}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3">
                {messagesLoading ? (
                  <div className="py-20 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2" />
                    <p className="text-xs text-slate-400">
                      Negotiate delivery terms, test reports, or batch discounts directly with this producer.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.sender_profile_id === profile.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                            isMine
                              ? 'bg-teal-600 text-white rounded-br-xs'
                              : 'bg-white dark:bg-[#112D25] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-[#21453A] rounded-bl-xs'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-slate-400">
                          <span>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMine && (
                            msg.read_at ? (
                              <CheckCheck className="w-3 h-3 text-teal-500" />
                            ) : (
                              <Check className="w-3 h-3 text-slate-400" />
                            )
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-[#112D25] border-t border-slate-200 dark:border-[#21453A] flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Send procurement query, transport specifications..."
                  maxLength={2000}
                  value={inputContent}
                  onChange={handleTyping}
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />

                <Button
                  type="submit"
                  variant="primary"
                  disabled={!inputContent.trim()}
                  className="bg-teal-600 hover:bg-teal-700 px-4 py-2.5 rounded-xl shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Select a conversation
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Choose a producer from the left or connect with farmers via the Marketplace or Farmers Directory.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
