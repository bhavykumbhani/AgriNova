const { Server } = require('socket.io');
const { supabase, isConfigured } = require('../config/supabase');
const env = require('../config/env');

let io = null;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
          origin === env.CLIENT_URL ||
          origin.includes('localhost') ||
          origin.includes('127.0.0.1') ||
          origin.endsWith('.vercel.app')
        ) {
          return callback(null, true);
        }
        return callback(null, true);
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Socket Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        (socket.handshake.headers?.authorization?.startsWith('Bearer ')
          ? socket.handshake.headers.authorization.split(' ')[1]
          : null);

      if (!token) {
        return next(new Error('Authentication error: Missing token'));
      }

      if (!isConfigured) {
        return next(new Error('Authentication error: Supabase not configured'));
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) {
        return next(new Error('Authentication error: Invalid or expired token'));
      }

      // Fetch user profile from Supabase
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, auth_user_id, role, first_name, last_name, email')
        .eq('auth_user_id', user.id)
        .single();

      if (profileError || !profile) {
        return next(new Error('Authentication error: Profile not found'));
      }

      socket.data.user = user;
      socket.data.userId = user.id;
      socket.data.profile = profile;
      socket.data.profileId = profile.id;

      return next();
    } catch (err) {
      return next(new Error('Authentication error: ' + err.message));
    }
  });

  // Connection Handler
  io.on('connection', (socket) => {
    const profile = socket.data.profile;
    console.log(`🔌 [Socket.IO] User connected: ${profile.first_name} ${profile.last_name} (${profile.role}) - Socket ID: ${socket.id}`);

    // Join user's personal room for notifications
    socket.join(`user:${profile.id}`);

    // Join Conversation Room with access check
    socket.on('join_conversation', async (data, callback) => {
      try {
        const conversationId = typeof data === 'string' ? data : data?.conversationId;
        if (!conversationId) {
          if (callback) callback({ error: 'Missing conversationId' });
          return;
        }

        // Verify membership in database
        const { data: conversation, error: convError } = await supabase
          .from('conversations')
          .select('id, farmer_profile_id, buyer_profile_id')
          .eq('id', conversationId)
          .single();

        if (convError || !conversation) {
          if (callback) callback({ error: 'Conversation not found' });
          return;
        }

        if (
          conversation.farmer_profile_id !== profile.id &&
          conversation.buyer_profile_id !== profile.id
        ) {
          if (callback) callback({ error: 'Unauthorized to join this conversation' });
          return;
        }

        const roomName = `conversation:${conversationId}`;
        socket.join(roomName);
        console.log(`💬 Socket ${socket.id} joined ${roomName}`);
        if (callback) callback({ success: true, room: roomName });
      } catch (err) {
        console.error('Error joining conversation:', err);
        if (callback) callback({ error: err.message });
      }
    });

    // Leave Conversation Room
    socket.on('leave_conversation', (data) => {
      const conversationId = typeof data === 'string' ? data : data?.conversationId;
      if (conversationId) {
        socket.leave(`conversation:${conversationId}`);
      }
    });

    // Send Message Realtime
    socket.on('send_message', async (data, callback) => {
      try {
        const { conversationId, content, messageType = 'text' } = data || {};

        if (!conversationId || !content || !content.trim()) {
          if (callback) callback({ error: 'Invalid message payload' });
          return;
        }

        const trimmedContent = content.trim();
        if (trimmedContent.length > 2000) {
          if (callback) callback({ error: 'Message exceeds maximum length (2000 characters)' });
          return;
        }

        // Basic XSS sanitize
        const sanitizedContent = trimmedContent
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

        // Verify conversation membership
        const { data: conversation, error: convError } = await supabase
          .from('conversations')
          .select('id, farmer_profile_id, buyer_profile_id')
          .eq('id', conversationId)
          .single();

        if (convError || !conversation) {
          if (callback) callback({ error: 'Conversation not found' });
          return;
        }

        if (
          conversation.farmer_profile_id !== profile.id &&
          conversation.buyer_profile_id !== profile.id
        ) {
          if (callback) callback({ error: 'Unauthorized: Not a participant in this conversation' });
          return;
        }

        // 1. Insert message into PostgreSQL database
        const { data: savedMessage, error: insertError } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_profile_id: profile.id,
            message_type: messageType,
            content: sanitizedContent,
          })
          .select('*, sender:profiles(id, first_name, last_name, avatar_url, role)')
          .single();

        if (insertError) {
          console.error('Error inserting message into Supabase:', insertError);
          if (callback) callback({ error: 'Failed to save message to database' });
          return;
        }

        // 2. Update conversation updated_at
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId);

        // 3. Emit saved message to conversation room
        const roomName = `conversation:${conversationId}`;
        io.to(roomName).emit('new_message', savedMessage);

        // 4. Send notification to the other party
        const otherParticipantId =
          conversation.farmer_profile_id === profile.id
            ? conversation.buyer_profile_id
            : conversation.farmer_profile_id;

        io.to(`user:${otherParticipantId}`).emit('unread_message_notification', {
          conversationId,
          message: savedMessage,
        });

        if (callback) callback({ success: true, data: savedMessage });
      } catch (err) {
        console.error('Socket send_message error:', err);
        if (callback) callback({ error: err.message });
      }
    });

    // Typing Indicators
    socket.on('typing', (data) => {
      const { conversationId, isTyping } = data || {};
      if (conversationId) {
        socket.to(`conversation:${conversationId}`).emit('user_typing', {
          conversationId,
          senderProfileId: profile.id,
          senderName: `${profile.first_name} ${profile.last_name}`,
          isTyping: Boolean(isTyping),
        });
      }
    });

    // Mark Messages As Read
    socket.on('mark_as_read', async (data, callback) => {
      try {
        const { conversationId } = data || {};
        if (!conversationId) return;

        const now = new Date().toISOString();
        const { error: updateError } = await supabase
          .from('messages')
          .update({ read_at: now })
          .eq('conversation_id', conversationId)
          .neq('sender_profile_id', profile.id)
          .is('read_at', null);

        if (!updateError) {
          io.to(`conversation:${conversationId}`).emit('messages_read', {
            conversationId,
            readBy: profile.id,
            readAt: now,
          });
        }
        if (callback) callback({ success: true });
      } catch (err) {
        console.error('Socket mark_as_read error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 [Socket.IO] User disconnected: ${profile.first_name} (${socket.id})`);
    });
  });

  return io;
}

function getIO() {
  return io;
}

module.exports = {
  initSocket,
  getIO,
};
