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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Explicitly naming the collection 'ticketBooking' as requested by the user
const TicketBooking = mongoose.model('TicketBooking', ticketBookingSchema, 'ticketBooking');

module.exports = TicketBooking;
