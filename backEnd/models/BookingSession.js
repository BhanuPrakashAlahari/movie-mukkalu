const mongoose = require('mongoose');

const bookingSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true, // The browser's UUID session ID
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
  status: {
    type: String,
    enum: ['LOCKED', 'PAYMENT_PENDING', 'FAILED', 'CONFIRMED'],
    default: 'LOCKED',
  },
  orderId: {
    type: String, // Link to Razorpay Order
    index: true,
    unique: true,
    sparse: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // Document self-destructs when expiresAt time is reached
  },
}, { timestamps: true });

const BookingSession = mongoose.model('BookingSession', bookingSessionSchema);

module.exports = BookingSession;
