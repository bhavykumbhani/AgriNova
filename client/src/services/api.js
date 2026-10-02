import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log in development without breaking the user experience
    if (import.meta.env.DEV) {
      console.warn('API Request Warning:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
