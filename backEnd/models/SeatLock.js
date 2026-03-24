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
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index: documents will self-delete when expiresAt is reached
  }
}, { timestamps: true });

// Create a unique index for (dateId, showTime, seatId) to prevent double locking
// However, the logic will handle re-locking and expiry, so we'll use findOneAndUpdate.
seatLockSchema.index({ dateId: 1, showTime: 1, seatId: 1 }, { unique: true });

const SeatLock = mongoose.model('SeatLock', seatLockSchema);

module.exports = SeatLock;
