import api from './api';

export const supportService = {
  submitContact: async ({ firstName, lastName, email, phone = '', topic, message }) => {
    try {
      const response = await api.post('/support/contact', {
        firstName,
        lastName,
        email,
        phone,
        topic,
        message,
      });
      return response.data;
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message;
      const error = new Error(serverMessage);
      error.response = err.response;
      throw error;
    }
  },
};
