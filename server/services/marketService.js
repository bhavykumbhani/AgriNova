const marketRepository = require('../repositories/marketRepository');

class MarketService {
  async getMarketPrices() {
    const prices = await marketRepository.getAllPrices();
    const summary = {
      lastUpdated: 'Live Mandi Feed • ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      activeMandis: 148,
      overallMarketSentiment: 'Bullish (+1.6% index)',
    };
    return { prices, summary };
  }

  async getPriceByCropId(cropId) {
    return await marketRepository.getPriceById(cropId);
  }
}

module.exports = new MarketService();
