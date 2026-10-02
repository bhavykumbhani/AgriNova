import api from './api';

export const analyticsService = {
  getFarmerAnalytics: async (period = '30d') => {
    const response = await api.get('/analytics/farmer', { params: { period } });
    return response.data?.data || {
      totalRevenue: 0,
      productsListed: 0,
      completedOrders: 0,
      activeBuyers: 0,
      revenueSeries: [],
      recentOrders: [],
      topSellingCrops: [],
    };
  },

  getBuyerAnalytics: async () => {
    const response = await api.get('/analytics/buyer');
    return response.data?.data || {
      activeOrders: 0,
      completedOrders: 0,
      savedProducts: 0,
      farmersConnected: 0,
      totalPurchaseValue: 0,
    };
  },
};
