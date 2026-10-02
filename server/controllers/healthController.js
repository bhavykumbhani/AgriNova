const { isConfigured } = require('../config/supabase');
const { success } = require('../utils/responseFormatter');

const checkHealth = (req, res) => {
  return success(res, {
    status: 'healthy',
    service: 'AgriNova Backend API',
    supabaseConnected: isConfigured,
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  }, 'AgriNova API is operational');
};

module.exports = {
  checkHealth,
};
