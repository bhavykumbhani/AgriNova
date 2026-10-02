const app = require('./app');
const env = require('./config/env');

// AgriNova Server Entrypoint
const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🌾 AgriNova Backend API Server running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`📊 Health Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`📈 Market Prices: http://localhost:${PORT}/api/market-prices`);
  console.log(`🌤️ Weather Telemetry: http://localhost:${PORT}/api/weather?region=nashik`);
  console.log('====================================================');
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
