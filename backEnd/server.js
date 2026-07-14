const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;



app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-session-id');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

const authSession = require('./middleware/authSession');
app.use(express.json());


app.use('/api', (req, res, next) => {
  
  if (req.method === 'OPTIONS') {
    return next();
  }
  
  if (req.path === '/health' || req.path === '/test-db') {
    return next();
  }
  authSession(req, res, next);
});

const connectDB = require('./config/db');


app.use(async (req, res, next) => {
  await connectDB();
  next();
});


app.get('/', (req, res) => {
  res.send('Movie Mukkalu Backend is Running...');
});


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




if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}

module.exports = app;

