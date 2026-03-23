const express = require('express');
const router = express.Router();
const TicketBooking = require('../models/Booking');
const { sendBookingEmail } = require('../utils/emailService');


// Get all booked seats for a specific show
router.get('/:dateId/:showTime', async (req, res) => {
  try {
    const { dateId, showTime } = req.params;
    const bookings = await TicketBooking.find({ dateId, showTime });
    
    // Extract all booked seats across all bookings for this show
    const bookedSeats = bookings.reduce((acc, booking) => {
      return [...acc, ...booking.seats];
    }, []);
    
    res.json(bookedSeats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new ticket booking
router.post('/', async (req, res) => {
  const { name, email, dateId, showTime, displayTime, seats, totalPrice, movieName, poster } = req.body;
  
  if (!name || !email || !dateId || !showTime || !displayTime || !seats || seats.length === 0 || !movieName) {
    return res.status(400).json({ message: "Missing required fields for booking." });
  }

  const booking = new TicketBooking({
    name,
    email,
    dateId,
    showTime,
    displayTime,
    seats,
    totalPrice,
    movieName,
    poster
  });

  try {
    // Check if any of the requested seats are already booked for this show
    const existingBookings = await TicketBooking.find({ dateId, showTime });
    const allBookedSeats = existingBookings.reduce((acc, b) => [...acc, ...b.seats], []);
    
    const isAnySeatAlreadyBooked = seats.some(seat => allBookedSeats.includes(seat));
    if (isAnySeatAlreadyBooked) {
      return res.status(400).json({ message: "One or more selected seats are already booked." });
    }

    const newBooking = await booking.save();
    
    // Send confirmation email
    await sendBookingEmail(newBooking);
    
    res.status(201).json(newBooking);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
