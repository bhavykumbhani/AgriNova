const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const apiRouter = require('./routes/apiRouter');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security and utility middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      origin === env.CLIENT_URL ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// API Routes
app.use('/api', apiRouter);

// Root greeting
app.get('/', (req, res) => {
  res.json({
    service: 'AgriNova Backend API',
    description: 'Smart Agriculture Marketplace and Decision Support System',
    status: 'online',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
