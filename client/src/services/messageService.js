import api from './api';

export const messageService = {
  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response.data?.data || [];
  },

  getOrCreateConversation: async (data) => {
    const response = await api.post('/messages/conversations', data);
    return response.data?.data;
  },

  getConversationMessages: async (conversationId) => {
    const response = await api.get(`/messages/conversations/${conversationId}/messages`);
    return response.data?.data || [];
  },

  sendMessage: async (conversationId, content, messageType = 'text') => {
    const response = await api.post(`/messages/conversations/${conversationId}/messages`, {
      content,
      messageType,
    });
    return response.data?.data;
  },
};
