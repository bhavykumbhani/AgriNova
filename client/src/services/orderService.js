import api from './api';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data?.data;
  },

  getFarmerOrders: async (params = {}) => {
    const response = await api.get('/orders/farmer', { params });
    return response.data?.data || { orders: [], pagination: {} };
  },

  getBuyerOrders: async (params = {}) => {
    const response = await api.get('/orders/buyer', { params });
    return response.data?.data || { orders: [], pagination: {} };
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data?.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data?.data;
  },
};
