const { supabase, isConfigured } = require('../config/supabase');

const SEED_MARKET_PRICES = [
  {
    id: 'crop-wheat',
    name: 'Wheat',
    price: 2450,
    unit: 'quintal',
    changeAmount: 43.5,
    changePercent: 1.8,
    isPositive: true,
    mandi: 'Indore Mandi, MP',
    variety: 'Grade A',
    sparkline: [2380, 2395, 2410, 2400, 2435, 2450],
    iconType: 'wheat',
  },
  {
    id: 'crop-rice',
    name: 'Rice (Basmati)',
    price: 3820,
    unit: 'quintal',
    changeAmount: -35.0,
    changePercent: -0.9,
    isPositive: false,
    mandi: 'Karnal Mandi, HR',
    variety: 'Milled Standard',
    sparkline: [3900, 3880, 3865, 3850, 3830, 3820],
    iconType: 'rice',
  },
  {
    id: 'crop-maize',
    name: 'Maize',
    price: 2180,
    unit: 'quintal',
    changeAmount: 52.0,
    changePercent: 2.4,
    isPositive: true,
    mandi: 'Chhindwara Mandi, MP',
    variety: 'Feed Grade',
    sparkline: [2090, 2110, 2130, 2145, 2160, 2180],
    iconType: 'corn',
  },
  {
    id: 'crop-onion',
    name: 'Onion',
    price: 2200,
    unit: 'quintal',
    changeAmount: 88.0,
    changePercent: 4.2,
    isPositive: true,
    mandi: 'Lasalgaon Mandi, MH',
    variety: 'Medium Red',
    sparkline: [2050, 2080, 2110, 2140, 2180, 2200],
    iconType: 'onion',
  },
  {
    id: 'crop-tomato',
    name: 'Tomato',
    price: 1850,
    unit: 'quintal',
    changeAmount: -40.0,
    changePercent: -2.1,
    isPositive: false,
    mandi: 'Kolar Mandi, KA',
    variety: 'Grade 1 Red',
    sparkline: [1940, 1920, 1890, 1910, 1870, 1850],
    iconType: 'tomato',
  },
];

class MarketRepository {
  async getAllPrices() {
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('market_prices')
          .select('*')
          .order('name');
        
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('[MarketRepository] Supabase query fallback:', err.message);
      }
    }
    // Return verified seed fallback
    return SEED_MARKET_PRICES;
  }

  async getPriceById(cropId) {
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('market_prices')
          .select('*')
          .eq('id', cropId)
          .single();
        if (!error && data) return data;
      } catch (err) {
        // Fallback
      }
    }
    return SEED_MARKET_PRICES.find((c) => c.id === cropId) || null;
  }
}

module.exports = new MarketRepository();
