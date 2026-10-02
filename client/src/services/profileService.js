import api from './api';

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
