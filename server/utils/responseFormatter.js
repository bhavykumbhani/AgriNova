/**
 * Standardized API response helpers
 */
const success = (res, data, message = 'Success', statusCode = 200, extra = {}) => {
  const payload = {
    success: true,
    message,
  };
  if (data !== undefined && data !== null) {
    payload.data = data;
  }
  if (extra && typeof extra === 'object') {
    Object.assign(payload, extra);
  }
  payload.timestamp = new Date().toISOString();
  return res.status(statusCode).json(payload);
};

const error = (res, message = 'Internal Server Error', statusCode = 500, extra = null) => {
  const payload = {
    success: false,
    message,
  };
  if (extra && typeof extra === 'object') {
    Object.assign(payload, extra);
  } else if (extra) {
    payload.errors = extra;
  }
  payload.timestamp = new Date().toISOString();
  return res.status(statusCode).json(payload);
};

module.exports = {
  success,
  error,
};
