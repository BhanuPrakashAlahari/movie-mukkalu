const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Fix for MongoDB DNS resolution issues on some machines (especially macOS)
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const app = express();

// --- THE HAMMER: RAW CORS PREFLIGHT HANDLER ---
// Bypasses everything else if it is an OPTIONS request
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-session-id');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

const authSession = require('./middleware/authSession');

const PORT = process.env.PORT || 5000;
app.use(express.json());

// Apply session identity for all API routes
app.use('/api', (req, res, next) => {
  // 1. Always skip preflight OPTIONS requests (CORS)
  if (req.method === 'OPTIONS') {
    return next();
  }
  // 2. Skip specific public routes
  if (req.path === '/health' || req.path === '/test-db') {
    return next();
  }
  authSession(req, res, next);
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Could not connect to MongoDB:', err);
  }
};

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Basic Health Check Route
app.get('/', (req, res) => {
  res.send('Movie Mokkalu Backend is Running...');
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is healthy' });
});

app.get('/api/test-db', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({ 
    state: states[mongoose.connection.readyState],
    hasUri: !!process.env.MONGODB_URI 
  });
});

app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/stalls', require('./routes/stalls'));



// Start Server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}

module.exports = app;

