const { supabase, isConfigured } = require('../config/supabase');
const { error } = require('../utils/responseFormatter');

/**
 * Middleware to verify Supabase JWT token in Bearer authorization header
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Authentication required. Missing Bearer token.', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!isConfigured) {
      return error(res, 'Authentication service is not properly configured.', 503);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return error(res, 'Invalid or expired authentication token', 401);
    }

    // Query user profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, farmer_profiles(*), buyer_profiles(*)')
      .eq('auth_user_id', user.id)
      .single();

    if (profileError || !profile) {
      return error(res, 'User profile not found. Please complete registration.', 403);
    }

    req.user = user;
    req.profile = profile;
    req.farmerProfile = profile.farmer_profiles?.[0] || profile.farmer_profiles || null;
    req.buyerProfile = profile.buyer_profiles?.[0] || profile.buyer_profiles || null;

    return next();
  } catch (err) {
    return error(res, 'Authentication verification failed: ' + (err.message || ''), 500);
  }
};

/**
 * Role-based authorization middleware
 */
const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.profile) {
      return error(res, 'Unauthorized access', 401);
    }
    const userRole = req.profile.role;
    if (!allowedRoles.includes(userRole)) {
      return error(res, `Forbidden: Requires one of [${allowedRoles.join(', ')}] roles`, 403);
    }
    return next();
  };
};

module.exports = {
  requireAuth,
  requireRole,
};
