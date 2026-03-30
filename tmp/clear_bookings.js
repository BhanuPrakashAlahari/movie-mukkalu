const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backEnd/.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function clearBookings() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not found in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const dateId = '30';
    const showTime = '04-00-PM-07-00-PM';

    // Delete from Booking (TicketBooking)
    const Booking = mongoose.model('Booking', new mongoose.Schema({}, { strict: false }));
    const result1 = await Booking.deleteMany({ dateId, showTime });
    console.log(`Deleted ${result1.deletedCount} bookings for "${showTime}" on March ${dateId}`);

    // Delete from SeatLock
    const SeatLock = mongoose.model('SeatLock', new mongoose.Schema({}, { strict: false }));
    const result2 = await SeatLock.deleteMany({ dateId, showTime });
    console.log(`Deleted ${result2.deletedCount} seat locks`);

    // Delete from BookingSession
    const BookingSession = mongoose.model('BookingSession', new mongoose.Schema({}, { strict: false }));
    const result3 = await BookingSession.deleteMany({ dateId, showTime });
    console.log(`Deleted ${result3.deletedCount} booking sessions`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('Error clearing bookings:', err);
    process.exit(1);
  }
}

clearBookings();
