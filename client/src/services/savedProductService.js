import api from './api';

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
