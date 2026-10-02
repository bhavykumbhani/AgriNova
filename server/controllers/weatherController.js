const weatherService = require('../services/weatherService');
const { success } = require('../utils/responseFormatter');

const getWeather = async (req, res, next) => {
  try {
    const { region, lat, lon } = req.query;
    const data = await weatherService.getWeather(region, lat, lon);
    return success(res, data, 'Weather telemetry retrieved successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getWeather,
};
