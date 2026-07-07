const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI is not defined in the environment variables!');
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('Could not connect to MongoDB:', err);
  }
};

module.exports = connectDB;
