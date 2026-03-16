const mongoose = require('mongoose');

const stallSchema = new mongoose.Schema({
  stallName: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Stall = mongoose.model('Stall', stallSchema, 'stalls');

module.exports = Stall;
