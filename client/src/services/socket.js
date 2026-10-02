import { io } from 'socket.io-client';
import { supabase } from '../lib/supabase';

let socket = null;

export const getSocket = () => socket;

export const connectSocket = async () => {
  if (socket && socket.connected) {
    return socket;
  }

  try {
    let token = null;
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      token = session?.access_token;
    }

    if (!token) {
      console.warn('[Socket] Cannot connect without authenticated session token');
      return null;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);

    socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      console.log('⚡ [Socket.IO Client] Connected with ID:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.warn('⚠️ [Socket.IO Client] Connection error:', err.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 [Socket.IO Client] Disconnected:', reason);
    });

    return socket;
  } catch (err) {
    console.error('Error connecting socket:', err);
    return null;
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
