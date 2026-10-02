import api from './api';
import { MOCK_CROP_PRICES, MARKET_TREND_SUMMARY } from '../constants/mockMarketData';

/**
 * Service to fetch crop market prices, historical movements, and trends.
 * Supports backend API with seamless fallback to verified Indian APMC Mandi mock data.
 */
export const marketService = {
  /**
   * Fetch current prices for key crops
   */
  getMarketPrices: async () => {
    try {
      const response = await api.get('/market-prices');
      if (response?.data?.success && response.data.data) {
        return {
          prices: response.data.data,
          summary: response.data.summary || MARKET_TREND_SUMMARY,
          isLiveApi: true,
        };
      }
    } catch {
      // Backend not running or not deployed - return clean simulated APMC data
    }

    // Realistic network simulation delay
    await new Promise((resolve) => setTimeout(resolve, 250));

    return {
      prices: MOCK_CROP_PRICES,
      summary: MARKET_TREND_SUMMARY,
      isLiveApi: false,
    };
  },

  /**
   * Fetch crop price detail by crop id
   */
  getCropPriceById: async (cropId) => {
    try {
      const response = await api.get(`/market-prices/${cropId}`);
      if (response?.data?.success && response.data.data) {
        return response.data.data;
      }
    } catch {
      // Fallback
    }

    return MOCK_CROP_PRICES.find((c) => c.id === cropId) || null;
  },
};
