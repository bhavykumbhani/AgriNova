import axios from 'axios';
import { supabase } from '../lib/supabase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  try {
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    }
  } catch (err) {
    // Ignore error getting session
  }
  return config;
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
