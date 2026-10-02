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
      // In mock development mode, attach demo user
      req.user = { id: 'mock-user-id', email: 'demo@agrinova.in', role: 'farmer' };
      return next();
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return error(res, 'Invalid or expired authentication token', 401);
    }

    req.user = user;
    return next();
  } catch (err) {
    return error(res, 'Authentication verification failed', 500);
  }
};

/**
 * Role-based authorization middleware
 */
const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Unauthorized access', 401);
    }
    const userRole = req.user.user_metadata?.role || req.user.role || 'farmer';
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
