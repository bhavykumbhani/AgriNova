import api from './api';

export const directoryService = {
  getBuyers: async (params = {}) => {
    const response = await api.get('/directory/buyers', { params });
    return response.data?.data || [];
  },

  getFarmers: async (params = {}) => {
    const response = await api.get('/directory/farmers', { params });
    return response.data?.data || [];
  },
};

export const savedProductService = {
  getSavedProducts: async () => {
    const response = await api.get('/saved-products');
    return response.data?.data || [];
  },

  toggleSave: async (productId) => {
    const response = await api.post(`/saved-products/${productId}`);
    return response.data?.data;
  },
};

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data?.data || { notifications: [], unreadCount: 0 };
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data?.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data?.data;
  },
};

export const profileService = {
  getCurrentProfile: async () => {
    const response = await api.get('/profile/me');
    return response.data?.data;
  },

  updateFarmerProfile: async (data) => {
    const response = await api.put('/profile/farmer', data);
    return response.data?.data;
  },

  updateBuyerProfile: async (data) => {
    const response = await api.put('/profile/buyer', data);
    return response.data?.data;
  },
};
