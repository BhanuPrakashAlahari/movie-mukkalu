const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

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

    // Delete from TicketBooking
    const result1 = await mongoose.connection.collection('ticketBooking').deleteMany({ dateId, showTime });
    console.log(`Deleted ${result1.deletedCount} bookings from "ticketBooking" for "${showTime}" on March ${dateId}`);

    // Delete from SeatLock
    const result2 = await mongoose.connection.collection('seatlocks').deleteMany({ dateId, showTime });
    console.log(`Deleted ${result2.deletedCount} seat locks from "seatlocks"`);

    // Delete from BookingSession
    const result3 = await mongoose.connection.collection('bookingsessions').deleteMany({ dateId, showTime });
    console.log(`Deleted ${result3.deletedCount} booking sessions from "bookingsessions"`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('Error clearing bookings:', err);
    process.exit(1);
  }
}

clearBookings();
