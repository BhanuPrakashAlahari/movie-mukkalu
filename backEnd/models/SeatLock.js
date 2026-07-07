const mongoose = require('mongoose');

const seatLockSchema = new mongoose.Schema({
  dateId: {
    type: String,
    required: true,
  },
  showTime: {
    type: String,
    required: true,
  },
  seatId: {
    type: String,
    required: true,
  },
  lockedBy: {
    type: String, 
    required: true,
  },
  bookingSessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookingSession',
    index: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } 
  }
}, { timestamps: true });



seatLockSchema.index({ dateId: 1, showTime: 1, seatId: 1 }, { unique: true });

const SeatLock = mongoose.model('SeatLock', seatLockSchema);

module.exports = SeatLock;
