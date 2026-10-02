const { supabase, isConfigured } = require('../config/supabase');
const { success, error } = require('../utils/responseFormatter');
const { getIO } = require('../socket');

/**
 * Get all conversations for current authenticated user
 */
const getConversations = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const profileId = req.profile?.id;
    if (!profileId) return error(res, 'Profile not found', 404);

    const { data: convs, error: fetchErr } = await supabase
      .from('conversations')
      .select(`
        *,
        farmer:farmer_profiles(
          id,
          farm_name,
          farm_location,
          profile:profiles(id, first_name, last_name, avatar_url)
        ),
        buyer:buyer_profiles(
          id,
          company_name,
          city,
          profile:profiles(id, first_name, last_name, avatar_url)
        ),
        product:products(id, crop_name, primary_image_url, price_per_quintal),
        messages(id, content, message_type, sender_profile_id, created_at, read_at)
      `)
      .or(`farmer_profile_id.eq.${profileId},buyer_profile_id.eq.${profileId}`)
      .order('updated_at', { ascending: false });

    if (fetchErr) throw fetchErr;

    // Process conversations to add lastMessage and unreadCount
    const formatted = (convs || []).map(c => {
      const msgs = (c.messages || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const lastMessage = msgs[0] || null;
      const unreadCount = msgs.filter(m => m.sender_profile_id !== profileId && !m.read_at).length;

      return {
        id: c.id,
        farmer_profile_id: c.farmer_profile_id,
        buyer_profile_id: c.buyer_profile_id,
        product: c.product,
        farmer: c.farmer,
        buyer: c.buyer,
        lastMessage,
        unreadCount,
        updated_at: c.updated_at,
        created_at: c.created_at,
      };
    });

    return success(res, formatted);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    return error(res, 'Failed to fetch conversations: ' + err.message, 500);
  }
};

/**
 * Get or create a conversation between farmer and buyer
 */
const getOrCreateConversation = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const { farmer_profile_id, buyer_profile_id, product_id } = req.body;

    let targetFarmerId = farmer_profile_id;
    let targetBuyerId = buyer_profile_id;

    if (req.profile.role === 'farmer') {
      targetFarmerId = req.profile.id;
    } else if (req.profile.role === 'buyer') {
      targetBuyerId = req.profile.id;
    }

    if (!targetFarmerId || !targetBuyerId) {
      return error(res, 'Both farmer and buyer identifiers are required', 400);
    }

    // Check if conversation already exists
    let query = supabase
      .from('conversations')
      .select(`
        *,
        farmer:farmer_profiles(id, farm_name, profile:profiles(id, first_name, last_name, avatar_url)),
        buyer:buyer_profiles(id, company_name, profile:profiles(id, first_name, last_name, avatar_url)),
        product:products(id, crop_name, primary_image_url)
      `)
      .eq('farmer_profile_id', targetFarmerId)
      .eq('buyer_profile_id', targetBuyerId);

    if (product_id) {
      query = query.eq('product_id', product_id);
    }

    const { data: existingList, error: findErr } = await query;
    if (!findErr && existingList && existingList.length > 0) {
      return success(res, existingList[0]);
    }

    // Create new conversation
    const { data: newConv, error: createErr } = await supabase
      .from('conversations')
      .insert({
        farmer_profile_id: targetFarmerId,
        buyer_profile_id: targetBuyerId,
        product_id: product_id || null,
      })
      .select(`
        *,
        farmer:farmer_profiles(id, farm_name, profile:profiles(id, first_name, last_name, avatar_url)),
        buyer:buyer_profiles(id, company_name, profile:profiles(id, first_name, last_name, avatar_url)),
        product:products(id, crop_name, primary_image_url)
      `)
      .single();

    if (createErr) throw createErr;

    return success(res, newConv, 'Conversation started', 201);
  } catch (err) {
    console.error('Error starting conversation:', err);
    return error(res, 'Failed to start conversation: ' + err.message, 500);
  }
};

/**
 * Get messages inside a conversation
 */
const getConversationMessages = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const { id } = req.params;
    const profileId = req.profile?.id;

    // Verify participant
    const { data: conv, error: convErr } = await supabase
      .from('conversations')
      .select('id, farmer_profile_id, buyer_profile_id')
      .eq('id', id)
      .single();

    if (convErr || !conv) return error(res, 'Conversation not found', 404);

    if (conv.farmer_profile_id !== profileId && conv.buyer_profile_id !== profileId) {
      return error(res, 'Unauthorized to view this conversation', 403);
    }

    const { data: messages, error: msgErr } = await supabase
      .from('messages')
      .select('*, sender:profiles(id, first_name, last_name, avatar_url, role)')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });

    if (msgErr) throw msgErr;

    // Mark unread messages as read
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', id)
      .neq('sender_profile_id', profileId)
      .is('read_at', null);

    return success(res, messages || []);
  } catch (err) {
    return error(res, 'Failed to fetch messages: ' + err.message, 500);
  }
};

/**
 * Send message HTTP fallback
 */
const sendMessageHttp = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const { id } = req.params;
    const { content, messageType = 'text' } = req.body;
    const profileId = req.profile?.id;

    if (!content || !content.trim()) {
      return error(res, 'Message content cannot be empty', 400);
    }

    // Verify conversation
    const { data: conv, error: convErr } = await supabase
      .from('conversations')
      .select('id, farmer_profile_id, buyer_profile_id')
      .eq('id', id)
      .single();

    if (convErr || !conv) return error(res, 'Conversation not found', 404);

    if (conv.farmer_profile_id !== profileId && conv.buyer_profile_id !== profileId) {
      return error(res, 'Unauthorized', 403);
    }

    const sanitized = content.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const { data: saved, error: insertErr } = await supabase
      .from('messages')
      .insert({
        conversation_id: id,
        sender_profile_id: profileId,
        content: sanitized,
        message_type: messageType,
      })
      .select('*, sender:profiles(id, first_name, last_name, avatar_url, role)')
      .single();

    if (insertErr) throw insertErr;

    // Update conversation timestamp
    await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', id);

    // Emit to socket room
    const io = getIO();
    if (io) {
      io.to(`conversation:${id}`).emit('new_message', saved);
    }

    return success(res, saved, 'Message sent', 201);
  } catch (err) {
    return error(res, 'Failed to send message: ' + err.message, 500);
  }
};

module.exports = {
  getConversations,
  getOrCreateConversation,
  getConversationMessages,
  sendMessageHttp,
};
