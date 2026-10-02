import api from './api';

export const productService = {
  getPublicProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data?.data || { products: [], pagination: {} };
  },

  getFarmerProducts: async (params = {}) => {
    const response = await api.get('/products/farmer', { params });
    return response.data?.data || { products: [], pagination: {} };
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data?.data;
  },

  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data?.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data?.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data?.data;
  },
};
