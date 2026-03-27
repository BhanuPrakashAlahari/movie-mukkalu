const mongoose = require('mongoose');

const ticketBookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  dateId: {
    type: String,
    required: true,
  },
  showTime: {
    type: String,
    required: true,
  },
  displayTime: {
    type: String,
    required: true,
  },
  seats: {
    type: [String],
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  movieName: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  paymentId: {
    type: String,
    unique: true,
    sparse: true, // Only enforces uniqueness if the field is present
    index: true,
  },
  orderId: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  visited: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Explicitly naming the collection 'ticketBooking' as requested by the user
const TicketBooking = mongoose.model('TicketBooking', ticketBookingSchema, 'ticketBooking');

module.exports = TicketBooking;
