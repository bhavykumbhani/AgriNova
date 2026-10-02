const env = require('../config/env');

const REGIONAL_WEATHER_DATA = {
  nashik: {
    location: 'Nashik, Maharashtra',
    temperature: 28,
    condition: 'Partly Cloudy',
    humidity: 62,
    windSpeed: 12,
    rainProbability: 20,
    advisory: 'Favorable conditions for vegetable spray and field aeration.',
    forecast: [
      { day: 'Today', temp: 28, minTemp: 21, condition: 'Partly Cloudy', icon: 'partly-cloudy', rain: 20 },
      { day: 'Tue', temp: 29, minTemp: 22, condition: 'Sunny', icon: 'sunny', rain: 10 },
      { day: 'Wed', temp: 27, minTemp: 20, condition: 'Scattered Showers', icon: 'rain', rain: 45 },
      { day: 'Thu', temp: 26, minTemp: 19, condition: 'Cloudy', icon: 'cloudy', rain: 30 },
      { day: 'Fri', temp: 28, minTemp: 21, condition: 'Clear Sky', icon: 'sunny', rain: 5 },
    ],
  },
  pune: {
    location: 'Pune, Maharashtra',
    temperature: 29,
    condition: 'Clear Sky',
    humidity: 55,
    windSpeed: 10,
    rainProbability: 10,
    advisory: 'Optimal window for harvesting grains and open sun drying.',
    forecast: [
      { day: 'Today', temp: 29, minTemp: 22, condition: 'Clear Sky', icon: 'sunny', rain: 10 },
      { day: 'Tue', temp: 30, minTemp: 22, condition: 'Sunny', icon: 'sunny', rain: 5 },
      { day: 'Wed', temp: 28, minTemp: 21, condition: 'Partly Cloudy', icon: 'partly-cloudy', rain: 25 },
      { day: 'Thu', temp: 27, minTemp: 20, condition: 'Light Rain', icon: 'rain', rain: 40 },
      { day: 'Fri', temp: 28, minTemp: 20, condition: 'Partly Cloudy', icon: 'partly-cloudy', rain: 15 },
    ],
  },
  indore: {
    location: 'Indore, Madhya Pradesh',
    temperature: 31,
    condition: 'Sunny',
    humidity: 48,
    windSpeed: 14,
    rainProbability: 5,
    advisory: 'Low moisture levels. Early morning irrigation recommended for pulses.',
    forecast: [
      { day: 'Today', temp: 31, minTemp: 23, condition: 'Sunny', icon: 'sunny', rain: 5 },
      { day: 'Tue', temp: 32, minTemp: 24, condition: 'Hot & Clear', icon: 'sunny', rain: 0 },
      { day: 'Wed', temp: 30, minTemp: 23, condition: 'Partly Cloudy', icon: 'partly-cloudy', rain: 15 },
      { day: 'Thu', temp: 29, minTemp: 22, condition: 'Scattered Showers', icon: 'rain', rain: 35 },
      { day: 'Fri', temp: 30, minTemp: 22, condition: 'Sunny', icon: 'sunny', rain: 10 },
    ],
  },
  karnal: {
    location: 'Karnal, Haryana',
    temperature: 26,
    condition: 'Mild Breeze',
    humidity: 68,
    windSpeed: 16,
    rainProbability: 15,
    advisory: 'Ideal conditions for wheat field inspection and nutrient check.',
    forecast: [
      { day: 'Today', temp: 26, minTemp: 18, condition: 'Mild Breeze', icon: 'partly-cloudy', rain: 15 },
      { day: 'Tue', temp: 27, minTemp: 19, condition: 'Sunny', icon: 'sunny', rain: 5 },
      { day: 'Wed', temp: 25, minTemp: 17, condition: 'Light Rain', icon: 'rain', rain: 50 },
      { day: 'Thu', temp: 24, minTemp: 16, condition: 'Overcast', icon: 'cloudy', rain: 30 },
      { day: 'Fri', temp: 26, minTemp: 18, condition: 'Clear Sky', icon: 'sunny', rain: 10 },
    ],
  },
};

class WeatherService {
  async getWeather(region = 'nashik', lat = null, lon = null) {
    // If coords are provided or region key
    const normalizedKey = (region || 'nashik').toLowerCase();
    const weather = REGIONAL_WEATHER_DATA[normalizedKey] || REGIONAL_WEATHER_DATA.nashik;
    return weather;
  }
}

module.exports = new WeatherService();
