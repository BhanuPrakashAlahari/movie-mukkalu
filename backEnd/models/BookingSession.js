const mongoose = require('mongoose');

const bookingSessionSchema = new mongoose.Schema({
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
  movieName: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['LOCKED', 'PAYMENT_PENDING', 'FAILED', 'CONFIRMED'],
    default: 'LOCKED',
  },
  orderId: {
    type: String, 
    index: true,
    unique: true,
    sparse: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } 
  },
}, { timestamps: true });

const BookingSession = mongoose.model('BookingSession', bookingSessionSchema);

module.exports = BookingSession;
