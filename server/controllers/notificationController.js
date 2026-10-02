const { supabase, isConfigured } = require('../config/supabase');
const { success, error } = require('../utils/responseFormatter');

/**
 * Get user notifications
 */
const getNotifications = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const profileId = req.profile?.id;
    if (!profileId) return error(res, 'Profile not found', 404);

    const { data: notifs, error: fetchErr } = await supabase
      .from('notifications')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (fetchErr) throw fetchErr;

    const unreadCount = (notifs || []).filter(n => !n.read_at).length;

    return success(res, {
      notifications: notifs || [],
      unreadCount,
    });
  } catch (err) {
    return error(res, 'Failed to fetch notifications: ' + err.message, 500);
  }
};

/**
 * Mark notification as read
 */
const markAsRead = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const { id } = req.params;
    const profileId = req.profile?.id;

    const { data, error: updateErr } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id)
      .eq('profile_id', profileId)
      .select()
      .single();

    if (updateErr) throw updateErr;

    return success(res, data, 'Marked as read');
  } catch (err) {
    return error(res, 'Failed to update notification: ' + err.message, 500);
  }
};

/**
 * Mark all notifications as read
 */
const markAllAsRead = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const profileId = req.profile?.id;

    await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('profile_id', profileId)
      .is('read_at', null);

    return success(res, null, 'All notifications marked as read');
  } catch (err) {
    return error(res, 'Failed to mark notifications read: ' + err.message, 500);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
