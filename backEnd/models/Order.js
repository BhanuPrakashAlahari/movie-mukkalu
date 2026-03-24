const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  dateId: {
    type: String,
    required: true,
  },
  showTime: {
    type: String,
    required: true,
  },
  seatIds: {
    type: [String],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'SUCCESS', 'FAILED', 'FAILED_COLLISION'],
    default: 'PENDING',
  },
  paymentId: {
    type: String,
  },
  signature: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Automatic cleanup after 1 hour if not paid
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
