const marketService = require('../services/marketService');
const { success, error } = require('../utils/responseFormatter');

const getMarketPrices = async (req, res, next) => {
  try {
    const { prices, summary } = await marketService.getMarketPrices();
    return success(res, prices, 'Market prices retrieved successfully', 200, { summary });
  } catch (err) {
    next(err);
  }
};

const getPriceById = async (req, res, next) => {
  try {
    const { cropId } = req.params;
    const crop = await marketService.getPriceByCropId(cropId);
    if (!crop) {
      return error(res, 'Crop not found in market registry', 404);
    }
    return success(res, crop, 'Crop price retrieved successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMarketPrices,
  getPriceById,
};
